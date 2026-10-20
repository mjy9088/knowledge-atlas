export const ASSESSMENT_DIMENSIONS=['value','objective','coherence','reasoning','representation','interaction','surface','source'] as const;
export const HISTORICAL_ASSESSMENT_DIMENSIONS=['objective','reasoning','representation','interaction','surface','source'] as const;
export type AssessmentDimension=typeof ASSESSMENT_DIMENSIONS[number];
export type AssessmentVerdict='adequate'|'revise'|'blocking'|'unverified'|'not-applicable';
export type EvidenceRefKind='source'|'build'|'viewport'|'artifact'|'execution'|'user-assertion'|'manuscript'|'worked-reasoning';
export type EvidenceRef={readonly kind:EvidenceRefKind;readonly ref:string};

export type InteractionIntent=
  |{readonly kind:'interactive';readonly declaration:string}
  |{readonly kind:'static';readonly rationale:string};
export type SlideIntent=
  |{readonly status:'authored';readonly contentRefs:readonly string[];readonly prerequisites:readonly string[];readonly successCheck:string;readonly representationRationale:string;readonly interaction:InteractionIntent}
  |{readonly status:'unplanned';readonly reason:'legacy-intent-absent'};

export type DimensionAssessment={
  readonly dimension:AssessmentDimension;
  readonly verdict:AssessmentVerdict;
  readonly expected:string;
  readonly actual:string;
  readonly evidenceRefs:readonly EvidenceRef[];
  readonly requestedCorrection:string;
  readonly invariant:string;
};
export type LegacyDimensionAssessment={readonly dimension:AssessmentDimension;readonly verdict:AssessmentVerdict;readonly evidence:string;readonly reason:string};

type ObjectValue=Record<string,unknown>;
const isObject=(value:unknown):value is ObjectValue=>typeof value==='object'&&value!==null&&!Array.isArray(value);
const object=(value:unknown):ObjectValue=>{if(!isObject(value))throw Error('Expected object');return value;};
const text=(value:unknown,max=16000):string=>{if(typeof value!=='string'||!value.trim()||value.length>max)throw Error('Invalid text');return value;};
const list=(value:unknown,max=100):unknown[]=>{if(!Array.isArray(value)||value.length>max)throw Error('Invalid list');return value;};
const strings=(value:unknown,max=200):string[]=>list(value).map(item=>text(item,max));

export function parseAssessmentDimension(value:unknown):AssessmentDimension{switch(value){case'value':return'value';case'objective':return'objective';case'coherence':return'coherence';case'reasoning':return'reasoning';case'representation':return'representation';case'interaction':return'interaction';case'surface':return'surface';case'source':return'source';default:throw Error('Invalid assessment dimension');}}
export function parseAssessmentVerdict(value:unknown):AssessmentVerdict{switch(value){case'adequate':return'adequate';case'revise':return'revise';case'blocking':return'blocking';case'unverified':return'unverified';case'not-applicable':return'not-applicable';default:throw Error('Invalid assessment verdict');}}
function parseEvidenceKind(value:unknown):EvidenceRefKind{switch(value){case'source':return'source';case'build':return'build';case'viewport':return'viewport';case'artifact':return'artifact';case'execution':return'execution';case'user-assertion':return'user-assertion';case'manuscript':return'manuscript';case'worked-reasoning':return'worked-reasoning';default:throw Error('Invalid assessment evidence reference kind');}}

export function parseSlideIntent(value:unknown):SlideIntent{
  if(value===undefined)return{status:'unplanned',reason:'legacy-intent-absent'};
  const input=object(value);
  if(input.status==='unplanned'&&input.reason==='legacy-intent-absent')return{status:'unplanned',reason:'legacy-intent-absent'};
  if(input.status!=='authored')throw Error('Invalid slide intent status');
  const rawInteraction=object(input.interaction);
  const interaction:InteractionIntent=rawInteraction.kind==='interactive'
    ?{kind:'interactive',declaration:text(rawInteraction.declaration)}
    :rawInteraction.kind==='static'
      ?{kind:'static',rationale:text(rawInteraction.rationale)}
      :(()=>{throw Error('Invalid slide interaction intent');})();
  const contentRefs=strings(input.contentRefs);
  if(contentRefs.length===0)throw Error('Authored slide intent needs content references');
  return{status:'authored',contentRefs,prerequisites:strings(input.prerequisites),successCheck:text(input.successCheck),representationRationale:text(input.representationRationale),interaction};
}

function requiredEvidenceKinds(dimension:AssessmentDimension,verdict:AssessmentVerdict):readonly EvidenceRefKind[]{
  if(verdict!=='adequate')return[];
  switch(dimension){case'value':case'objective':return['manuscript'];case'coherence':case'reasoning':return['manuscript','worked-reasoning'];case'surface':return['build','viewport','artifact'];case'source':return['source'];case'interaction':return['execution'];case'representation':return['artifact'];default:return assertNever(dimension);}
}

function historicalEvidenceKinds(dimension:AssessmentDimension,verdict:AssessmentVerdict):readonly EvidenceRefKind[]{
  if(verdict!=='adequate')return[];
  switch(dimension){case'objective':case'reasoning':case'representation':return['artifact'];case'interaction':return['execution'];case'surface':return['build','viewport','artifact'];case'source':return['source'];case'value':case'coherence':return requiredEvidenceKinds(dimension,verdict);default:return assertNever(dimension);}
}

function parseEvidenceRefs(value:unknown):EvidenceRef[]{return list(value).map(item=>{const row=object(item);return{kind:parseEvidenceKind(row.kind),ref:text(row.ref,500)};});}

export function parseCurrentAssessment(value:unknown):DimensionAssessment{
  const input=object(value),dimension=parseAssessmentDimension(input.dimension),verdict=parseAssessmentVerdict(input.verdict);
  if(verdict==='not-applicable'&&(dimension==='value'||dimension==='objective'||dimension==='coherence'||dimension==='reasoning'||dimension==='source'))throw Error(`${dimension} assessment cannot be not-applicable`);
  const evidenceRefs=parseEvidenceRefs(input.evidenceRefs);
  if(evidenceRefs.length===0)throw Error(`${dimension} assessment needs evidence references`);
  for(const kind of requiredEvidenceKinds(dimension,verdict))if(!evidenceRefs.some(reference=>reference.kind===kind))throw Error(`${dimension} adequate assessment needs ${kind} evidence`);
  return{dimension,verdict,expected:text(input.expected),actual:text(input.actual),evidenceRefs,requestedCorrection:text(input.requestedCorrection),invariant:text(input.invariant)};
}

export function parseHistoricalStructuredAssessment(value:unknown):DimensionAssessment{
  const input=object(value),dimension=parseAssessmentDimension(input.dimension),verdict=parseAssessmentVerdict(input.verdict);
  if(verdict==='not-applicable'&&(dimension==='objective'||dimension==='reasoning'||dimension==='source'))throw Error(`${dimension} assessment cannot be not-applicable`);
  const evidenceRefs=parseEvidenceRefs(input.evidenceRefs);
  if(evidenceRefs.length===0)throw Error(`${dimension} assessment needs evidence references`);
  for(const kind of historicalEvidenceKinds(dimension,verdict))if(!evidenceRefs.some(reference=>reference.kind===kind))throw Error(`${dimension} adequate assessment needs ${kind} evidence`);
  return{dimension,verdict,expected:text(input.expected),actual:text(input.actual),evidenceRefs,requestedCorrection:text(input.requestedCorrection),invariant:text(input.invariant)};
}

export function parseLegacyAssessment(value:unknown):LegacyDimensionAssessment{
  const input=object(value);
  return{dimension:parseAssessmentDimension(input.dimension),verdict:parseAssessmentVerdict(input.verdict),evidence:text(input.evidence),reason:text(input.reason)};
}

export function isCurrentAssessment(value:DimensionAssessment|LegacyDimensionAssessment):value is DimensionAssessment{return'expected'in value;}
function assertNever(value:never):never{throw Error(`Unexpected assessment dimension: ${String(value)}`);}
