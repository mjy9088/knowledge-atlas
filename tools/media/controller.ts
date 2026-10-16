import {createExplosionEpisode} from '../../packages/projection/explosion.js';
import {INFERENCE_PRESETS} from '../../packages/projection/presets.js';
import {deriveProof} from '/packages/models/propositional.js';
import {createVideoTimeline,timelineVtt} from '../../packages/projection/timeline.js';
import {drawVideoFrame,encodeVideo,renderPlan} from './renderer.js';
type FormElement = HTMLSelectElement | HTMLInputElement | HTMLButtonElement | HTMLProgressElement;
const $=(id:string)=>{const node=document.getElementById(id);if(!node)throw new Error('Missing renderer element '+id);return node;};
const form=(id:string)=>$(id) as FormElement;
const canvas=$('render-canvas') as HTMLCanvasElement;
const errorOf=(error:unknown)=>error instanceof Error?error:new Error(String(error));
let timeline: ReturnType<typeof createVideoTimeline>,plan: ReturnType<typeof renderPlan>,controller: AbortController,urls: string[]=[],busy=false;
const settings=['render-preset','render-format','render-fps','render-seek'];
const sha=async (data: Uint8Array<ArrayBuffer>)=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',data))].map(x=>x.toString(16).padStart(2,'0')).join('');
function preview(){try{const frame=drawVideoFrame(canvas,timeline,Number(form('render-seek').value));$('render-caption').textContent=`${(frame.timeMs/1000).toFixed(1)}초 · ${frame.title} · ${frame.caption}`;canvas.setAttribute('aria-label',frame.caption);}catch(caught){const error=errorOf(caught);$('render-status').textContent=error.message;}}
function update(){
  const preset=INFERENCE_PRESETS[form('render-preset').value as keyof typeof INFERENCE_PRESETS];timeline=form('render-preset').value==='episode'?createExplosionEpisode():createVideoTimeline({...preset,proof:deriveProof(preset)},{expanded:true});
  const portrait=form('render-format').value==='portrait';plan=renderPlan(timeline,{width:portrait?1080:1920,height:portrait?1440:1080,fps:Number(form('render-fps').value)});
  canvas.width=plan.width;canvas.height=plan.height;($('render-seek') as HTMLInputElement).max=String(timeline.durationMs);form('render-seek').value='0';
  $('render-plan').textContent=`${(plan.durationMs/1000).toFixed(1)}초`+` · ${plan.width}×${plan.height} · ${plan.frameCount}프레임 · 무음`;
  preview();
}
function lock(value: boolean){busy=value;for(const id of settings)(form(id) as HTMLInputElement | HTMLButtonElement | HTMLSelectElement).disabled=value;for(const id of ['render-start','render-smoke'])(form(id) as HTMLInputElement | HTMLButtonElement | HTMLSelectElement).disabled=value;(form('render-cancel') as HTMLButtonElement).disabled=!value;}
function link(id: string,blob: Blob){const url=URL.createObjectURL(blob);urls.push(url);($(id) as HTMLAnchorElement).href=url;return url;}
async function verifyVideo(url: string){
  const video=$('render-video') as HTMLVideoElement;
  video.pause();video.removeAttribute('src');video.load();
  await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>{cleanup();reject(new Error('파일 메타데이터 검사 시간 초과'));},15000);const cleanup=()=>{clearTimeout(timer);video.removeEventListener('loadedmetadata',ok);video.removeEventListener('error',fail);};const ok=()=>{cleanup();resolve();};const fail=()=>{cleanup();reject(new Error('생성한 파일을 이 브라우저에서 열지 못했습니다.'));};video.addEventListener('loadedmetadata',ok);video.addEventListener('error',fail);video.src=url;video.load();});
  return {durationSeconds:video.duration,width:video.videoWidth,height:video.videoHeight};
}
async function run(smoke: boolean){
  if(busy)return;controller=new AbortController();lock(true);($('render-progress') as HTMLProgressElement).value=0;$('render-status').textContent='프레임을 인코딩하는 중입니다.';$('render-output').hidden=true;$('render-diagnostics').textContent='';
  const frozenTimeline=timeline,jobPlan=renderPlan(timeline,{...plan,durationMs:smoke?Math.min(10000,timeline.durationMs):timeline.durationMs});
  try{
    await document.fonts.ready;
    const result=await encodeVideo({canvas,timeline:frozenTimeline,plan:jobPlan,signal:controller.signal,onProgress({completed,total}){($('render-progress') as HTMLProgressElement).value=completed/total;$('render-status').textContent=`${completed} / ${total} 프레임 · ${Math.floor(completed/total*100)}%`;}});
    for(const url of urls)URL.revokeObjectURL(url);urls=[];
    const blob=new Blob([result.bytes],{type:'video/webm'}),url=link('render-download',blob);
    $('render-output').hidden=false;
    let actual: Awaited<ReturnType<typeof verifyVideo>> | null=null,nativePreviewError: string | null=null;
    try{actual=await verifyVideo(url);}catch(caught){const error=errorOf(caught);nativePreviewError=error.message;}
    if(controller.signal.aborted)throw new DOMException('렌더를 취소했습니다.','AbortError');
    if(actual&&(actual.width!==jobPlan.width||actual.height!==jobPlan.height||Math.abs(actual.durationSeconds-jobPlan.durationMs/1000)>.15))throw new Error('출력 해상도/길이가 렌더 계획과 일치하지 않습니다.');
    const manifest={id:'render:logic.inference.local',status:'local-review-candidate',plan:jobPlan,actual,nativePreviewError,packetCount:result.packetCount,outputSha256:await sha(result.bytes),timelineSha256:await sha(new TextEncoder().encode(JSON.stringify(frozenTimeline))),timeline:frozenTimeline,sourceRefs:frozenTimeline.sourceRefs??['source:forallx-calgary-2026'],sourceSnapshotVerified:false,rightsApproved:false,scientificHumanApproval:false,published:false};
    link('render-manifest',new Blob([JSON.stringify(manifest,null,2)],{type:'application/json'}));
    const vttTimeline=smoke?{...frozenTimeline,cues:frozenTimeline.cues.filter(c=>c.startMs<jobPlan.durationMs).map(c=>({...c,endMs:Math.min(c.endMs,jobPlan.durationMs)}))}:frozenTimeline;
    link('render-vtt',new Blob([timelineVtt(vttTimeline)],{type:'text/vtt'}));
    $('render-diagnostics').textContent=`${jobPlan.width}×${jobPlan.height} · 계획 ${(jobPlan.durationMs/1000).toFixed(2)}초 · ${result.packetCount}프레임 · ${(blob.size/1048576).toFixed(2)} MiB · ${actual?'브라우저 메타데이터 확인':'브라우저 미리보기 검사 미완료'} · SHA-256 ${manifest.outputSha256}`;
    $('render-status').textContent=actual?'렌더 완료. 파일의 해상도와 길이를 확인했습니다. 아래에서 재생하거나 저장하세요.':'WebM 프레임 생성 완료. 이 브라우저에서 미리보기를 열지 못했습니다. 파일을 저장하고 로컬 CLI로 검사해 주세요.';
  }catch(caught){const error=errorOf(caught);$('render-status').textContent=error.name==='AbortError'?'렌더를 취소했습니다.':`렌더 실패: ${error.message}`;}
  finally{lock(false);preview();}
}
for(const id of settings.slice(0,3))$(id).addEventListener('change',update);
$('render-seek').addEventListener('input',preview);$('render-start').addEventListener('click',()=>run(false));$('render-smoke').addEventListener('click',()=>run(true));$('render-cancel').addEventListener('click',()=>controller?.abort());
update();$('render-status').textContent=typeof VideoEncoder==='undefined'?'이 브라우저는 WebCodecs를 지원하지 않습니다. 최신 Chrome/Edge에서 열어 주세요.':'설정 후 전체 영상 또는 10초 시험 렌더를 선택하세요.';
