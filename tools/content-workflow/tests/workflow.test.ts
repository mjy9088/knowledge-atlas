import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync,mkdirSync,mkdtempSync,readFileSync,rmSync,unlinkSync,writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {createWorkflow} from '../workflow.js';

const DIMENSIONS=['value','objective','coherence','reasoning','representation','interaction','surface','source'] as const;
function isObject(value:unknown):value is Record<string,unknown>{return typeof value==='object'&&value!==null&&!Array.isArray(value);}
function object(value:unknown):Record<string,unknown>{if(!isObject(value))throw new TypeError('Expected object');return value;}
function list(value:unknown):unknown[]{if(!Array.isArray(value))throw new TypeError('Expected list');return value;}
function text(value:unknown):string{if(typeof value!=='string')throw new TypeError('Expected text');return value;}

function canonicalPacket():string{
  const targets=['overall','scene-one'];
  const payload={protocol:'content-review-v2',role:'evaluator',targets,authoringIntentStatus:'provided-unverified',authoringArtifacts:[],article:{id:'fixture-article'},page:{slug:'fixture'},quality:null,claims:[],sources:[],representations:[],coverage:{runtimeCode:false},roleExpectations:[],rubric:'fixture-data-not-review-authority',authority:'local-candidate-only'};
  const revision=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  const reports=targets.map(target=>({target,summary:'',findings:[],assessments:DIMENSIONS.map(dimension=>({dimension,verdict:'unverified',critiqueDirection:'fixture-routing-data',expected:'',actual:'',evidenceRefs:[],requestedCorrection:'',invariant:''}))}));
  return JSON.stringify({revision,...payload,resultContract:{protocol:'content-review-v2',revision,provenance:{origin:'external-review-assertion',reviewer:'',reviewedAt:'',verification:'user-assertion',verificationScope:[]},approvalStatus:{expert:'pending',rights:'pending',learner:'pending',publication:'pending'},reports,findings:[]}},null,2);
}

function writeBuild(root:string):void{
  const output='fixture-output',input=readFileSync(path.join(root,'candidate.txt'));
  mkdirSync(path.join(root,'dist'));writeFileSync(path.join(root,'dist','index.html'),output);
  const sha256=(value:string|Buffer)=>createHash('sha256').update(value).digest('hex');
  const manifest={pages:['/knowledge/fixture/'],buildInputs:[{path:'candidate.txt',sha256:sha256(input)}],files:[{path:'index.html',sha256:sha256(output)}]};
  writeFileSync(path.join(root,'dist','build-manifest.json'),JSON.stringify(manifest));
}

function fixture(withBuild:boolean):{readonly root:string;readonly workflow:ReturnType<typeof createWorkflow>}{
  const root=mkdtempSync(path.join(os.tmpdir(),'content-workflow-repo-'));
  writeFileSync(path.join(root,'.gitignore'),'artifacts/\ndist/\n');writeFileSync(path.join(root,'candidate.txt'),'candidate');
  execFileSync('git',['init','--quiet'],{cwd:root,env:{...process.env,GIT_MASTER:'1'}});
  execFileSync('git',['add','.gitignore','candidate.txt'],{cwd:root,env:{...process.env,GIT_MASTER:'1'}});
  if(withBuild)writeBuild(root);
  return {root,workflow:createWorkflow({root,exportPacket:canonicalPacket})};
}

function reportFrom(templateValue:unknown,reviewer:string,lane:'content'|'surface'):Record<string,unknown>{
  const template=object(templateValue),owned=lane==='content'?new Set(['value','objective','coherence','reasoning','source']):new Set(['representation','interaction','surface']);
  const reports=list(template.reports).map(rowValue=>{const row=object(rowValue);return {target:row.target,summary:`${lane}-fixture`,findings:[],assessments:list(row.assessments).map(value=>{
    const dimension=text(object(value).dimension),adequate=owned.has(dimension),evidenceRefs=dimension==='coherence'||dimension==='reasoning'?[{kind:'manuscript',ref:'packet'},{kind:'worked-reasoning',ref:'trace'}]:dimension==='value'||dimension==='objective'?[{kind:'manuscript',ref:'packet'}]:dimension==='source'?[{kind:'source',ref:'source'}]:dimension==='representation'?[{kind:'artifact',ref:'artifact'}]:dimension==='interaction'?[{kind:'execution',ref:'execution'}]:dimension==='surface'?[{kind:'build',ref:'build'},{kind:'viewport',ref:'viewport'},{kind:'artifact',ref:'artifact'}]:[{kind:'user-assertion',ref:'outside-lane'}];
    return {dimension,verdict:adequate?'adequate':'unverified',expected:'fixture-expected',actual:'fixture-actual',evidenceRefs,requestedCorrection:'fixture-correction',invariant:'fixture-invariant'};
  })};});
  return {protocol:template.protocol,revision:template.revision,provenance:{origin:'external-review-assertion',reviewer,reviewedAt:'2026-10-20T12:00:00.000Z',verification:'user-assertion',verificationScope:[lane]},approvalStatus:{expert:'pending',rights:'pending',learner:'pending',publication:'pending'},reports,findings:[]};
}

function prepareReports(root:string,workflow:ReturnType<typeof createWorkflow>):{readonly output:Record<string,unknown>;readonly content:string;readonly surface:string}{
  const output=object(workflow.prepare('fixture','author-session')),directory=text(output.runDirectory),content=path.join(directory,'content-input.json'),surface=path.join(directory,'surface-input.json');
  writeFileSync(content,JSON.stringify(reportFrom(output.templateContract,'content-reviewer','content')));writeFileSync(surface,JSON.stringify(reportFrom(output.templateContract,'surface-reviewer','surface')));
  assert.equal(directory.startsWith(path.join(root,'artifacts','content-workflow')),true);
  return {output,content,surface};
}

test('record rejects stale source and runtime before persisting a lane report',()=>{
  for(const kind of ['source','runtime'] as const){
    const fixtureState=fixture(true);
    try{
      const prepared=prepareReports(fixtureState.root,fixtureState.workflow),directory=text(prepared.output.runDirectory);
      writeFileSync(path.join(fixtureState.root,kind==='source'?'candidate.txt':'dist/index.html'),'changed');
      const status=object(fixtureState.workflow.status(directory));assert.equal(status.state,'stale');assert.equal(object(status.runtime).valid,false);
      assert.throws(()=>fixtureState.workflow.record(directory,'content','content-reviewer',prepared.content),/stale/i);
      assert.equal(existsSync(path.join(directory,'content.report.json')),false);
    }finally{rmSync(fixtureState.root,{recursive:true,force:true});}
  }
});

test('status rejects packet tampering on disk',()=>{
  const fixtureState=fixture(true);
  try{
    const prepared=prepareReports(fixtureState.root,fixtureState.workflow),directory=text(prepared.output.runDirectory),packetFile=text(prepared.output.packetFile);
    const packet=object(JSON.parse(readFileSync(packetFile,'utf8')));packet.authority='tampered';writeFileSync(packetFile,JSON.stringify(packet));
    assert.throws(()=>fixtureState.workflow.status(directory),/revision|hash/i);
  }finally{rmSync(fixtureState.root,{recursive:true,force:true});}
});

test('stored report receipts detect report edits and missing receipts',()=>{
  const state=fixture(true);
  try{
    const prepared=prepareReports(state.root,state.workflow),directory=text(prepared.output.runDirectory);state.workflow.record(directory,'content','content-reviewer',prepared.content);
    const stored=path.join(directory,'content.report.json'),receipt=path.join(directory,'content.receipt.json'),original=readFileSync(stored);
    assert.equal(existsSync(receipt),true);const report=object(JSON.parse(original.toString('utf8'))),provenance=object(report.provenance);provenance.reviewer='mutated-reviewer';writeFileSync(stored,JSON.stringify(report));
    assert.throws(()=>state.workflow.status(directory),/hash/i);
    writeFileSync(stored,original);unlinkSync(receipt);assert.throws(()=>state.workflow.status(directory),/receipt/i);
  }finally{rmSync(state.root,{recursive:true,force:true});}
});

test('complete independent lanes become reviewed only with a bound current build',()=>{
  const built=fixture(true);
  try{
    const prepared=prepareReports(built.root,built.workflow),directory=text(prepared.output.runDirectory);
    assert.equal(object(built.workflow.record(directory,'content','content-reviewer',prepared.content)).state,'awaiting-review');
    assert.equal(object(built.workflow.record(directory,'surface','surface-reviewer',prepared.surface)).state,'reviewed');
  }finally{rmSync(built.root,{recursive:true,force:true});}
  const contentOnly=fixture(false);
  try{
    const prepared=prepareReports(contentOnly.root,contentOnly.workflow),directory=text(prepared.output.runDirectory);
    contentOnly.workflow.record(directory,'content','content-reviewer',prepared.content);const status=object(contentOnly.workflow.record(directory,'surface','surface-reviewer',prepared.surface));
    assert.equal(status.state,'awaiting-review');assert.equal(object(status.runtime).required,true);
  }finally{rmSync(contentOnly.root,{recursive:true,force:true});}
});

test('report import rejects missing dimensions, stale revision, self-review and overwrite, and findings block the gate',()=>{
  const state=fixture(true);
  try{
    const prepared=prepareReports(state.root,state.workflow),directory=text(prepared.output.runDirectory),report=object(JSON.parse(readFileSync(prepared.content,'utf8')));
    assert.throws(()=>state.workflow.record(directory,'content','author-session',prepared.content),/differ from author/);
    const missing=structuredClone(report),first=object(list(missing.reports)[0]);first.assessments=list(first.assessments).slice(1);
    writeFileSync(prepared.content,JSON.stringify(missing));
    assert.throws(()=>state.workflow.record(directory,'content','content-reviewer',prepared.content),/every assessment dimension/);
    const wrongRevision=structuredClone(report);wrongRevision.revision='f'.repeat(64);writeFileSync(prepared.content,JSON.stringify(wrongRevision));
    assert.throws(()=>state.workflow.record(directory,'content','content-reviewer',prepared.content),/identity mismatch/);
    for(const dimension of ['representation','surface','interaction']){
      const invalid=structuredClone(report),assessment=object(list(object(list(invalid.reports)[0]).assessments).find(value=>object(value).dimension===dimension));assessment.verdict='not-applicable';writeFileSync(prepared.content,JSON.stringify(invalid));
      assert.throws(()=>state.workflow.record(directory,'content','content-reviewer',prepared.content),/not-applicable|interaction/i);
    }
    report.findings=[{target:'overall',severity:'revise',reason:'Observed protocol fixture finding',requestedCorrection:'Repair fixture',invariant:'Preserve evidence'}];
    writeFileSync(prepared.content,JSON.stringify(report));
    state.workflow.record(directory,'content','content-reviewer',prepared.content);
    assert.throws(()=>state.workflow.record(directory,'content','content-reviewer',prepared.content),/already exists/);
    assert.equal(object(state.workflow.record(directory,'surface','surface-reviewer',prepared.surface)).state,'needs-revision');
  }finally{rmSync(state.root,{recursive:true,force:true});}
});

test('CLI rejects traversal and malformed command arguments',()=>{
  const cli=['--import','tsx','tools/content-workflow/cli.ts'] as const,root=path.resolve(new URL('../../../',import.meta.url).pathname);
  for(const args of [['prepare','../fixture','author'],['status','../artifacts'],['record','x','content','reviewer']] as const)assert.notEqual(spawnSync(process.execPath,[...cli,...args],{cwd:root,encoding:'utf8'}).status,0);
  assert.equal(spawnSync(process.execPath,[...cli,'--help'],{cwd:root,encoding:'utf8'}).status,0);
});
