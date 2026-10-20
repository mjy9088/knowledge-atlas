import {createHash} from 'node:crypto';
import {ASSESSMENT_DIMENSIONS,parseCurrentAssessment,type AssessmentDimension,type DimensionAssessment} from '../studio/quality-contract.js';

export const LANES=['content','surface'] as const;
export type Lane=typeof LANES[number];
export type BoundFile={readonly path:string;readonly sha256:string};
export type RuntimeBinding={readonly manifestFile:'dist/build-manifest.json';readonly manifestSha256:string;readonly route:string;readonly buildInputs:readonly BoundFile[];readonly files:readonly BoundFile[]};
export type RunRecord={readonly protocol:'content-workflow-v1';readonly slug:string;readonly authorSession:string;readonly createdAt:string;readonly candidateFingerprint:string;readonly packetRevision:string;readonly runtimeBinding:RuntimeBinding|null};
export type ReviewReport={readonly reviewer:string;readonly verificationScope:readonly string[];readonly findingsCount:number;readonly assessments:ReadonlyMap<string,ReadonlyMap<AssessmentDimension,DimensionAssessment>>};
export type ReviewReceipt={readonly protocol:'content-workflow-report-receipt-v1';readonly lane:Lane;readonly reviewer:string;readonly revision:string;readonly sha256:string;readonly verificationScope:readonly string[]};
export type PacketContract={readonly revision:string;readonly route:string;readonly targets:readonly string[];readonly templateContract:unknown};

const OBJECT_LIMIT=1000;
const PACKET_KEYS=['protocol','role','targets','authoringIntentStatus','authoringArtifacts','article','page','quality','claims','sources','representations','coverage','roleExpectations','rubric','authority'] as const;
function isObject(value:unknown):value is Record<string,unknown>{return typeof value==='object'&&value!==null&&!Array.isArray(value);}
function object(value:unknown):Record<string,unknown>{if(!isObject(value))throw new TypeError('Expected object');return value;}
function array(value:unknown,max=OBJECT_LIMIT):unknown[]{if(!Array.isArray(value)||value.length>max)throw new TypeError('Expected bounded array');return value;}
function text(value:unknown,name:string,max=16000):string{if(typeof value!=='string'||!value.trim()||value.length>max)throw new TypeError(`Invalid ${name}`);return value;}
function hash(value:unknown,name:string):string{const result=text(value,name,64);if(!/^[a-f0-9]{64}$/.test(result))throw new TypeError(`Invalid ${name}`);return result;}
function uniqueTexts(value:unknown,name:string):readonly string[]{const result=array(value).map(item=>text(item,name,500));if(result.length===0||new Set(result).size!==result.length)throw new TypeError(`Invalid ${name}`);return result;}
function exactPending(value:unknown,name:string):void{if(value!=='pending')throw new TypeError(`${name} must remain pending`);}

export function parseLane(value:string):Lane{switch(value){case'content':return'content';case'surface':return'surface';default:throw new TypeError('Lane must be content or surface');}}
export function parseSlug(value:string):string{if(!/^[a-z][a-z0-9-]*$/.test(value))throw new TypeError('Invalid slug');return value;}
export function parseSession(value:string,name:string):string{if(!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/.test(value))throw new TypeError(`Invalid ${name}`);return value;}

export function parsePacket(value:unknown):PacketContract{
  const packet=object(value);
  if(packet.protocol!=='content-review-v2')throw new TypeError('Canonical packet protocol must be content-review-v2');
  const keys=Object.keys(packet),payload:Record<string,unknown>={};
  if(keys[0]!=='revision'||keys.at(-1)!=='resultContract')throw new TypeError('Canonical packet field order is invalid');
  for(const key of keys)if(key!=='revision'&&key!=='resultContract')payload[key]=packet[key];
  if(Object.keys(payload).length!==PACKET_KEYS.length||PACKET_KEYS.some((key,index)=>Object.keys(payload)[index]!==key))throw new TypeError('Canonical packet fields are invalid');
  const revision=hash(packet.revision,'packet revision'),computed=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  if(revision!==computed)throw new TypeError('Canonical packet revision hash mismatch');
  const targets=uniqueTexts(packet.targets,'packet targets'),template=object(packet.resultContract),page=object(packet.page),slug=parseSlug(text(page.slug,'packet page slug',100));
  if(template.protocol!=='content-review-v2'||template.revision!==revision)throw new TypeError('Canonical result contract identity mismatch');
  const templateTargets=array(template.reports).map(row=>text(object(row).target,'template target',200));
  if(templateTargets.length!==targets.length||targets.some((target,index)=>templateTargets[index]!==target))throw new TypeError('Canonical template targets do not match packet targets');
  return {revision,route:`/knowledge/${slug}/`,targets,templateContract:structuredClone(template)};
}

export function parseRun(value:unknown):RunRecord{
  const run=object(value);
  if(run.protocol!=='content-workflow-v1')throw new TypeError('Invalid workflow run protocol');
  const runtimeValue=run.runtimeBinding;
  let runtimeBinding:RuntimeBinding|null=null;
  if(runtimeValue!==null){
    const runtime=object(runtimeValue);if(runtime.manifestFile!=='dist/build-manifest.json')throw new TypeError('Invalid runtime binding file');
    const files=(value:unknown,name:string):readonly BoundFile[]=>array(value).map(item=>{const row=object(item);return{path:text(row.path,`${name} path`,500),sha256:hash(row.sha256,`${name} hash`)};});
    runtimeBinding={manifestFile:'dist/build-manifest.json',manifestSha256:hash(runtime.manifestSha256,'manifest hash'),route:text(runtime.route,'runtime route',500),buildInputs:files(runtime.buildInputs,'build input'),files:files(runtime.files,'runtime file')};
  }
  const createdAt=text(run.createdAt,'createdAt',40);
  if(!Number.isFinite(Date.parse(createdAt)))throw new TypeError('Invalid createdAt');
  return {protocol:'content-workflow-v1',slug:parseSlug(text(run.slug,'slug',100)),authorSession:parseSession(text(run.authorSession,'author session',200),'author session'),createdAt,candidateFingerprint:hash(run.candidateFingerprint,'candidate fingerprint'),packetRevision:hash(run.packetRevision,'packet revision'),runtimeBinding};
}

function parseFindings(value:unknown,targets:ReadonlySet<string>):number{
  const findings=array(value);
  for(const item of findings){
    const finding=object(item),target=text(finding.target,'finding target',200);
    if(!targets.has(target))throw new TypeError('Finding references an unknown target');
    if(finding.severity!=='blocking'&&finding.severity!=='revise')throw new TypeError('Invalid finding severity');
    text(finding.reason,'finding reason');text(finding.requestedCorrection,'finding correction');text(finding.invariant,'finding invariant');
  }
  return findings.length;
}

export function parseReview(value:unknown,contract:PacketContract,reviewerSession:string):ReviewReport{
  const review=object(value);
  if(review.protocol!=='content-review-v2'||review.revision!==contract.revision)throw new TypeError('Review packet identity mismatch');
  const provenance=object(review.provenance),reviewer=text(provenance.reviewer,'reviewer',200);
  if(provenance.origin!=='external-review-assertion'||provenance.verification!=='user-assertion'||reviewer!==reviewerSession)throw new TypeError('Invalid review provenance');
  const reviewedAt=text(provenance.reviewedAt,'reviewedAt',40);
  if(!Number.isFinite(Date.parse(reviewedAt)))throw new TypeError('Invalid review date');
  const verificationScope=uniqueTexts(provenance.verificationScope,'verification scope');
  const approvals=object(review.approvalStatus);
  exactPending(approvals.expert,'expert');exactPending(approvals.rights,'rights');exactPending(approvals.learner,'learner');exactPending(approvals.publication,'publication');
  const targets=new Set(contract.targets),reports=new Map<string,ReadonlyMap<AssessmentDimension,DimensionAssessment>>();
  let findingsCount=parseFindings(review.findings,targets);
  for(const rowValue of array(review.reports)){
    const row=object(rowValue),target=text(row.target,'report target',200);
    if(!targets.has(target)||reports.has(target))throw new TypeError('Missing, duplicate, or unknown report target');
    text(row.summary,'report summary');findingsCount+=parseFindings(row.findings,targets);
    const assessments=new Map<AssessmentDimension,DimensionAssessment>();
    for(const assessmentValue of array(row.assessments)){
      const assessment=parseCurrentAssessment(assessmentValue);if(assessments.has(assessment.dimension))throw new TypeError('Duplicate assessment dimension');
      if(assessment.verdict==='not-applicable'){
        if(assessment.dimension!=='interaction')throw new TypeError('Only interaction may be not-applicable');
        if(target==='overall'||!assessment.evidenceRefs.some(reference=>reference.kind==='manuscript'||reference.kind==='artifact'))throw new TypeError('Interaction not-applicable needs scene-specific authored static rationale evidence');
      }
      assessments.set(assessment.dimension,assessment);
    }
    if(assessments.size!==ASSESSMENT_DIMENSIONS.length||ASSESSMENT_DIMENSIONS.some(dimension=>!assessments.has(dimension)))throw new TypeError('Report needs every assessment dimension exactly once');
    reports.set(target,assessments);
  }
  if(reports.size!==contract.targets.length||contract.targets.some(target=>!reports.has(target)))throw new TypeError('Review needs every packet target exactly once');
  return {reviewer,verificationScope,findingsCount,assessments:reports};
}

export function parseReceipt(value:unknown,lane:Lane,revision:string):ReviewReceipt{
  const receipt=object(value);
  if(receipt.protocol!=='content-workflow-report-receipt-v1'||receipt.lane!==lane||receipt.revision!==revision)throw new TypeError('Invalid report receipt identity');
  return {protocol:'content-workflow-report-receipt-v1',lane,reviewer:parseSession(text(receipt.reviewer,'receipt reviewer',200),'receipt reviewer'),revision,sha256:hash(receipt.sha256,'report receipt hash'),verificationScope:uniqueTexts(receipt.verificationScope,'receipt verification scope')};
}

export const OWNED_DIMENSIONS={content:['value','objective','coherence','reasoning','source'],surface:['representation','interaction','surface']} as const satisfies Readonly<Record<Lane,readonly AssessmentDimension[]>>;
