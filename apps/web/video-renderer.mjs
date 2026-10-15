import {frameAt} from './inference-video.mjs';
import {visualForStep} from './inference-visual.mjs';
import {muxWebM} from './webm-muxer.mjs';
export function renderPlan(timeline,{width=1080,height=1440,fps=30,durationMs=timeline.durationMs}={}){
  if(![[1080,1440],[1920,1080]].some(([w,h])=>w===width&&h===height)||![24,30].includes(fps))throw new RangeError('Supported formats: 1080×1440 / 1920×1080, 24 / 30fps');
  if(!Number.isFinite(durationMs)||durationMs<=0||durationMs>timeline.durationMs)throw new RangeError('Invalid render duration');
  if(height>width&&durationMs>180000)throw new RangeError('Shorts는 최대 180초입니다. 내용을 나누어 별도 편으로 구성하세요.');
  const frameCount=Math.ceil(durationMs*fps/1000);
  return {width,height,fps,frameCount,durationMs:frameCount*1000/fps,audio:'none',codec:'vp8',container:'webm'};
}
export function frameTime(index,plan){if(!Number.isInteger(index)||index<0||index>=plan.frameCount)throw new RangeError('Invalid frame index');return {timeMs:index*1000/plan.fps,timestamp:Math.round(index*1e6/plan.fps),duration:Math.round((index+1)*1e6/plan.fps)-Math.round(index*1e6/plan.fps)};}
function wrap(ctx,text,width){const lines=[];let line='';for(const char of text){if(ctx.measureText(line+char).width>width&&line){lines.push(line);line='';}line+=char;}lines.push(line);return lines;}
function text(ctx,value,x,y,width,{size=28,min=18,height=Infinity,color='#30482d',bold=false,serif=false}={}){
  let rows,lineHeight;for(let font=size;font>=min;font--){ctx.font=`${bold?'bold ':''}${font}px ${serif?'Georgia,':'Arial,'}"Malgun Gothic",sans-serif`;rows=wrap(ctx,String(value),width);lineHeight=font*1.55;if(rows.length*lineHeight<=height){ctx.fillStyle=color;rows.forEach((row,i)=>ctx.fillText(row,x,y+i*lineHeight));return rows.length*lineHeight;}}
  throw new RangeError('Text does not fit the video frame; shorten the formula or select another format');
}
function card(ctx,line,x,y,w,h,{result=false,alpha=1}={}){
  ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=result?'#e6efd7':'#f7faf2';ctx.strokeStyle=result?'#b7ca9f':'#dce5d3';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,20);ctx.fill();ctx.stroke();
  text(ctx,line.label,x+20,y+30,w-40,{size:22,color:'#748569',height:40});
  text(ctx,line.formula,x+20,y+78,w-40,{size:result?62:48,min:20,height:h-85,serif:true});ctx.restore();
}
export function drawVideoFrame(canvas,timeline,timeMs){
  const frame=frameAt(timeline,timeMs),presentation=frame.presentation,ctx=canvas.getContext('2d'),portrait=canvas.height>canvas.width;
  const w=portrait?1080:1920,h=portrait?1440:1080;ctx.save();ctx.scale(canvas.width/w,canvas.height/h);ctx.fillStyle='#f8faf3';ctx.fillRect(0,0,w,h);
  text(ctx,'KNOWLEDGE ATLAS · 로컬 검토용',70,65,w-140,{size:22,color:'#7b896d'});
  text(ctx,timeline.title??'전제에서 결론까지',70,130,w-140,{size:48,bold:true});
  ctx.fillStyle='#fff';ctx.strokeStyle='#dce5d3';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(60,180,w-120,h-370,26);ctx.fill();ctx.stroke();
  text(ctx,`목표 ${presentation.goal}`,90,225,w-180,{size:28,bold:true,height:70});
  const available=w-180,step=frame.activeLine;
  if(step>=0){
    const view=visualForStep({premises:presentation.premises,goal:presentation.goal,proof:presentation.snapshot.proof,step});
    text(ctx,`${step+1} / ${presentation.lines.length} · ${frame.title}`,90,285,available,{size:27,bold:true,height:65});
    const deps=view.dependencies;
    if(portrait){
      if(deps.length){const cw=(available-20)/2;deps.slice(0,2).forEach((line,i)=>card(ctx,line,90+i*(cw+20),325,cw,155));text(ctx,view.rule,90,530,available,{size:27,height:65});text(ctx,'↓',w/2-15,585,50,{size:30});}
      else text(ctx,'입력한 전제 · 추론의 출발점',90,350,available,{size:26});
      card(ctx,view.current,90,deps.length?610:400,available,175,{result:true,alpha:Math.max(.25,frame.transition)});
      text(ctx,frame.caption,90,deps.length?830:650,available,{size:28,min:20,height:deps.length?215:380});
    }else{
      const depW=530;deps.slice(0,2).forEach((line,i)=>card(ctx,line,90,325+i*165,depW,145));
      if(!deps.length)text(ctx,'입력한 전제 · 추론의 출발점',90,395,depW,{size:30,height:150});
      text(ctx,view.rule,670,430,460,{size:28,height:120});text(ctx,'→',850,550,100,{size:40});
      card(ctx,view.current,1190,350,640,220,{result:true,alpha:Math.max(.25,frame.transition)});
      text(ctx,frame.caption,90,700,available,{size:30,min:20,height:175});
    }
  }else{
    text(ctx,frame.title||'추론 결과',90,315,available,{size:36,bold:true,height:120});
    text(ctx,frame.caption,90,portrait?450:460,available,{size:portrait?35:38,min:22,height:portrait?430:290});
    if(frame.phase==='intro')text(ctx,`전제: ${presentation.premises.join(' · ')||'없음'}`,90,portrait?970:800,available,{size:30,min:20,height:100});
  }
  text(ctx,'기호 명제의 제한된 탐색 · 현실의 참·거짓 판정 아님',70,h-140,w-140,{size:22,min:18,height:50,color:'#708164'});
  text(ctx,'근거를 따라, 한 단계씩. · 무음 미리보기 · 내용 검토 전',70,h-80,w-140,{size:22,min:18,height:50,color:'#7b896d'});
  ctx.fillStyle='#94b675';ctx.fillRect(0,h-6,w*frame.timeMs/timeline.durationMs,6);ctx.restore();return frame;
}
export async function encodeVideo({canvas,timeline,plan,onProgress=()=>{},signal}){
  if(typeof VideoEncoder==='undefined')throw new Error('이 브라우저는 WebCodecs VideoEncoder를 지원하지 않습니다. 최신 Chrome/Edge에서 열어 주세요.');
  const config={codec:'vp8',width:plan.width,height:plan.height,framerate:plan.fps,bitrate:3500000,latencyMode:'realtime'};
  if(!(await VideoEncoder.isConfigSupported(config)).supported)throw new Error('이 환경에서 VP8 인코딩을 사용할 수 없습니다.');
  const packets=[];let encoderError;
  const encoder=new VideoEncoder({output(chunk){const data=new Uint8Array(chunk.byteLength);chunk.copyTo(data);packets.push({data,timestamp:chunk.timestamp,key:chunk.type==='key'});},error(error){encoderError=error;}});
  canvas.width=plan.width;canvas.height=plan.height;encoder.configure(config);
  try{
    for(let i=0;i<plan.frameCount;i++){
      if(signal?.aborted)throw new DOMException('렌더를 취소했습니다.','AbortError');if(encoderError)throw encoderError;
      const clock=frameTime(i,plan);drawVideoFrame(canvas,timeline,clock.timeMs);
      const frame=new VideoFrame(canvas,{timestamp:clock.timestamp,duration:clock.duration});try{encoder.encode(frame,{keyFrame:i%(plan.fps*2)===0});}finally{frame.close();}
      if((i+1)%plan.fps===0||i===plan.frameCount-1){await encoder.flush();if(encoderError)throw encoderError;onProgress({completed:i+1,total:plan.frameCount});await new Promise(resolve=>setTimeout(resolve,0));}
    }
    await encoder.flush();if(encoderError)throw encoderError;
    if(signal?.aborted)throw new DOMException('렌더를 취소했습니다.','AbortError');
    if(packets.length!==plan.frameCount)throw new Error(`프레임 누락: ${packets.length}/${plan.frameCount}`);
    return {bytes:muxWebM({...plan,packets}),packetCount:packets.length};
  }finally{if(encoder.state!=='closed')encoder.close();}
}
