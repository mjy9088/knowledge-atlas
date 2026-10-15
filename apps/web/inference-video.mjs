import {RULES} from '../../packages/models/propositional.mjs';
import {displayFormula} from './formula-display.mjs';
import {expandedCues} from './expanded-timeline.mjs';
// Presentation of one frozen model result; this module never performs inference.
const clone = value => JSON.parse(JSON.stringify(value));
const freeze = value => {if (value && typeof value === 'object') {Object.values(value).forEach(freeze); Object.freeze(value);} return value;};
const label = value => typeof value === 'string' ? value : JSON.stringify(value);
const ruleLabel = id => RULES.find(rule => rule.id === id)?.label ?? id;
const lineLabel = id => String(id).replace(/^line-(\d+)$/,'$1행');
export function createVideoTimeline(input,{expanded=false}={}) {
  const snapshot = clone(input), proof = snapshot.proof ?? {};
  const lines = (proof.lines ?? []).map((line,index) => ({id:line.id ?? index+1,formula:displayFormula(label(line.formula ?? '')),rule:ruleLabel(line.rule ?? ''),dependsOn:[...(line.dependsOn ?? [])]}));
  const premises = (snapshot.premises ?? []).map(value=>displayFormula(label(value))), goal = displayFormula(label(snapshot.goal ?? ''));
  const cues = [{startMs:0,endMs:2500,activeLine:-1,text:`전제: ${premises.join(', ') || '없음'} · 목표: ${goal}`}];
  lines.forEach((line,index) => cues.push({startMs:2500+index*1800,endMs:4300+index*1800,activeLine:index,
    text:`${lineLabel(line.id)}. ${line.formula} · ${line.rule}${line.dependsOn.length ? ' · 참조 '+line.dependsOn.map(lineLabel).join(', ') : ''}`}));
  const endStart = 2500+lines.length*1800;
  cues.push({startMs:endStart,endMs:Math.max(10000,endStart+3000),activeLine:-1,text:proof.goalReached
    ? `목표 ${goal}에 도달했습니다. 지정한 규칙 아래의 도출이며 현실의 참/거짓 판정은 아닙니다.`
    : '이 탐색에서 목표에 도달하지 못했습니다. 일반적인 증명 불가능성을 뜻하지 않습니다.'});
  const presentation=expanded?expandedCues({lines,goal,proof}):{cues};
  return freeze({version:expanded?3:2,sceneId:'scene:logic.inference.lab',modelId:'model:logic.propositional.forward',width:960,height:540,snapshot,premises,goal,lines,...presentation,durationMs:presentation.cues.at(-1).endMs});
}
export function frameAt(timeline,timeMs,{reducedMotion=false}={}) {
  if (typeof timeMs !== 'number' || !Number.isFinite(timeMs) || timeMs<0) throw new RangeError('Time must be finite and non-negative');
  const time = Math.min(timeMs,timeline.durationMs);
  const cue = timeline.cues.find(item => time>=item.startMs && time<item.endMs) ?? timeline.cues.at(-1);
  const transition = reducedMotion ? 1 : Math.min(1,(time-cue.startMs)/450);
  return {timeMs:time,activeLine:cue.activeLine,caption:cue.text,title:cue.title??'',cueId:cue.id??String(cue.startMs),phase:cue.phase??(cue.activeLine>=0?'step':time<2500?'intro':'outro'),transition,
    dependencyPulse:reducedMotion ? 1 : 0.5+0.5*Math.sin((time-cue.startMs)/180),
    visibleLines:cue.activeLine<0 ? ((cue.phase==='intro'||(!cue.phase&&time<2500)) ? [] : timeline.lines) : timeline.lines.slice(0,cue.activeLine+1)};
}
const timestamp = ms => {const sec=Math.floor(ms/1000); return `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor(sec/60)%60).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;};
export function timelineVtt(timeline) {return 'WEBVTT\n\n'+timeline.cues.map((cue,index) => `${index+1}\n${timestamp(cue.startMs)} --> ${timestamp(cue.endMs)}\n${cue.text.replace(/-->/g,'→')}\n`).join('\n');}

export function mountInferenceVideo(container) {
  if (!container) throw new TypeError('Video container is required');
  const doc=container.ownerDocument;
  const make=(tag,text) => {const node=doc.createElement(tag); if(text) node.textContent=text; return node;};
  const heading=make('h3','추론 과정을 재생하기');
  const note=make('p','추론의 뜻과 기호 읽기부터 근거·규칙·결과까지 약 3분으로 설명합니다. 전제나 목표를 바꾸면 새 결과로 자동 갱신됩니다. 음성은 없습니다.');
  const canvas=make('canvas'); canvas.width=960;canvas.height=540;canvas.className='inference-video-canvas';canvas.setAttribute('role','img');
  const mobile=make('div');mobile.className='inference-video-mobile';mobile.setAttribute('aria-label','추론 재생 단계');
  const mobileProgress=make('p'),mobileFormula=make('p'),mobileRule=make('p'),mobileDependencies=make('div');
  mobileProgress.className='inference-video-mobile-progress';mobileFormula.className='inference-video-mobile-formula';mobileRule.className='inference-video-mobile-rule';mobileDependencies.className='inference-video-mobile-dependencies';
  mobile.append(mobileProgress,mobileFormula,mobileRule,mobileDependencies);
  const caption=make('p');caption.className='inference-video-caption';caption.setAttribute('aria-live','polite');
  const controls=make('div');controls.className='video-controls';
  const play=make('button','재생'),restart=make('button','처음부터');
  for(const button of [play,restart]) {button.type='button';button.className='btn';controls.append(button);}
  const seek=make('input');seek.type='range';seek.min=0;seek.step=100;seek.value=0;seek.className='inference-video-seek';seek.setAttribute('aria-label','추론 재생 시점');
  const status=make('p');status.setAttribute('role','timer');status.setAttribute('aria-live','off');
  const details=make('details'),summary=make('summary','재현 데이터와 자막');
  const links=make('p'),vttLink=make('a','자막 VTT'),snapshotLink=make('a','상태 JSON');
  links.append(vttLink,doc.createTextNode(' · '),snapshotLink);details.append(summary,links);
  container.replaceChildren(heading,note,canvas,mobile,caption,controls,seek,status,details);
  const ctx=canvas.getContext('2d'),motion=matchMedia('(prefers-reduced-motion: reduce)');
  let timeline,time=0,playing=false,raf=0,last=0,urls=[],disposed=false,invalid=false,mobileCue=null;
  function split(text,width) {const rows=[];let row='';for(const char of String(text)) {if(ctx.measureText(row+char).width>width && row) {rows.push(row);row='';}row+=char;}rows.push(row);return rows;}
  function fitted(text,x,y,width,height,{size=20,min=14,color='#233b36',bold=false,placeholder='긴 수식 · 전체는 아래 설명/웹 증명에서 확인'}={}) {
    let rows,lineHeight;
    for(let fontSize=size;fontSize>=min;fontSize--) {ctx.font=`${bold?'bold ':''}${fontSize}px sans-serif`;rows=split(text,width);lineHeight=fontSize+3;if(rows.length*lineHeight<=height) {ctx.fillStyle=color;rows.forEach((row,index)=>ctx.fillText(row,x,y+index*lineHeight));return;}}
    ctx.font=`${min}px sans-serif`;ctx.fillStyle=color;ctx.fillText(placeholder,x,y);
  }
  function draw() {
    if(!timeline || disposed || invalid) return;
    const frame=frameAt(timeline,time,{reducedMotion:motion.matches});
    if(mobileCue!==frame.caption) {
      mobileCue=frame.caption;
      const current=timeline.lines[frame.activeLine];
      mobileProgress.textContent=frame.title||(current?`단계 ${frame.activeLine+1} / ${timeline.lines.length}`:(frame.phase==='intro'?'전제와 목표':'추론 결과'));
      mobileFormula.textContent=current?current.formula:frame.caption;
      mobileFormula.classList.toggle('lesson-copy',!current);
      mobileRule.textContent=current?current.rule:(frame.phase==='intro'?'사용할 전제':'지정한 규칙의 제한된 탐색 결과');
      mobileDependencies.replaceChildren();
      const references=current?current.dependsOn.map(id=>timeline.lines.find(line=>line.id===id)).filter(Boolean):frame.phase==='intro'?timeline.premises.map((formula,index)=>({id:`line-${index+1}`,formula})):[];
      for(const ref of references) {const chip=make('span',`${current?'참조 ':''}${lineLabel(ref.id)} · ${ref.formula}`);chip.className='inference-video-dependency';mobileDependencies.append(chip);}
    }
    ctx.globalAlpha=1;ctx.fillStyle='#f7f9f3';ctx.fillRect(0,0,960,540);
    fitted(frame.title||'KNOWLEDGE ATLAS · 추론 재생',36,37,888,28,{size:19,bold:true,color:'#23624d'});
    fitted(`목표  ${timeline.goal}`,36,76,888,44,{size:24,bold:true});
    fitted(`전제  ${timeline.premises.join(', ') || '없음'}`,36,130,888,44,{size:17,placeholder:'긴 전제 목록 · 전체는 아래 설명/웹 증명에서 확인'});
    if(frame.phase==='intro') fitted(frame.caption,40,215,880,190,{size:27,min:18});
    const lines=frame.visibleLines,start=Math.max(0,lines.length-6),active=timeline.lines[frame.activeLine];
    lines.slice(start).forEach((line,offset)=>{
      const isActive=start+offset===frame.activeLine,dependency=active?.dependsOn.includes(line.id),y=194+offset*37;
      if(dependency) {ctx.globalAlpha=0.35+frame.dependencyPulse*0.4;ctx.fillStyle='#ecd9a3';ctx.fillRect(28,y-21,904,35);ctx.globalAlpha=1;}
      if(isActive) {ctx.fillStyle='#dcebd7';ctx.fillRect(28,y-21,904,35);ctx.globalAlpha=frame.transition;}
      const slide=isActive && !motion.matches ? (1-frame.transition)*14:0;
      fitted(`${lineLabel(line.id)}. ${line.formula}`,40+slide,y,565,34,{size:18,min:12,bold:isActive,placeholder:`${lineLabel(line.id)}. 긴 수식 · 아래 설명/웹 증명 참조`});
      fitted(`${line.rule}${line.dependsOn.length?' ['+line.dependsOn.map(lineLabel).join(', ')+']':''}`,620,y,295,34,{size:14,min:11,placeholder:'규칙·참조 전체는 아래 설명에서 확인'});
      ctx.globalAlpha=1;
      if(dependency) {ctx.strokeStyle='#ac873a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(32,y-7);ctx.lineTo(32,194+(lines.length-start-1)*37-7);ctx.stroke();}
    });
    if(start) fitted(`앞선 ${start}개 단계는 웹 증명·자막에서 확인`,40,170,880,18,{size:12,min:12});
    fitted(frame.caption,36,451,888,58,{size:17,min:13,placeholder:'긴 단계 설명 · 전체 수식과 참조는 아래 텍스트에서 확인'});
    fitted('지정한 규칙 · 제한된 탐색 · 현실의 참/거짓 판정 아님 · 검토 전',36,522,888,16,{size:12,min:12,color:'#65756e'});
    ctx.fillStyle='#23624d';ctx.fillRect(0,535,960*time/timeline.durationMs,5);
    if(caption.textContent!==frame.caption) {caption.textContent=frame.caption;canvas.setAttribute('aria-label',frame.caption);}seek.value=time;
    seek.setAttribute('aria-valuetext',`${(time/1000).toFixed(1)}초 / ${(timeline.durationMs/1000).toFixed(1)}초`);
    status.textContent=`${(time/1000).toFixed(1)} / ${(timeline.durationMs/1000).toFixed(1)}초${start?' · 최근 6개 단계 표시':''}${motion.matches?' · 동작 줄이기 적용':''}`;
  }
  function pause() {playing=false;cancelAnimationFrame(raf);play.textContent='재생';}
  function tick(now) {if(!playing) return;time=Math.min(timeline.durationMs,time+Math.max(0,now-last));last=now;draw();if(time>=timeline.durationMs) pause();else raf=requestAnimationFrame(tick);}
  play.addEventListener('click',()=>{if(!timeline || invalid) return;if(playing) pause();else {if(time>=timeline.durationMs) time=0;playing=true;play.textContent='일시정지';last=performance.now();raf=requestAnimationFrame(tick);}});
  restart.addEventListener('click',()=>{pause();time=0;draw();});
  seek.addEventListener('input',()=>{pause();time=Number(seek.value);draw();});
  const motionChange=()=>draw();motion.addEventListener('change',motionChange);
  function revoke() {urls.forEach(url=>URL.revokeObjectURL(url));urls=[];}
  function download(link,blob,name) {const url=URL.createObjectURL(blob);urls.push(url);link.href=url;link.download=name;}
  return {
    pause,
    update(input) {pause();revoke();timeline=createVideoTimeline(input,{expanded:true});mobileCue=null;invalid=false;canvas.hidden=false;mobile.hidden=false;details.hidden=false;caption.hidden=false;for(const control of [play,restart,seek]) control.disabled=false;seek.max=timeline.durationMs;time=0;
      download(vttLink,new Blob([timelineVtt(timeline)],{type:'text/vtt;charset=utf-8'}),'inference-preview.vtt');
      download(snapshotLink,new Blob([JSON.stringify(timeline,null,2)],{type:'application/json'}),'inference-preview.json');draw();},
    invalidate(reason='수식을 완성하면 재생 내용이 자동으로 갱신됩니다.') {pause();invalid=true;canvas.hidden=true;mobile.hidden=true;details.hidden=true;caption.hidden=true;for(const control of [play,restart,seek]) control.disabled=true;status.textContent=reason;},
    seek(timeMs) {if(invalid) throw new Error('Recompute the proof before playback');if(!timeline) return;frameAt(timeline,timeMs);pause();time=Math.min(timeMs,timeline.durationMs);draw();},
    getSnapshot() {return timeline?clone(timeline):null;},
    dispose() {pause();disposed=true;motion.removeEventListener('change',motionChange);revoke();container.replaceChildren();},
  };
}
