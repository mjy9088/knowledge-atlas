import {POLICIES,validateReport,type Report,type ReviewProvenance,type Topic} from './contracts.js';

export const HANDOFF_PROTOCOL='studio-external-handoff-v1';

type Workspace={readonly directory:string;readonly branch:string;readonly route:string};
type ReviewRow={readonly target:string;readonly report:Report};
export type WorkResult={readonly protocol:typeof HANDOFF_PROTOCOL;readonly kind:'implementation-result';readonly topicId:string;readonly revision:string;readonly workspace:{readonly directory:string;readonly branch:string};readonly summary:string;readonly checks:readonly string[]};

export type WorkPacket={
  readonly protocol:typeof HANDOFF_PROTOCOL;
  readonly kind:'implementation';
  readonly topicId:string;
  readonly revision:string;
  readonly workspace:Workspace;
  readonly plan:Topic['plan'];
  readonly feedback:Topic['feedback'];
  readonly safeguards:readonly string[];
  readonly resultContract:WorkResult;
};

export type ReviewPacket={
  readonly protocol:typeof HANDOFF_PROTOCOL;
  readonly kind:'independent-review';
  readonly topicId:string;
  readonly revision:string;
  readonly targets:readonly string[];
  readonly plan:Topic['plan'];
  readonly policies:readonly {readonly id:string;readonly title:string;readonly checks:readonly string[]}[];
  readonly feedback:Topic['feedback'];
  readonly resultContract:{readonly protocol:typeof HANDOFF_PROTOCOL;readonly topicId:string;readonly revision:string;readonly reviewer:{readonly name:string;readonly kind:'human'|'external-agent';readonly tool:string};readonly evidence:{readonly reviewedAt:string;readonly notes:string;readonly artifactRefs:readonly string[]};readonly reports:readonly ReviewRow[]};
};

function record(value:unknown):Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Review result must be an object');return value as Record<string,unknown>;}
function requiredText(value:unknown,name:string):string{if(typeof value!=='string'||!value.trim()||value.length>200)throw Error(`Invalid review ${name}`);return value;}
function strings(value:unknown,name:string):string[]{if(!Array.isArray(value)||value.length>100)throw Error(`Invalid ${name}`);return value.map(item=>requiredText(item,name));}
export function validateReviewProvenance(value:unknown):ReviewProvenance{const input=record(value),rawReviewer=record(input.reviewer),kind=rawReviewer.kind;if(input.origin!==undefined&&input.origin!=='user-supplied-import')throw Error('Invalid review provenance origin');if(kind!=='human'&&kind!=='external-agent')throw Error('Invalid reviewer kind');const reviewer:ReviewProvenance['reviewer']={name:requiredText(rawReviewer.name,'reviewer name'),kind};if(rawReviewer.tool!==undefined)reviewer.tool=requiredText(rawReviewer.tool,'reviewer tool');const rawEvidence=record(input.evidence),reviewedAt=requiredText(rawEvidence.reviewedAt,'review date');if(!Number.isFinite(Date.parse(reviewedAt)))throw Error('Invalid review date');return{origin:'user-supplied-import',reviewer,evidence:{reviewedAt,notes:requiredText(rawEvidence.notes,'evidence notes'),artifactRefs:strings(rawEvidence.artifactRefs,'artifact references')}};}

export function createWorkPacket(topic:Topic,workspace:Workspace):WorkPacket{return{protocol:HANDOFF_PROTOCOL,kind:'implementation',topicId:topic.plan.id,revision:topic.revision,workspace:{...workspace},plan:structuredClone(topic.plan),feedback:structuredClone(topic.feedback),safeguards:['Work only in workspace.directory.','Preserve accepted edits and stable IDs.','Do not publish, upload, merge or push.','Run repository checks and report actual results.','Return changes for independent inspection; this packet grants no approval.'],resultContract:{protocol:HANDOFF_PROTOCOL,kind:'implementation-result',topicId:topic.plan.id,revision:topic.revision,workspace:{directory:workspace.directory,branch:workspace.branch},summary:'',checks:[]}};}

export function createReviewPacket(topic:Topic):ReviewPacket{
  const targets=['overall',...topic.plan.slides.map(slide=>slide.id)];
  return{protocol:HANDOFF_PROTOCOL,kind:'independent-review',topicId:topic.plan.id,revision:topic.revision,targets,plan:structuredClone(topic.plan),policies:topic.plan.policies.map(id=>({id,title:POLICIES[id].title,checks:[...POLICIES[id].checks]})),feedback:structuredClone(topic.feedback),resultContract:{protocol:HANDOFF_PROTOCOL,topicId:topic.plan.id,revision:topic.revision,reviewer:{name:'',kind:'external-agent',tool:''},evidence:{reviewedAt:'',notes:'',artifactRefs:[]},reports:targets.map(target=>({target,report:{summary:'',findings:[],timing:{status:'unverified',note:''}}}))}};
}

export function validateWorkResult(value:unknown,topic:Topic,workspace:Workspace):WorkResult{const input=record(value),rawWorkspace=record(input.workspace);if(input.protocol!==HANDOFF_PROTOCOL||input.kind!=='implementation-result')throw Error('Invalid implementation result protocol');if(requiredText(input.topicId,'topic')!==topic.plan.id||requiredText(input.revision,'revision')!==topic.revision)throw Error('Implementation result does not match the current handoff revision');if(requiredText(rawWorkspace.directory,'workspace')!==workspace.directory||requiredText(rawWorkspace.branch,'branch')!==workspace.branch)throw Error('Implementation result workspace does not match');return{protocol:HANDOFF_PROTOCOL,kind:'implementation-result',topicId:topic.plan.id,revision:topic.revision,workspace:{directory:workspace.directory,branch:workspace.branch},summary:requiredText(input.summary,'summary'),checks:strings(input.checks,'implementation checks')};}

export function validateReviewImport(value:unknown,topic:Topic):{readonly rows:readonly ReviewRow[];readonly provenance:ReviewProvenance}{
  const input=record(value);
  if(input.protocol!==HANDOFF_PROTOCOL)throw Error('Invalid review protocol');
  if(requiredText(input.topicId,'topic')!==topic.plan.id)throw Error('Review topic does not match');
  if(requiredText(input.revision,'revision')!==topic.revision)throw Error('Review revision does not match the current saved manuscript');
  const provenance=validateReviewProvenance({reviewer:input.reviewer,evidence:input.evidence});
  if(!Array.isArray(input.reports))throw Error('Review reports must be an array');
  const expected=['overall',...topic.plan.slides.map(slide=>slide.id)],seen=new Set<string>();
  const rows=input.reports.map(raw=>{const row=record(raw),target=requiredText(row.target,'target');if(!expected.includes(target)||seen.has(target))throw Error('Invalid or duplicate review target');seen.add(target);return{target,report:validateReport(row.report,topic.plan)};});
  if(rows.length!==expected.length||expected.some(target=>!seen.has(target)))throw Error('Review result must include every target exactly once');
  return{rows,provenance};
}
