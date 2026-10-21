import {activationStatus,type RuntimeAgent} from './activation-status.js';
const address = new URL(process.env['OPENCODE_WORKFLOW_URL'] ?? 'http://127.0.0.1:4096');
if (!['127.0.0.1', 'localhost', '[::1]'].includes(address.hostname)) {
  throw new TypeError('Workflow activation checks require a loopback OpenCode server');
}
const password = process.env['OPENCODE_SERVER_PASSWORD'];
const username = process.env['OPENCODE_SERVER_USERNAME'] ?? 'opencode';
const headers = new Headers();
if (password) headers.set('Authorization', `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`);
async function get(endpoint: string): Promise<unknown> {
  const url = new URL(endpoint, address);
  url.searchParams.set('directory', process.cwd());
  const response = await fetch(url, {headers, signal: AbortSignal.timeout(10000)});
  if (!response.ok) throw new TypeError(`OpenCode registry check failed: HTTP ${response.status}`);
  return response.json();
}
function entries(value:unknown):readonly RuntimeAgent[]{
  if (!Array.isArray(value)) throw new TypeError('Invalid OpenCode registry response');
  return value.flatMap((item:unknown)=>{
    if(typeof item!=='object'||item===null||!('name'in item)||typeof item.name!=='string')return[];
    return[{name:item.name,mode:'mode'in item&&typeof item.mode==='string'?item.mode:'',hidden:'hidden'in item&&item.hidden===true}];
  });
}
const commands=entries(await get('/command')).map(item=>item.name);
const agents=entries(await get('/agent'));
const skills=entries(await get('/skill')).map(item=>item.name);
const config=await get('/config');
const defaultAgent=typeof config==='object'&&config!==null&&'default_agent'in config&&typeof config.default_agent==='string'?config.default_agent:null;
const status=activationStatus({commands,agents,skills,defaultAgent});
console.log(JSON.stringify({...status,directory:process.cwd()},null,2));
if(!status.ready)process.exitCode=1;
