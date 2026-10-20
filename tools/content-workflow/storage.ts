import {closeSync,existsSync,fsyncSync,linkSync,lstatSync,mkdirSync,openSync,readFileSync,realpathSync,unlinkSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {parseSlug} from './contracts.js';

export const productionRoot=realpathSync(new URL('../../',import.meta.url));
export type WorkflowStorage={readonly root:string;readonly artifactRoot:string;readonly createRunDirectory:(slug:string)=>string;readonly resolveRunDirectory:(input:string)=>string};

function ensureDirectory(directory:string):void{
  if(existsSync(directory)){const stat=lstatSync(directory);if(!stat.isDirectory()||stat.isSymbolicLink())throw new TypeError('Workflow artifact path must be a real directory');return;}
  mkdirSync(directory);
}

export function createStorage(rootValue:string):WorkflowStorage{
  const root=realpathSync(rootValue),artifactRoot=path.join(root,'artifacts','content-workflow');
  return {root,artifactRoot,createRunDirectory(slugValue:string):string{
    const slug=parseSlug(slugValue),artifacts=path.join(root,'artifacts');
    ensureDirectory(artifacts);ensureDirectory(artifactRoot);
    const slugDirectory=path.join(artifactRoot,slug);ensureDirectory(slugDirectory);
    const runDirectory=path.join(slugDirectory,randomUUID());mkdirSync(runDirectory);return runDirectory;
  },resolveRunDirectory(input:string):string{
    if(!path.isAbsolute(input))throw new TypeError('Run directory must be the absolute path printed by prepare');
    const relative=path.relative(artifactRoot,path.resolve(input)),parts=relative.split(path.sep);
    if(relative.startsWith('..')||parts.length!==2||parseSlug(parts[0]??'')!==parts[0]||!/^[0-9a-f-]{36}$/.test(parts[1]??''))throw new TypeError('Run directory is outside the workflow artifact root');
    const directory=path.join(artifactRoot,relative);
    if(!existsSync(directory)||lstatSync(directory).isSymbolicLink()||realpathSync(directory)!==directory)throw new TypeError('Run directory must be an existing non-linked artifact directory');
    return directory;
  }};
}

export function writeExclusive(file:string,data:string|Buffer):void{writeFileSync(file,data,{flag:'wx'});}
export function readJson(file:string,maxBytes=16*1024*1024):unknown{
  const stat=lstatSync(file);if(!stat.isFile()||stat.isSymbolicLink()||stat.size>maxBytes)throw new TypeError('JSON input must be a bounded regular file');
  return JSON.parse(readFileSync(file,'utf8'));
}
export function readExternalReport(file:string,maxBytes=16*1024*1024):Buffer{
  const stat=lstatSync(file);if(!stat.isFile()||stat.isSymbolicLink()||stat.size>maxBytes)throw new TypeError('Reviewer report must be a bounded regular file');
  return readFileSync(file);
}
function durableTemporary(directory:string,bytes:Buffer):string{
  const temporary=path.join(directory,`.report-${randomUUID()}.tmp`),descriptor=openSync(temporary,'wx',0o600);
  try{writeFileSync(descriptor,bytes);fsyncSync(descriptor);}finally{closeSync(descriptor);}return temporary;
}
export function persistImmutablePair(reportFile:string,reportBytes:Buffer,receiptFile:string,receiptBytes:Buffer):void{
  if(existsSync(reportFile)||existsSync(receiptFile))throw new TypeError('Accepted lane report already exists');
  const directory=path.dirname(reportFile),reportTemporary=durableTemporary(directory,reportBytes),receiptTemporary=durableTemporary(directory,receiptBytes);
  let reportLinked=false;
  try{linkSync(reportTemporary,reportFile);reportLinked=true;linkSync(receiptTemporary,receiptFile);}
  catch(error){if(reportLinked)unlinkSync(reportFile);throw error;}
  finally{unlinkSync(reportTemporary);unlinkSync(receiptTemporary);}
}
