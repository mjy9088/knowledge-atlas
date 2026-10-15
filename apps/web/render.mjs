import {createExplosionEpisode} from './explosion-episode.mjs';
import {INFERENCE_PRESETS} from './inference-presets.mjs';
import {deriveProof} from '/packages/models/propositional.mjs';
import {createVideoTimeline,timelineVtt} from './inference-video.mjs';
import {drawVideoFrame,encodeVideo,renderPlan} from './video-renderer.mjs';
const $=id=>document.getElementById(id),canvas=$('render-canvas');
let timeline,plan,controller,urls=[],busy=false,lastBlob;
const settings=['render-preset','render-format','render-fps','render-seek'];
const sha=async data=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',data))].map(x=>x.toString(16).padStart(2,'0')).join('');
function preview(){try{const frame=drawVideoFrame(canvas,timeline,Number($('render-seek').value));$('render-caption').textContent=`${(frame.timeMs/1000).toFixed(1)}초 · ${frame.title} · ${frame.caption}`;canvas.setAttribute('aria-label',frame.caption);}catch(error){$('render-status').textContent=error.message;}}
function update(){
  const preset=INFERENCE_PRESETS[$('render-preset').value];timeline=$('render-preset').value==='episode'?createExplosionEpisode():createVideoTimeline({...preset,proof:deriveProof(preset)},{expanded:true});
  const portrait=$('render-format').value==='portrait';plan=renderPlan(timeline,{width:portrait?1080:1920,height:portrait?1440:1080,fps:Number($('render-fps').value)});
  canvas.width=plan.width;canvas.height=plan.height;$('render-seek').max=timeline.durationMs;$('render-seek').value=0;
  $('render-plan').textContent=`${(plan.durationMs/1000).toFixed(1)}초`+` · ${plan.width}×${plan.height} · ${plan.frameCount}프레임 · 무음`;
  preview();
}
function lock(value){busy=value;for(const id of settings)$(id).disabled=value;for(const id of ['render-start','render-smoke'])$(id).disabled=value;$('render-cancel').disabled=!value;$('mp4-convert').disabled=value||!lastBlob;$('mp4-file').disabled=value;}
function link(id,blob){const url=URL.createObjectURL(blob);urls.push(url);$(id).href=url;return url;}
async function verifyVideo(url){
  const video=$('render-video');
  video.pause();video.removeAttribute('src');video.load();
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{cleanup();reject(new Error('파일 메타데이터 검사 시간 초과'));},15000);const cleanup=()=>{clearTimeout(timer);video.removeEventListener('loadedmetadata',ok);video.removeEventListener('error',fail);};const ok=()=>{cleanup();resolve();};const fail=()=>{cleanup();reject(new Error('생성한 파일을 이 브라우저에서 열지 못했습니다.'));};video.addEventListener('loadedmetadata',ok);video.addEventListener('error',fail);video.src=url;video.load();});
  return {durationSeconds:video.duration,width:video.videoWidth,height:video.videoHeight};
}
async function run(smoke){
  if(busy)return;controller=new AbortController();lock(true);$('render-progress').value=0;$('render-status').textContent='프레임을 인코딩하는 중입니다.';$('render-output').hidden=true;$('render-diagnostics').textContent='';
  let encoded=false;
  const frozenTimeline=timeline,jobPlan=renderPlan(timeline,{...plan,durationMs:smoke?Math.min(10000,timeline.durationMs):timeline.durationMs});
  try{
    await document.fonts.ready;
    const result=await encodeVideo({canvas,timeline:frozenTimeline,plan:jobPlan,signal:controller.signal,onProgress({completed,total}){$('render-progress').value=completed/total;$('render-status').textContent=`${completed} / ${total} 프레임 · ${Math.floor(completed/total*100)}%`;}});
    for(const url of urls)URL.revokeObjectURL(url);urls=[];
    const blob=new Blob([result.bytes],{type:'video/webm'}),url=link('render-download',blob);
    $('render-output').hidden=false;
    let actual=null,nativePreviewError=null;
    try{actual=await verifyVideo(url);}catch(error){nativePreviewError=error.message;}
    if(controller.signal.aborted)throw new DOMException('렌더를 취소했습니다.','AbortError');
    if(actual&&(actual.width!==jobPlan.width||actual.height!==jobPlan.height||Math.abs(actual.durationSeconds-jobPlan.durationMs/1000)>.15))throw new Error('출력 해상도/길이가 렌더 계획과 일치하지 않습니다.');
    const manifest={id:'render:logic.inference.local',status:'local-review-candidate',plan:jobPlan,actual,nativePreviewError,packetCount:result.packetCount,outputSha256:await sha(result.bytes),timelineSha256:await sha(new TextEncoder().encode(JSON.stringify(frozenTimeline))),timeline:frozenTimeline,sourceRefs:frozenTimeline.sourceRefs??['source:forallx-calgary-2026'],sourceSnapshotVerified:false,rightsApproved:false,scientificHumanApproval:false,published:false};
    link('render-manifest',new Blob([JSON.stringify(manifest,null,2)],{type:'application/json'}));
    const vttTimeline=smoke?{...frozenTimeline,cues:frozenTimeline.cues.filter(c=>c.startMs<jobPlan.durationMs).map(c=>({...c,endMs:Math.min(c.endMs,jobPlan.durationMs)}))}:frozenTimeline;
    link('render-vtt',new Blob([timelineVtt(vttTimeline)],{type:'text/vtt'}));
    $('render-diagnostics').textContent=`${jobPlan.width}×${jobPlan.height} · 계획 ${(jobPlan.durationMs/1000).toFixed(2)}초 · ${result.packetCount}프레임 · ${(blob.size/1048576).toFixed(2)} MiB · ${actual?'브라우저 메타데이터 확인':'브라우저 미리보기 검사 미완료'} · SHA-256 ${manifest.outputSha256}`;
    $('render-status').textContent=actual?'렌더 완료. 파일의 해상도와 길이를 확인했습니다. 아래에서 재생하거나 저장하세요.':'WebM 프레임 생성 완료. 이 브라우저에서 미리보기를 열지 못했습니다. MP4 만들기로 변환하고 ffprobe 검사를 진행해 주세요.';
    lastBlob=blob;encoded=true;$('mp4-status').textContent='렌더한 WebM을 MP4로 변환합니다.';
  }catch(error){$('render-status').textContent=error.name==='AbortError'?'렌더를 취소했습니다.':`렌더 실패: ${error.message}`;}
  finally{lock(false);preview();}
  if(encoded)await convertMP4();
}
for(const id of settings.slice(0,3))$(id).addEventListener('change',update);
$('render-seek').addEventListener('input',preview);$('render-start').addEventListener('click',()=>run(false));$('render-smoke').addEventListener('click',()=>run(true));$('render-cancel').addEventListener('click',()=>controller?.abort());
update();$('render-status').textContent=typeof VideoEncoder==='undefined'?'이 브라우저는 WebCodecs를 지원하지 않습니다. 최신 Chrome/Edge에서 열어 주세요.':'설정 후 전체 영상 또는 10초 시험 렌더를 선택하세요.';
$('mp4-file').addEventListener('change',()=>{const file=$('mp4-file').files[0];if(!file)return;lastBlob=file;$('mp4-convert').disabled=false;$('mp4-status').textContent=`선택한 파일: ${file.name}`;});
async function convertMP4(){
  if(busy||!lastBlob)return;lock(true);$('render-cancel').disabled=true;$('mp4-status').textContent='로컬 FFmpeg 변환과 ffprobe 검증 중입니다.';
  try{
    const response=await fetch('/api/render/mp4',{method:'POST',headers:{'Content-Type':'video/webm'},body:lastBlob});
    if(!response.ok){let reason;try{reason=(await response.json()).error;}catch{}throw new Error(reason||`HTTP ${response.status}`);}
    const result=await response.json(),stream=result.diagnostics.outputMetadata.streams.find(s=>s.codec_type==='video');
    $('mp4-video').src=result.url;$('mp4-download').href=result.url;$('mp4-report').href=result.diagnosticsUrl;$('mp4-output').hidden=false;
    $('mp4-diagnostics').textContent=`H.264 · ${stream.width}×${stream.height} · ${result.diagnostics.outputMetadata.format.duration}초 · ${stream.nb_frames}프레임 · SHA-256 ${result.diagnostics.outputSha256}`;
    $('mp4-status').textContent='MP4 변환 완료. ffprobe로 길이·해상도·코덱·무음을 확인했습니다.';
    $('render-status').textContent='영상 렌더 완료. MP4의 길이·해상도·코덱·무음을 ffprobe로 확인했습니다.';
  }catch(error){$('mp4-status').textContent=`MP4 변환 실패: ${error.message}`;}finally{lock(false);}
}
$('mp4-convert').addEventListener('click',convertMP4);
