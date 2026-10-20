import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {OWNED_DIMENSIONS,parsePacket,parseReceipt,parseReview,parseRun,parseSession,parseSlug,type Lane,type PacketContract,type ReviewReport,type RunRecord} from './contracts.js';
import {repositoryFingerprint,runtimeBinding,sameRuntime} from './fingerprint.js';
import {createStorage,persistImmutablePair,productionRoot,readExternalReport,readJson,writeExclusive,type WorkflowStorage} from './storage.js';

type WorkflowContext={readonly root:string;readonly exportPacket:(slug:string)=>string;readonly prepareBuild?:()=>void};
type LaneStatus={readonly recorded:boolean;readonly reviewer:string|null;readonly outstanding:readonly string[];readonly findings:number};
type WorkflowState='awaiting-review'|'needs-revision'|'reviewed'|'stale';
export type ContentWorkflow={readonly prepare:(slug:string,authorSession:string)=>unknown;readonly record:(runDirectory:string,lane:Lane,reviewerSession:string,sourceFile:string)=>unknown;readonly status:(runDirectory:string)=>unknown};

function isObject(value:unknown):value is Record<string,unknown>{return typeof value==='object'&&value!==null&&!Array.isArray(value);}
function object(value:unknown):Record<string,unknown>{if(!isObject(value))throw new TypeError('Expected object');return value;}
function reportFile(directory:string,lane:Lane):string{return path.join(directory,`${lane}.report.json`);}
function receiptFile(directory:string,lane:Lane):string{return path.join(directory,`${lane}.receipt.json`);}
function packetAt(directory:string):PacketContract{return parsePacket(readJson(path.join(directory,'packet.json')));}
function existingReport(directory:string,lane:Lane,packet:PacketContract):ReviewReport|null{
  const file=reportFile(directory,lane),receiptPath=receiptFile(directory,lane);
  if(!existsSync(file)&&!existsSync(receiptPath))return null;if(!existsSync(file)||!existsSync(receiptPath))throw new TypeError('Stored report or receipt is missing');
  const bytes=readExternalReport(file),receipt=parseReceipt(readJson(receiptPath),lane,packet.revision),sha256=createHash('sha256').update(bytes).digest('hex');
  if(sha256!==receipt.sha256)throw new TypeError('Stored report hash differs from its receipt');
  const report=parseReview(JSON.parse(bytes.toString('utf8')),packet,receipt.reviewer);
  if(JSON.stringify(report.verificationScope)!==JSON.stringify(receipt.verificationScope))throw new TypeError('Stored report scope differs from its receipt');return report;
}
function laneStatus(report:ReviewReport|null,lane:Lane):LaneStatus{
  if(report===null)return {recorded:false,reviewer:null,outstanding:[...OWNED_DIMENSIONS[lane]],findings:0};
  const outstanding=OWNED_DIMENSIONS[lane].filter(dimension=>[...report.assessments.values()].some(assessments=>{const verdict=assessments.get(dimension)?.verdict;return verdict!=='adequate'&&verdict!=='not-applicable';}));
  return {recorded:true,reviewer:report.reviewer,outstanding,findings:report.findingsCount};
}
function assertIndependent(run:RunRecord,content:ReviewReport|null,surface:ReviewReport|null):void{
  if(content?.reviewer===run.authorSession||surface?.reviewer===run.authorSession)throw new TypeError('Reviewer session must differ from author session');
  if(content!==null&&surface!==null&&content.reviewer===surface.reviewer)throw new TypeError('Each lane requires a different reviewer session');
}
function currentIdentity(root:string,route:string,run:RunRecord):{readonly candidate:string;readonly runtime:ReturnType<typeof runtimeBinding>;readonly runtimeValid:boolean;readonly stale:boolean}{
  const candidate=repositoryFingerprint(root);let runtime:ReturnType<typeof runtimeBinding>=null,runtimeValid=true;
  try{runtime=runtimeBinding(root,route);}catch(error){if(!(error instanceof Error))throw error;runtimeValid=false;}
  return {candidate,runtime,runtimeValid,stale:run.candidateFingerprint!==candidate||!runtimeValid||!sameRuntime(run.runtimeBinding,runtime)};
}

export function createWorkflow(context:WorkflowContext):ContentWorkflow{
  const storage:WorkflowStorage=createStorage(context.root),root=storage.root;
  const status=(runDirectoryValue:string):unknown=>{
    const directory=storage.resolveRunDirectory(runDirectoryValue),run=parseRun(readJson(path.join(directory,'run.json'))),packet=packetAt(directory);
    if(packet.revision!==run.packetRevision)throw new TypeError('Stored packet identity differs from run metadata');
    const contentReport=existingReport(directory,'content',packet),surfaceReport=existingReport(directory,'surface',packet);assertIndependent(run,contentReport,surfaceReport);
    const identity=currentIdentity(root,packet.route,run),content=laneStatus(contentReport,'content'),surface=laneStatus(surfaceReport,'surface'),missing=!content.recorded||!surface.recorded;
    const runtimeRequired=surface.recorded&&run.runtimeBinding===null&&surface.outstanding.length===0,needsRevision=[content,surface].some(lane=>lane.findings>0||lane.outstanding.length>0);
    let state:WorkflowState=needsRevision?'needs-revision':'reviewed';if(missing||runtimeRequired)state='awaiting-review';if(identity.stale)state='stale';
    return {state,candidate:{prepared:run.candidateFingerprint,current:identity.candidate,stale:run.candidateFingerprint!==identity.candidate},runtime:{prepared:run.runtimeBinding,current:identity.runtime,valid:identity.runtimeValid,stale:!identity.runtimeValid||!sameRuntime(run.runtimeBinding,identity.runtime),required:runtimeRequired},lanes:{content,surface},approvalStatus:{expert:'pending',rights:'pending',learner:'pending',publication:'pending'},authority:'reviewed means structurally complete lane review only; it is never approval'};
  };
  return {prepare(slugValue:string,authorSessionValue:string):unknown{
    const slug=parseSlug(slugValue),authorSession=parseSession(authorSessionValue,'author session'),before=repositoryFingerprint(root);context.prepareBuild?.();const packetBytes=context.exportPacket(slug),packet=parsePacket(JSON.parse(packetBytes)),after=repositoryFingerprint(root);
    if(before!==after)throw new TypeError('Repository changed while preparing the review candidate');
    const directory=storage.createRunDirectory(slug),packetFile=path.join(directory,'packet.json'),runFile=path.join(directory,'run.json');
    const run={protocol:'content-workflow-v1',slug,authorSession,createdAt:new Date().toISOString(),candidateFingerprint:after,packetRevision:packet.revision,runtimeBinding:runtimeBinding(root,packet.route)} as const;
    writeExclusive(packetFile,packetBytes);writeExclusive(runFile,JSON.stringify(run,null,2)+'\n');
    return {runDirectory:directory,packetFile,templateContract:packet.templateContract,candidateFingerprint:after,packetRevision:packet.revision,runtimeBinding:run.runtimeBinding};
  },record(runDirectoryValue:string,lane:Lane,reviewerSessionValue:string,sourceFile:string):unknown{
    const directory=storage.resolveRunDirectory(runDirectoryValue),run=parseRun(readJson(path.join(directory,'run.json'))),packet=packetAt(directory),reviewerSession=parseSession(reviewerSessionValue,'reviewer session');
    const otherLane:Lane=lane==='content'?'surface':'content',other=existingReport(directory,otherLane,packet);
    if(reviewerSession===run.authorSession)throw new TypeError('Reviewer session must differ from author session');if(other?.reviewer===reviewerSession)throw new TypeError('Each lane requires a different reviewer session');
    const bytes=readExternalReport(path.resolve(sourceFile)),report=parseReview(JSON.parse(bytes.toString('utf8')),packet,reviewerSession);
    if(currentIdentity(root,packet.route,run).stale)throw new TypeError('Review candidate or runtime is stale; prepare a new run');
    const receipt={protocol:'content-workflow-report-receipt-v1',lane,reviewer:report.reviewer,revision:packet.revision,sha256:createHash('sha256').update(bytes).digest('hex'),verificationScope:report.verificationScope} as const;
    persistImmutablePair(reportFile(directory,lane),bytes,receiptFile(directory,lane),Buffer.from(JSON.stringify(receipt,null,2)+'\n'));return status(directory);
  },status};
}

function exportCanonicalPacket(slug:string):string{
  const result=spawnSync(process.execPath,['--import','tsx','scripts/content-review.ts',slug],{cwd:productionRoot,encoding:'utf8',maxBuffer:32*1024*1024});
  if(result.status!==0)throw new TypeError(result.stderr.trim()||'Canonical content review packet failed');return result.stdout;
}
function buildCanonicalCandidate():void{execFileSync('pnpm',['build'],{cwd:productionRoot,stdio:['ignore',2,2]});}
export const productionWorkflow=createWorkflow({root:productionRoot,exportPacket:exportCanonicalPacket,prepareBuild:buildCanonicalCandidate});
