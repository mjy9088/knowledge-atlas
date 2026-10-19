import {ASSESSMENT_DIMENSIONS,POLICIES,validateReport,type Report,type ReviewProvenance,type Topic} from './contracts.js';
import {REPRESENTATION_SELECTION_POLICY,type RepresentationSelectionPolicy} from './representation-policy.js';

export const HANDOFF_PROTOCOL='studio-external-handoff-v2';

type Workspace={readonly directory:string;readonly branch:string;readonly route:string};
type ReviewRow={readonly target:string;readonly report:Report};
type PacketPolicy={readonly id:string;readonly title:string;readonly checks:readonly string[]};
export type WorkResult={readonly protocol:typeof HANDOFF_PROTOCOL;readonly kind:'implementation-result';readonly topicId:string;readonly revision:string;readonly workspace:{readonly directory:string;readonly branch:string};readonly summary:string;readonly checks:readonly string[]};

export type WorkPacket={
  readonly protocol:typeof HANDOFF_PROTOCOL;
  readonly kind:'implementation';
  readonly role:'author';
  readonly topicId:string;
  readonly revision:string;
  readonly workspace:Workspace;
  readonly plan:Topic['plan'];
  readonly policies:readonly PacketPolicy[];
  readonly representationPolicy:RepresentationSelectionPolicy;
  readonly roleExpectations:readonly string[];
  readonly feedback:Topic['feedback'];
  readonly safeguards:readonly string[];
  readonly resultContract:WorkResult;
};

export type ReviewPacket={
  readonly protocol:typeof HANDOFF_PROTOCOL;
  readonly kind:'independent-review';
  readonly role:'evaluator';
  readonly topicId:string;
  readonly revision:string;
  readonly targets:readonly string[];
  readonly plan:Topic['plan'];
  readonly policies:readonly PacketPolicy[];
  readonly representationPolicy:RepresentationSelectionPolicy;
  readonly roleExpectations:readonly string[];
  readonly feedback:Topic['feedback'];
  readonly resultContract:{readonly protocol:typeof HANDOFF_PROTOCOL;readonly topicId:string;readonly revision:string;readonly verification:'user-assertion';readonly reviewer:{readonly name:string;readonly kind:'human'|'external-agent';readonly tool:string};readonly evidence:{readonly reviewedAt:string;readonly notes:string;readonly artifactRefs:readonly string[]};readonly reports:readonly ReviewRow[]};
};

function record(value:unknown):Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Review result must be an object');return value as Record<string,unknown>;}
function requiredText(value:unknown,name:string):string{if(typeof value!=='string'||!value.trim()||value.length>200)throw Error(`Invalid review ${name}`);return value;}
function strings(value:unknown,name:string):string[]{if(!Array.isArray(value)||value.length>100)throw Error(`Invalid ${name}`);return value.map(item=>requiredText(item,name));}
export function validateReviewProvenance(value:unknown,historical=false):ReviewProvenance{const input=record(value),rawReviewer=record(input.reviewer),kind=rawReviewer.kind;if(input.origin!==undefined&&input.origin!=='user-supplied-import')throw Error('Invalid review provenance origin');if(!historical&&input.verification!=='user-assertion')throw Error('Current imported review provenance must remain a user assertion');if(input.verification!==undefined&&input.verification!=='user-assertion')throw Error('Invalid review verification provenance');if(kind!=='human'&&kind!=='external-agent')throw Error('Invalid reviewer kind');const reviewer:ReviewProvenance['reviewer']={name:requiredText(rawReviewer.name,'reviewer name'),kind};if(rawReviewer.tool!==undefined)reviewer.tool=requiredText(rawReviewer.tool,'reviewer tool');const rawEvidence=record(input.evidence),reviewedAt=requiredText(rawEvidence.reviewedAt,'review date');if(!Number.isFinite(Date.parse(reviewedAt)))throw Error('Invalid review date');const result:ReviewProvenance={origin:'user-supplied-import',reviewer,evidence:{reviewedAt,notes:requiredText(rawEvidence.notes,'evidence notes'),artifactRefs:strings(rawEvidence.artifactRefs,'artifact references')}};if(input.verification==='user-assertion')result.verification='user-assertion';return result;}

const policyRows=(topic:Topic):PacketPolicy[]=>topic.plan.policies.map(id=>({id,title:POLICIES[id].title,checks:[...POLICIES[id].checks]}));

export function createWorkPacket(topic:Topic,workspace:Workspace):WorkPacket{return{protocol:HANDOFF_PROTOCOL,kind:'implementation',role:'author',topicId:topic.plan.id,revision:topic.revision,workspace:{...workspace},plan:structuredClone(topic.plan),policies:policyRows(topic),representationPolicy:structuredClone(REPRESENTATION_SELECTION_POLICY),roleExpectations:['Implement each slide only from authored content references, prerequisites, success check, representation rationale, and interaction declaration or reasoned static choice; unplanned intent must remain visibly unresolved.','Keep claims, observations, deductions, definitions, idealizations, and authored analogies distinct; verify exact source locators before calling a claim source-aligned.','Implement interactions only where they answer the learning question, preserving supported/unsupported input, reset, restoration, navigation state, and synchronized feedback.','Preserve stable IDs, accepted edits, scope, and unresolved status; do not evaluate your own work as independent review.','Report only checks actually run; implementation and tests do not establish content quality, source truth, learner understanding, approval, or publication.'],feedback:structuredClone(topic.feedback),safeguards:['Work only in workspace.directory.','Preserve accepted edits and stable IDs.','Do not publish, upload, merge or push.','Run repository checks and report actual results.','Return changes for independent inspection; this packet grants no approval.'],resultContract:{protocol:HANDOFF_PROTOCOL,kind:'implementation-result',topicId:topic.plan.id,revision:topic.revision,workspace:{directory:workspace.directory,branch:workspace.branch},summary:'',checks:[]}};}

export function createReviewPacket(topic:Topic):ReviewPacket{
  const targets=['overall',...topic.plan.slides.map(slide=>slide.id)];
  return{protocol:HANDOFF_PROTOCOL,kind:'independent-review',role:'evaluator',topicId:topic.plan.id,revision:topic.revision,targets,plan:structuredClone(topic.plan),policies:policyRows(topic),representationPolicy:structuredClone(REPRESENTATION_SELECTION_POLICY),roleExpectations:['Evaluate every target independently from the author against its authored success check; missing or retrospective intent remains unplanned rather than inferred.','For every dimension record expected behavior, actual observed behavior, evidence references, requested correction, and the invariant to preserve.','Source is always assessed and cannot be not-applicable. Objective and reasoning also cannot be not-applicable. Keep unexecuted checks unverified.','A rendered-surface adequate judgment must name the checked build identity, viewport, and inspected artifact; this evidence establishes rendering observations, not scientific truth or learner understanding.','For interaction, exercise changed supported input, unsupported input, reset, restoration, and navigation preservation when applicable; a static scene needs a reasoned static intent and observed evidence.','Do not rewrite the candidate, resolve user feedback, or claim content, expert, rights, or publication approval.'],feedback:structuredClone(topic.feedback),resultContract:{protocol:HANDOFF_PROTOCOL,topicId:topic.plan.id,revision:topic.revision,verification:'user-assertion',reviewer:{name:'',kind:'external-agent',tool:''},evidence:{reviewedAt:'',notes:'',artifactRefs:[]},reports:targets.map(target=>({target,report:{summary:'',findings:[],timing:{status:'unverified',note:''},assessments:ASSESSMENT_DIMENSIONS.map(dimension=>({dimension,verdict:'unverified',expected:'',actual:'',evidenceRefs:[],requestedCorrection:'',invariant:''}))}}))}};
}

export function validateWorkResult(value:unknown,topic:Topic,workspace:Workspace):WorkResult{const input=record(value),rawWorkspace=record(input.workspace);if(input.protocol!==HANDOFF_PROTOCOL||input.kind!=='implementation-result')throw Error('Invalid implementation result protocol');if(requiredText(input.topicId,'topic')!==topic.plan.id||requiredText(input.revision,'revision')!==topic.revision)throw Error('Implementation result does not match the current handoff revision');if(requiredText(rawWorkspace.directory,'workspace')!==workspace.directory||requiredText(rawWorkspace.branch,'branch')!==workspace.branch)throw Error('Implementation result workspace does not match');return{protocol:HANDOFF_PROTOCOL,kind:'implementation-result',topicId:topic.plan.id,revision:topic.revision,workspace:{directory:workspace.directory,branch:workspace.branch},summary:requiredText(input.summary,'summary'),checks:strings(input.checks,'implementation checks')};}

export function validateReviewImport(value:unknown,topic:Topic):{readonly rows:readonly ReviewRow[];readonly provenance:ReviewProvenance}{
  const input=record(value);
  if(input.protocol!==HANDOFF_PROTOCOL)throw Error('Invalid review protocol');
  if(requiredText(input.topicId,'topic')!==topic.plan.id)throw Error('Review topic does not match');
  if(requiredText(input.revision,'revision')!==topic.revision)throw Error('Review revision does not match the current saved manuscript');
  const provenance=validateReviewProvenance({verification:input.verification,reviewer:input.reviewer,evidence:input.evidence});
  if(!Array.isArray(input.reports))throw Error('Review reports must be an array');
  const expected=['overall',...topic.plan.slides.map(slide=>slide.id)],seen=new Set<string>();
  const rows=input.reports.map(raw=>{const row=record(raw),target=requiredText(row.target,'target');if(!expected.includes(target)||seen.has(target))throw Error('Invalid or duplicate review target');seen.add(target);const report=validateReport(row.report,topic.plan),notApplicable=report.assessments?.filter(assessment=>assessment.verdict==='not-applicable')??[];if(notApplicable.some(assessment=>assessment.dimension!=='interaction'))throw Error('Only interaction can be not-applicable in a current target assessment');if(notApplicable.length){const slide=topic.plan.slides.find(item=>item.id===target);if(!slide||slide.intent.status!=='authored'||slide.intent.interaction.kind!=='static')throw Error('Interaction can be not-applicable only for a target with reasoned static intent');}return{target,report};});
  if(rows.length!==expected.length||expected.some(target=>!seen.has(target)))throw Error('Review result must include every target exactly once');
  return{rows,provenance};
}
