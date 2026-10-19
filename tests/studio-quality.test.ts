import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {EXAMPLES} from '../tools/studio/examples.js';
import {Studio} from '../tools/studio/engine.js';
import {
  ASSESSMENT_DIMENSIONS,
  readiness,
  validateReport,
  type DimensionAssessment,
  type Job,
  type Plan,
  type Report
} from '../tools/studio/contracts.js';
import {createReviewPacket,createWorkPacket} from '../tools/studio/handoff.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const assessments:readonly DimensionAssessment[]=ASSESSMENT_DIMENSIONS.map(dimension=>({
  dimension,
  verdict:'adequate',
  expected:`Controlled ${dimension} protocol expectation`,
  actual:`Controlled ${dimension} protocol observation`,
  evidenceRefs:dimension==='surface'?[{kind:'build',ref:'fixture-build'},{kind:'viewport',ref:'1280x720'},{kind:'artifact',ref:'fixture://surface'}]:dimension==='source'?[{kind:'source',ref:'levin-relations'}]:dimension==='interaction'?[{kind:'execution',ref:'fixture://interaction'}]:[{kind:'artifact',ref:`fixture://${dimension}`}],
  requestedCorrection:'No correction requested by this protocol fixture.',
  invariant:'Preserve stable IDs and unresolved approval state.'
}));
const report:Report={summary:'Controlled protocol fixture',findings:[],timing:{status:'unverified',note:'No timing observation'},assessments};

function withAuthoredIntent(plan:Plan):Plan{return{...structuredClone(plan),slides:plan.slides.map(slide=>({...structuredClone(slide),intent:{status:'authored',contentRefs:[...slide.claimRefs],prerequisites:[...slide.known],successCheck:`Protocol success check for ${slide.id}`,representationRationale:`Protocol representation rationale for ${slide.id}`,interaction:{kind:'static',rationale:`Protocol static rationale for ${slide.id}`}}}))};}

function jobsFor(reportForTarget:(target:string)=>Report):Job[]{
  const plan=EXAMPLES[0];
  return ['overall',...plan.slides.map(slide=>slide.id)].map(target=>({id:target,topicId:plan.id,target,revision:'current',status:'completed',createdAt:'test',report:reportForTarget(target)}));
}

test('current reports require one structurally valid assessment for every quality dimension',()=>{
  const plan=EXAMPLES[0],raw={summary:'Fixture',findings:[],timing:{status:'unverified',note:'Fixture'}};
  assert.throws(()=>validateReport(raw,plan),/assessment/i);
  assert.equal(validateReport(raw,plan,true).assessments,undefined);
  assert.throws(()=>validateReport({...raw,assessments:[...assessments,assessments[0]]},plan),/duplicate/i);
  assert.throws(()=>validateReport({...raw,assessments:assessments.map((assessment,index)=>index===0?{...assessment,dimension:'unknown'}:assessment)},plan),/dimension/i);
  assert.throws(()=>validateReport({...raw,assessments:assessments.map((assessment,index)=>index===0?{...assessment,verdict:'passed'}:assessment)},plan),/verdict/i);
  assert.throws(()=>validateReport({...raw,assessments:assessments.map((assessment,index)=>index===0?{...assessment,verdict:'not-applicable'}:assessment)},plan),/objective/i);
  assert.throws(()=>validateReport({...raw,assessments:assessments.map(assessment=>assessment.dimension==='interaction'?{...assessment,verdict:'not-applicable',actual:''}:assessment)},plan),/text/i);
  assert.equal(validateReport({...raw,assessments:assessments.map(assessment=>assessment.dimension==='interaction'?{...assessment,verdict:'not-applicable'}:assessment)},plan).assessments?.length,ASSESSMENT_DIMENSIONS.length);
});

test('readiness rejects missing, revise, blocking, or unverified dimension evidence',()=>{
  const plan=withAuthoredIntent(EXAMPLES[0]);
  const historical:Report={summary:'Legacy report',findings:[],timing:{status:'unverified',note:'Legacy fixture'}};
  assert.equal(readiness(plan,'current',jobsFor(()=>historical),[]).ready,false);
  for(const verdict of ['revise','blocking','unverified'] as const){
    const jobs=jobsFor(target=>target==='overall'?{...report,assessments:assessments.map((assessment,index)=>index===0?{...assessment,verdict}:assessment)}:report);
    assert.equal(readiness(plan,'current',jobs,[]).ready,false);
  }
  assert.equal(readiness(plan,'current',jobsFor(()=>report),[]).ready,true);
});

test('historical reports without assessments remain persisted and cannot satisfy the current gate',()=>{
  const directory=mkdtempSync(path.join(os.tmpdir(),'atlas-quality-history-')),studio=new Studio(root,directory);
  try{
    const topic=studio.topic('binary-relations'),state=JSON.parse(readFileSync(path.join(directory,'state.json'),'utf8'));
    state.jobs=[{id:'legacy',topicId:topic.plan.id,target:'overall',revision:topic.revision,status:'completed',createdAt:'2025-01-01T00:00:00Z',report:{summary:'Preserved legacy summary',findings:[],timing:{status:'unverified',note:'Preserved legacy timing'}}},{id:'legacy-assessments',topicId:topic.plan.id,target:'question',revision:topic.revision,status:'completed',createdAt:'2025-01-02T00:00:00Z',report:{summary:'Preserved legacy assessment rows',findings:[],timing:{status:'unverified',note:'Preserved legacy timing'},assessments:ASSESSMENT_DIMENSIONS.map(dimension=>({dimension,verdict:'adequate',evidence:`Legacy ${dimension} evidence`,reason:`Legacy ${dimension} reason`}))}}];
    studio.dispose();writeFileSync(path.join(directory,'state.json'),JSON.stringify(state));
    const restored=new Studio(root,directory);
    try{const historical=restored.topic(topic.plan.id),legacyRows=historical.jobs[1]?.report?.assessments;assert.equal(historical.jobs[0]?.report?.summary,'Preserved legacy summary');assert.equal(historical.jobs[0]?.report?.assessments,undefined);assert.ok(legacyRows?.[0]&&'evidence'in legacyRows[0]);assert.equal(legacyRows[0].evidence,'Legacy objective evidence');assert.equal(historical.gate.ready,false);}finally{restored.dispose();}
  }finally{studio.dispose();rmSync(directory,{recursive:true,force:true});}
});

test('handoff templates separate author and evaluator roles and begin review dimensions unverified',()=>{
  const plan=EXAMPLES[0],topic={plan,revision:'current',jobs:[],feedback:[],gate:{ready:false,reasons:[]}};
  const work=createWorkPacket(topic,{directory:'/tmp/workspace',branch:'studio/fixture',route:'/knowledge/fixture/'});
  assert.equal(work.role,'author');
  assert.deepEqual(work.policies.map(policy=>policy.id),plan.policies);
  assert.ok(work.roleExpectations.length>0);
  const review=createReviewPacket(topic);
  assert.equal(review.role,'evaluator');
  assert.equal(review.resultContract.verification,'user-assertion');
  assert.ok(review.roleExpectations.length>0);
  for(const row of review.resultContract.reports){
    assert.deepEqual(row.report.assessments?.map(assessment=>assessment.dimension),ASSESSMENT_DIMENSIONS);
    assert.ok(row.report.assessments?.every(assessment=>assessment.verdict==='unverified'));
    assert.ok(row.report.assessments?.every(assessment=>'expected'in assessment&&Array.isArray(assessment.evidenceRefs)));
  }
});

test('handoff packets bind the machine-readable representation policy without changing saved content',()=>{
  // Given: a saved topic with revision-bound feedback.
  const feedback=[{id:'feedback-1',slideId:'question',text:'Keep the accepted comparison.',resolved:false,revision:'current'}];
  const topic={plan:EXAMPLES[0],revision:'current',jobs:[],feedback,gate:{ready:false,reasons:[]}};
  const expectedPolicy={
    version:1,
    selectionBasis:'explanatory-need',
    choices:[
      {technology:'dom',explanatoryFits:['semantic-text','controls','tables']},
      {technology:'svg',explanatoryFits:['labelled-2d','exact-2d-relationships']},
      {technology:'canvas-2d',explanatoryFits:['sampled-images','dense-2d-drawing']},
      {technology:'webgl-2',explanatoryFits:['spatial-fields','depth-occlusion','complex-surfaces','dense-model-geometry']}
    ],
    execution:{adapterMode:'registered-only',embeddedExecutablePayloads:'forbidden'},
    geometry:{source:'pure-model-or-authored-data',coordinateAndScaleConventions:'required',numericalAndRenderingLimits:'required'},
    state:{getState:'required',setState:'validated',reset:'required',independentSeek:'required-when-time-based'},
    fallback:{usableAlternative:'required',limitationsDisclosure:'required',gpuUnavailable:'required-for-webgl-2',contextLoss:'required-for-webgl-2'},
    accessibility:{explanatoryAlternative:'required'},
    resources:{disposal:'required-for-canvas-2d-and-webgl-2'}
  };
  // When: author and independent-review packets are exported.
  const work=createWorkPacket(topic,{directory:'/tmp/workspace',branch:'studio/fixture',route:'/knowledge/fixture/'});
  const review=createReviewPacket(topic);
  // Then: both carry the bounded policy while preserving the saved bindings as detached data.
  assert.deepEqual(work.representationPolicy,expectedPolicy);
  assert.deepEqual(review.representationPolicy,expectedPolicy);
  for(const packet of [work,review]){
    assert.equal(packet.revision,topic.revision);
    assert.deepEqual(packet.plan,topic.plan);
    assert.notEqual(packet.plan,topic.plan);
    assert.deepEqual(packet.feedback,topic.feedback);
    assert.notEqual(packet.feedback,topic.feedback);
  }
});

test('legacy slide intent remains explicitly unplanned and blocks quality readiness',()=>{
  // Given: a legacy manuscript and otherwise adequate protocol-fixture reports.
  const plan=EXAMPLES[0];
  // When: its parsed slide intent and readiness are inspected.
  const intent=Reflect.get(plan.slides[0],'intent');
  const gate=readiness(plan,'current',jobsFor(()=>report),[]);
  // Then: missing historical intent is visible and cannot be treated as authored.
  assert.deepEqual(intent,{status:'unplanned',reason:'legacy-intent-absent'});
  assert.equal(gate.ready,false);
  assert.ok(gate.reasons.some(reason=>reason.includes('intent')));
});

test('current assessment needs structured expected actual evidence correction and invariant fields',()=>{
  // Given: a current source assessment with all structured fields and a source identity.
  const plan=EXAMPLES[0],raw={summary:'Protocol fixture only',findings:[],timing:{status:'unverified',note:'No timing observation'},assessments:ASSESSMENT_DIMENSIONS.map(dimension=>({
    dimension,
    verdict:'adequate',
    expected:'Target-bound protocol expectation',
    actual:'Target-bound protocol observation',
    evidenceRefs:dimension==='surface'?[{kind:'build',ref:'fixture-build'},{kind:'viewport',ref:'1280x720'},{kind:'artifact',ref:'fixture://surface'}]:dimension==='source'?[{kind:'source',ref:plan.sources[0].id}]:dimension==='interaction'?[{kind:'execution',ref:'fixture://interaction'}]:[{kind:'artifact',ref:`fixture://${dimension}`}],
    requestedCorrection:'No correction requested by this protocol fixture.',
    invariant:'Preserve stable IDs and unresolved approval state.'
  }))};
  // When: the report crosses the current-review boundary.
  const parsed=validateReport(raw,plan);
  // Then: the structured fields survive as data rather than prose-only evidence.
  const first=parsed.assessments?.[0],source=parsed.assessments?.find(row=>row.dimension==='source');
  assert.ok(first&&'expected'in first);assert.equal(first.expected,'Target-bound protocol expectation');
  assert.ok(source&&'evidenceRefs'in source);assert.deepEqual(source.evidenceRefs,[{kind:'source',ref:plan.sources[0].id}]);
});

test('source cannot be not-applicable and generic evidence shapes cannot make readiness pass',()=>{
  // Given: legacy prose-only assessments and a source assessment marked not applicable.
  const plan=EXAMPLES[0];
  const sourceNotApplicable={...report,assessments:assessments.map(assessment=>assessment.dimension==='source'?{...assessment,verdict:'not-applicable'}:assessment)};
  // When/Then: source non-applicability is rejected and old generic rows stay historical-only.
  assert.throws(()=>validateReport(sourceNotApplicable,plan),/source/i);
  const legacyRows=ASSESSMENT_DIMENSIONS.map(dimension=>({dimension,verdict:'adequate' as const,evidence:'Generic prose',reason:'Generic prose'}));
  const legacyReport={...report,assessments:legacyRows};
  assert.equal(readiness(withAuthoredIntent(plan),'current',jobsFor(()=>legacyReport),[]).ready,false);
});

test('rendered-surface adequacy requires checked build viewport and artifact identities',()=>{
  // Given: a structured surface judgment that names only an artifact.
  const plan=EXAMPLES[0],raw={summary:'Protocol fixture only',findings:[],timing:{status:'unverified',note:'No timing observation'},assessments:ASSESSMENT_DIMENSIONS.map(dimension=>({
    dimension,
    verdict:'adequate',
    expected:'Expected behavior for the named target',
    actual:'Observed behavior for the named target',
    evidenceRefs:dimension==='interaction'?[{kind:'execution',ref:'fixture://interaction'}]:[{kind:dimension==='source'?'source':'artifact',ref:dimension==='source'?plan.sources[0].id:`fixture://${dimension}`}],
    requestedCorrection:'No correction requested by this protocol fixture.',
    invariant:'Preserve the named target and revision.'
  }))};
  // When/Then: a surface pass without build and viewport identity is rejected.
  assert.throws(()=>validateReport(raw,plan),/surface/i);
});
