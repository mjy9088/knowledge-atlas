import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function runMediaTool(tool,args){
  if(!['ffmpeg','ffprobe'].includes(tool))throw new TypeError('Unsupported media tool');
  return new Promise((resolve,reject)=>{
    const child=spawn('mise',['exec','--',tool,...args],{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});let stdout='',stderr='',settled=false;
    const timer=setTimeout(()=>{child.kill();finish(new Error(`${tool} timed out`));},180000);
    function finish(error){if(settled)return;settled=true;clearTimeout(timer);error?reject(error):resolve(stdout);}
    child.stdout.on('data',chunk=>{stdout+=chunk;if(stdout.length>2000000){child.kill();finish(new Error('Unexpectedly large media diagnostics'));}});
    child.stderr.on('data',chunk=>{stderr=(stderr+chunk).slice(-8000);});child.on('error',finish);child.on('close',code=>finish(code===0?null:new Error(`${tool} failed (${code}): ${stderr}`)));
  });
}
export async function probeVideo(file){return JSON.parse(await runMediaTool('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames','-of','json',file]));}
export function validateMedia(probe){
  const video=probe.streams?.find(s=>s.codec_type==='video'),duration=Number(probe.format?.duration);
  if(!video||![[1080,1440],[1920,1080]].some(([w,h])=>video.width===w&&video.height===h)||!Number.isFinite(duration)||duration<=0||duration>600)throw new RangeError('Only supported video dimensions and durations up to 10 minutes can be converted');
  return {video,duration};
}
export async function encodeMP4(input,output){
  const source=await probeVideo(input),before=validateMedia(source);
  await mkdir(path.dirname(output),{recursive:true});
  await runMediaTool('ffmpeg',['-hide_banner','-loglevel','error','-nostdin','-xerror','-n','-protocol_whitelist','file,pipe','-i',input,'-map','0:v:0','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',output]);
  const probe=await probeVideo(output),after=validateMedia(probe);
  if(after.video.codec_name!=='h264'||after.video.width!==before.video.width||after.video.height!==before.video.height||Math.abs(after.duration-before.duration)>.15||probe.streams.some(s=>s.codec_type==='audio'))throw new Error('Encoded media does not match the input geometry/duration/audio contract');
  const bytes=await readFile(output),inputBytes=await readFile(input),diagnostics={status:'local-render-candidate',executor:'mise exec -- ffmpeg',ffmpegVersion:(await runMediaTool('ffmpeg',['-version'])).split('\n')[0].trim(),inputMetadata:source,outputMetadata:probe,inputSha256:createHash('sha256').update(inputBytes).digest('hex'),outputSha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,audio:'none',published:false,sourceSnapshotVerified:false,scientificHumanApproval:false};
  await writeFile(output+'.json',JSON.stringify(diagnostics,null,2));return diagnostics;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2),[input,output]=args;
  const usage='Usage: node scripts/encode-mp4.mjs input.webm output.mp4\nConverts a local video using mise exec -- ffmpeg/ffprobe.\nWrites H.264 MP4 and output.mp4.json diagnostics; existing output is never overwritten.';
  if(args.length===1&&['--help','-h'].includes(input))console.log(usage);
  else if(args.length!==2||!input||!output||input.startsWith('-')||output.startsWith('-')){console.error(usage);process.exitCode=1;}
  else try{console.log(JSON.stringify(await encodeMP4(path.resolve(input),path.resolve(output)),null,2));}catch(error){console.error(error.message);process.exitCode=1;}
}
