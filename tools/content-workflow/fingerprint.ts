import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {existsSync,lstatSync,readFileSync,readlinkSync,realpathSync} from 'node:fs';
import path from 'node:path';
import type {BoundFile,RuntimeBinding} from './contracts.js';

function frame(hash:ReturnType<typeof createHash>,value:string|Buffer):void{
  const bytes=typeof value==='string'?Buffer.from(value):value;
  hash.update(String(bytes.length));hash.update(':');hash.update(bytes);hash.update(';');
}

export function repositoryFingerprint(root:string):string{
  const output=execFileSync('git',['ls-files','-z','--cached','--others','--exclude-standard'],{cwd:root,env:{...process.env,GIT_MASTER:'1'},maxBuffer:16*1024*1024});
  const paths=output.toString('utf8').split('\0').filter(Boolean).sort();
  const hash=createHash('sha256');
  for(const relative of paths){
    if(path.isAbsolute(relative)||relative.split('/').includes('..'))throw new TypeError('Git returned an unsafe path');
    frame(hash,relative);const file=path.join(root,relative);
    if(!existsSync(file)){frame(hash,'missing');continue;}
    const stat=lstatSync(file);
    if(stat.isSymbolicLink()){frame(hash,'symlink');frame(hash,readlinkSync(file));continue;}
    if(stat.isFile()){frame(hash,'file');frame(hash,readFileSync(file));continue;}
    frame(hash,'other');
  }
  return hash.digest('hex');
}

function isObject(value:unknown):value is Record<string,unknown>{return typeof value==='object'&&value!==null&&!Array.isArray(value);}
function manifestRows(value:unknown,base:string,name:string):readonly BoundFile[]{
  if(!Array.isArray(value)||value.length===0)throw new TypeError(`Build manifest ${name} must be a nonempty array`);
  const seen=new Set<string>();
  return value.map(item=>{
    if(!isObject(item)||typeof item.path!=='string'||typeof item.sha256!=='string'||!/^[a-f0-9]{64}$/.test(item.sha256)||path.isAbsolute(item.path)||item.path.includes('\\')||item.path.split('/').some(segment=>!segment||segment==='..'))throw new TypeError(`Invalid build manifest ${name} entry`);
    if(seen.has(item.path))throw new TypeError(`Duplicate build manifest ${name} path`);seen.add(item.path);
    const file=path.resolve(base,item.path),basePath=realpathSync(base);
    if(!file.startsWith(basePath+path.sep)||!existsSync(file))throw new TypeError(`Build manifest ${name} path escapes or is missing`);
    const stat=lstatSync(file);if(!stat.isFile()||stat.isSymbolicLink()||!realpathSync(file).startsWith(basePath+path.sep))throw new TypeError(`Build manifest ${name} path must be a confined regular file`);
    const actual=createHash('sha256').update(readFileSync(file)).digest('hex');if(actual!==item.sha256)throw new TypeError(`Build manifest ${name} hash mismatch`);
    return {path:item.path,sha256:actual};
  });
}

export function runtimeBinding(root:string,route:string):RuntimeBinding|null{
  const dist=path.join(root,'dist'),file=path.join(dist,'build-manifest.json');
  if(!existsSync(file))return null;
  const distStat=lstatSync(dist),stat=lstatSync(file);
  if(!distStat.isDirectory()||distStat.isSymbolicLink()||!stat.isFile()||stat.isSymbolicLink()||realpathSync(file)!==file)throw new TypeError('Build manifest must be a confined regular non-linked file');
  const bytes=readFileSync(file),value:unknown=JSON.parse(bytes.toString('utf8'));
  if(!isObject(value)||!Array.isArray(value.pages)||!value.pages.includes(route))throw new TypeError('Build manifest does not contain the candidate route');
  return {manifestFile:'dist/build-manifest.json',manifestSha256:createHash('sha256').update(bytes).digest('hex'),route,buildInputs:manifestRows(value.buildInputs,root,'buildInputs'),files:manifestRows(value.files,path.join(root,'dist'),'files')};
}

export function sameRuntime(left:RuntimeBinding|null,right:RuntimeBinding|null):boolean{return JSON.stringify(left)===JSON.stringify(right);}
