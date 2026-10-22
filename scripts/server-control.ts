import {spawn,execFileSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {once} from 'node:events';
import {access,mkdir,open,readFile,rm,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const directory=path.join(root,'.local/servers');
const servers={
  dev:{script:'scripts/dev-server.ts',variable:'PORT',port:4173},
  studio:{script:'tools/studio/server.ts',variable:'STUDIO_PORT',port:4180},
  preview:{script:'scripts/serve-static.ts',variable:'PORT',port:4174},
} as const;
type Server=keyof typeof servers;
type State={pid:number;token:string;port:number};
const [action,name='dev',...extra]=process.argv.slice(2);

function running(state:State):boolean{
  // A PID alone is unsafe after a crash/reboot. Match the unique launch argument
  // before sending any signal; never find or terminate a process by its port.
  try{return execFileSync('ps',['-ww','-p',String(state.pid),'-o','args='],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trimEnd().endsWith(` ${state.token}`);}
  catch(error){
    if((error as NodeJS.ErrnoException).code==='ENOENT')throw new Error('Server control requires the POSIX ps command.');
    return false;
  }
}

async function load(file:string):Promise<State|undefined>{
  let text:string;
  try{text=await readFile(file,'utf8');}
  catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return;throw error;}
  const value:unknown=JSON.parse(text);
  if(!value||typeof value!=='object')throw new Error(`Invalid server state: ${file}`);
  const state=value as Partial<State>;
  if(typeof state.pid!=='number'||!Number.isSafeInteger(state.pid)||state.pid<=1||typeof state.token!=='string'||!/^atlas-managed-[0-9a-f-]{36}$/.test(state.token)||typeof state.port!=='number'||!Number.isInteger(state.port)||state.port<1||state.port>65535)throw new Error(`Invalid server state: ${file}`);
  return state as State;
}

async function stop(file:string):Promise<void>{
  const state=await load(file);
  if(!state||!running(state)){
    await rm(file,{force:true});console.log(`${name}: stopped`);return;
  }
  process.kill(state.pid,'SIGTERM');
  for(let attempt=0;attempt<100;attempt++){
    if(!running(state)){await rm(file,{force:true});console.log(`${name}: stopped`);return;}
    await delay(100);
  }
  throw new Error(`${name}: still running (PID ${state.pid}); inspect logs before retrying stop.`);
}

async function start(server:Server,file:string,log:string):Promise<void>{
  const previous=await load(file);
  if(previous&&running(previous)){
    console.log(`${name}: already running (PID ${previous.pid}) at http://127.0.0.1:${previous.port}`);return;
  }
  const config=servers[server],port=Number(process.env[config.variable]??config.port);
  if(!Number.isInteger(port)||port<1||port>65535)throw new Error(`${config.variable} must be an integer from 1 to 65535.`);
  if(server==='preview')await access(path.join(root,'dist/index.html')).catch(()=>{throw new Error('Static build missing. Run just build before just start preview.');});
  const token=`atlas-managed-${randomUUID()}`,output=await open(log,'w',0o600);
  let state:State;
  try{
    const child=spawn(process.execPath,['--import','tsx',path.join(root,config.script),token],{
      cwd:root,env:{...process.env,[config.variable]:String(port)},detached:true,stdio:['ignore',output.fd,output.fd],
    });
    await once(child,'spawn');
    state={pid:child.pid!,token,port};child.unref();
    try{await writeFile(file,JSON.stringify(state)+'\n',{mode:0o600});}
    catch(error){if(running(state))process.kill(state.pid,'SIGTERM');throw error;}
  }finally{await output.close();}
  const url=`http://127.0.0.1:${port}`;
  for(let attempt=0;attempt<150;attempt++){
    const alive=running(state),text=await readFile(log,'utf8');
    if(!alive){await rm(file,{force:true});throw new Error(`${name}: startup failed.\n${text}`);}
    // Each existing server prints its URL only from the listen callback.
    if(text.includes(url)){console.log(`${name}: running (PID ${state.pid}) at ${url}\nLog: ${log}`);return;}
    await delay(100);
  }
  await stop(file);
  throw new Error(`${name}: startup timed out; inspect ${log}`);
}

async function main():Promise<void>{
  if(!['start','stop','restart','status','logs'].includes(action)||!Object.hasOwn(servers,name)||extra.length)throw new Error('Usage: just <start|stop|restart|status|logs> [dev|studio|preview]');
  const server=name as Server,file=path.join(directory,`${server}.json`),log=path.join(directory,`${server}.log`);
  await mkdir(directory,{recursive:true,mode:0o700});
  if(action==='status'){
    const state=await load(file);
    console.log(state&&running(state)?`${name}: running (PID ${state.pid}) at http://127.0.0.1:${state.port}`:`${name}: stopped`);return;
  }
  if(action==='logs'){
    try{console.log((await readFile(log,'utf8')).trimEnd().split('\n').slice(-80).join('\n'));}
    catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;console.log(`${name}: no log yet`);}return;
  }
  const lock=path.join(directory,`${server}.lock`);
  try{await mkdir(lock);}
  catch(error){if((error as NodeJS.ErrnoException).code!=='EEXIST')throw error;throw new Error(`${name}: another controller is active. If it was killed, remove the stale lock ${lock} only after it exits.`);}
  try{
    if(action==='stop'||action==='restart')await stop(file);
    if(action==='start'||action==='restart')await start(server,file,log);
  }finally{await rm(lock,{recursive:true,force:true});}
}

main().catch(error=>{console.error(error instanceof Error?error.message:String(error));process.exitCode=1;});
