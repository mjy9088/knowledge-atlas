export interface Slide {id:string;title:string;goal:string;narration:string;seconds:number;known:string[];introduces:string[];claimRefs:string[];visual:string;observation:string}
export interface Source {id:string;title:string;url:string;locator:string;consultedOn:string}
export interface Metadata {format:'short'|'long';depth:'light'|'deep';purpose:'interest'|'understanding'|'practice';topics:string[];prerequisites:string[];inScope:string[];outOfScope:string[];outcome:string}
export interface Plan {id:string;domain:string;title:string;goal:string;audience:string;metadata:Metadata;totalSeconds:number;policies:string[];openQuestions:string[];sources:Source[];claims:{id:string;text:string;sourceRefs:string[]}[];slides:Slide[]}
export interface Finding {slideId:string;criterion:string;severity:'blocker'|'warning';evidence:string;suggestion:string}
export interface Report {summary:string;findings:Finding[];timing:{status:'estimated'|'unverified';note:string}}
export interface Feedback {id:string;slideId:string;text:string;resolved:boolean;revision:string}
export interface Job {id:string;topicId:string;target:string;revision:string;status:'queued'|'running'|'completed'|'failed'|'cancelled'|'interrupted';createdAt:string;error?:string;report?:Report}
export interface Topic {plan:Plan;revision:string;feedback:Feedback[];jobs:Job[];gate:{ready:boolean;reasons:string[]}}
export interface VideoBudgets {short:number;long:number}
export const DEFAULT_VIDEO_BUDGETS:VideoBudgets={short:180,long:900};
export function validateVideoBudgets(value:unknown):VideoBudgets{const v=object(value);for(const k of ['short','long'])if(typeof v[k]!=='number'||!Number.isInteger(v[k])||Number(v[k])<1||Number(v[k])>14400)throw Error('영상 시간은 1~14400초의 정수여야 합니다.');if(Number(v.short)>Number(v.long))throw Error('짧은 타입의 영상 예산이 긴 타입보다 클 수 없습니다.');return{short:Number(v.short),long:Number(v.long)};}
export const POLICIES:Record<string,{title:string;checks:string[]}>={
  core:{title:'설명 흐름 · 정확성 · 시간',checks:['전체 목표와 이 슬라이드의 역할이 일치하는가? 전후 연결과 필수 개념의 최초 도입을 확인한다.','주장과 출처의 범위, 예시와 일반 명제, 기호·시각 자료의 의미를 구분한다.','내용량·새 개념·영상에 실제로 보여 줄 관찰/조작 장면과 영상 계획 초를 비교한다. 웹 읽기·조작 시간은 무제한이며 영상 예산에 합산하지 않는다. 음성·영상 실측이 없으면 시간은 추정/미검증이라고 명시한다.','그림 설명만으로 실제 구현 화면이나 영상의 가독성을 검증했다고 주장하지 않는다.']},
  observation:{title:'관측·선택 과정이 있는 조건부확률',checks:['모집단/표본공간, 사전확률, 독립성, 정보 제공/선별 규칙, 실제 관측 사건, 구하려는 사건을 명시한다.','관측 문장이 참이라는 것과 그 문장이 전달될 확률을 구분하고, 절차별 우도를 비교한다.','빠진 절차가 답을 바꾸는 반례와, 답을 바꾸지 않는 조건을 구분한다. 조건 부족은 오답으로 채점하지 않는다.','이름 붙은 특정 관측과 거친 관측, 무조건 전략 승률과 관측 후 사후확률을 혼동하지 않는다.','표본의 가중치를 유지한다. 생존 경우의 수만 세어 서로 다른 우도를 지우지 않는다. 모집단→관측 과정→관측한 집합의 분모를 확인한다.']},
  formal:{title:'수학적 정의 · 모형 · 여러 표현',checks:['정의의 대상·정의역·기호·순서·단위를 명시하고 정의와 추가 가정을 구분한다.','문장·표·수식·그림이 같은 대상을 표현하는지, 경계/빈 경우에도 맞는지 확인한다.','전체 양화 조건과 한 사례, 반례와 일반적 증명, 필요조건과 충분조건을 구분한다.']}
};
function object(value:unknown):Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Expected object');return value as Record<string,unknown>;}
function text(value:unknown,max=16000):string{if(typeof value!=='string'||!value.trim()||value.length>max)throw Error('Invalid text');return value;}
function list(value:unknown,max=100):unknown[]{if(!Array.isArray(value)||value.length>max)throw Error('Invalid list');return value;}
function strings(value:unknown):string[]{return list(value).map(v=>text(v,200));}
function id(value:unknown){const result=text(value,100);if(!/^[a-z0-9][a-z0-9-]*$/.test(result))throw Error('Invalid ID');return result;}
function metadata(value:unknown,plan:Record<string,unknown>):Metadata{
  // Missing metadata is the sole legacy migration. Never replace malformed or edited fields.
  const v=value===undefined?{format:Number(plan.totalSeconds)>180?'long':'short',depth:'light',purpose:'understanding',topics:[plan.title],prerequisites:[],inScope:[plan.goal],outOfScope:[],outcome:plan.goal}:object(value);
  if(!['short','long'].includes(String(v.format))||!['light','deep'].includes(String(v.depth))||!['interest','understanding','practice'].includes(String(v.purpose)))throw Error('Invalid content metadata');
  return {format:v.format as Metadata['format'],depth:v.depth as Metadata['depth'],purpose:v.purpose as Metadata['purpose'],topics:list(v.topics).map(x=>text(x)),prerequisites:list(v.prerequisites).map(x=>text(x)),inScope:list(v.inScope).map(x=>text(x)),outOfScope:list(v.outOfScope).map(x=>text(x)),outcome:text(v.outcome)};
}
export function validatePlan(value:unknown):Plan{
  const v=object(value);const plan:Plan={id:id(v.id),domain:id(v.domain??(v.id==='binary-relations'?'mathematics':'statistics')),title:text(v.title,200),goal:text(v.goal),audience:text(v.audience),metadata:metadata(v.metadata,v),totalSeconds:Number(v.totalSeconds),policies:strings(v.policies),openQuestions:strings(v.openQuestions),sources:list(v.sources).map(item=>{const s=object(item);const url=text(s.url),parsed=new URL(url);if(parsed.protocol!=='https:'||!parsed.hostname)throw Error('Source needs HTTPS');return {id:id(s.id),title:text(s.title),url,locator:text(s.locator),consultedOn:text(s.consultedOn,30)};}),claims:list(v.claims).map(item=>{const c=object(item);return {id:id(c.id),text:text(c.text),sourceRefs:strings(c.sourceRefs)};}),slides:list(v.slides,160).map(item=>{const s=object(item);if(typeof s.seconds!=='number')throw Error('Slide seconds must be numeric');return {id:id(s.id),title:text(s.title,200),goal:text(s.goal),narration:text(s.narration),seconds:s.seconds,known:strings(s.known),introduces:strings(s.introduces),claimRefs:strings(s.claimRefs),visual:text(s.visual),observation:text(s.observation)};})};
  if(!/^[a-z][a-z0-9-]*$/.test(plan.domain))throw Error('Invalid domain');
  if(!plan.slides.length||typeof v.totalSeconds!=='number'||!Number.isFinite(plan.totalSeconds)||plan.totalSeconds<1||plan.totalSeconds>14400)throw Error('Invalid duration');
  for(const rows of [plan.slides,plan.claims,plan.sources])if(new Set(rows.map(r=>r.id)).size!==rows.length)throw Error('Duplicate IDs');
  if(!plan.policies.includes('core')||plan.policies.some(p=>!POLICIES[p]))throw Error('Unknown/missing policy');
  for(const c of plan.claims)if(!c.sourceRefs.length||c.sourceRefs.some(s=>!plan.sources.some(x=>x.id===s)))throw Error('Unknown claim source');
  for(const s of plan.slides)if(!Number.isFinite(s.seconds)||s.seconds<1||s.seconds>600||!s.claimRefs.length||s.claimRefs.some(c=>!plan.claims.some(x=>x.id===c)))throw Error('Invalid slide duration/claims');
  return plan;
}
export function validateReport(value:unknown,plan:Plan,historical=false):Report{
  const r=object(value),timing=object(r.timing);if(!['estimated','unverified'].includes(String(timing.status)))throw Error('Invalid timing review');
  return {summary:text(r.summary),timing:{status:timing.status as Report['timing']['status'],note:text(timing.note)},findings:list(r.findings).map(item=>{const f=object(item),slideId=id(f.slideId);if(!['blocker','warning'].includes(String(f.severity))||(!historical&&slideId!=='overall'&&!plan.slides.some(s=>s.id===slideId)))throw Error('Invalid finding target/severity');return {slideId,criterion:text(f.criterion),severity:f.severity as Finding['severity'],evidence:text(f.evidence),suggestion:text(f.suggestion)};})};
}
export function readiness(plan:Plan,revision:string,jobs:Job[],feedback:Feedback[]){
  const reasons:string[]=[];if(plan.openQuestions.length)reasons.push('미결 기획 질문');
  if(plan.slides.reduce((n,s)=>n+s.seconds,0)>plan.totalSeconds)reasons.push('영상 재생 시간 예산 초과');
  for(const target of ['overall',...plan.slides.map(s=>s.id)]){
    const latest=jobs.filter(j=>j.revision===revision&&j.target===target).at(-1);
    if(!latest||latest.status!=='completed'||!latest.report)reasons.push(`${target}: 유효한 리뷰 없음`);
    else if(latest.report.findings.some(f=>f.severity==='blocker'))reasons.push(`${target}: 차단 지적`);
  }
  if(feedback.some(f=>!f.resolved))reasons.push('미해결 사용자 피드백');
  return {ready:reasons.length===0,reasons};
}
