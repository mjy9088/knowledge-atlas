import {createHash,randomUUID} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync,renameSync,existsSync} from 'node:fs';
import path from 'node:path';
import {EXAMPLES} from './examples.js';
import {DEFAULT_VIDEO_BUDGETS,validateVideoBudgets,type VideoBudgets,POLICIES,readiness,validatePlan,validateReport,type Plan,type Job,type Feedback,type Topic} from './contracts.js';
import {HANDOFF_PROTOCOL,validateReviewImport,validateReviewProvenance} from './handoff.js';
import {CONTENT_ENTRIES} from '../../content/catalog.js';
import {EXPLOSION_EPISODE} from '../../content/formal-logic/explosion/episode.js';
export const REVIEW_PROTOCOL=HANDOFF_PROTOCOL;
interface State {version:1;videoBudgets:VideoBudgets;plans:Plan[];jobs:Job[];feedback:Record<string,Feedback[]>}
export class Studio {
  private state:State;
  private reference:string;
  private registeredIds=new Set([...CONTENT_ENTRIES.map(entry=>entry.page.slug),EXPLOSION_EPISODE.id]);
  constructor(private root:string,private directory:string){
    mkdirSync(directory,{recursive:true});
    this.reference=readFileSync(path.join(root,'content/statistics/base-rates/article.ko.json'),'utf8');
    this.state={version:1,videoBudgets:{...DEFAULT_VIDEO_BUDGETS},plans:structuredClone(EXAMPLES),jobs:[],feedback:{}};
    if(existsSync(this.file()))this.state=this.load(JSON.parse(readFileSync(this.file(),'utf8')));
    for(const plan of this.state.plans)plan.totalSeconds=this.state.videoBudgets[plan.metadata.format];
    for(const job of this.state.jobs)if(job.status==='running'||job.status==='queued'){job.status='interrupted';job.error='서버 재시작으로 중단됨. 명시적으로 다시 리뷰하세요.';}
    this.persist();
  }
  private file(){return path.join(this.directory,'state.json');}
  private load(raw:unknown):State{
    if(!raw||typeof raw!=='object')throw Error('Invalid studio state');const v=raw as Record<string,unknown>;
    if(v.version!==1||!Array.isArray(v.plans)||!Array.isArray(v.jobs)||!v.feedback||typeof v.feedback!=='object')throw Error('Invalid studio state');
    const plans=v.plans.map(validatePlan);if(new Set(plans.map(p=>p.id)).size!==plans.length)throw Error('Duplicate topic');
    const jobs:Job[]=v.jobs.map(rawJob=>{
      if(!rawJob||typeof rawJob!=='object')throw Error('Invalid job');const j=rawJob as Job;
      if(typeof j.id!=='string'||typeof j.topicId!=='string'||typeof j.target!=='string'||typeof j.revision!=='string'||typeof j.createdAt!=='string'||!['queued','running','completed','failed','cancelled','interrupted'].includes(j.status))throw Error('Invalid job');
      const plan=plans.find(p=>p.id===j.topicId);if(!plan)throw Error('Unknown job topic');
      const job:Job={id:j.id,topicId:j.topicId,target:j.target,revision:j.revision,status:j.status,createdAt:j.createdAt};
      if(j.error!==undefined){if(typeof j.error!=='string')throw Error('Invalid job error');job.error=j.error;}
      // Old reports may refer to deleted slides. Keep them as historical, never as a valid current gate.
      if(j.report)job.report=validateReport(j.report,plan,true);
      if(j.provenance)job.provenance=validateReviewProvenance(j.provenance);
      if(job.status==='completed'&&!job.report)throw Error('Completed job needs report');
      return job;
    });
    const feedback:Record<string,Feedback[]>={};
    for(const [id,rows]of Object.entries(v.feedback)){if(!plans.some(p=>p.id===id)||!Array.isArray(rows))throw Error('Invalid feedback');feedback[id]=rows.map((f:unknown)=>{if(!f||typeof f!=='object')throw Error('Invalid feedback');const x=f as Feedback;if(typeof x.id!=='string'||typeof x.slideId!=='string'||typeof x.text!=='string'||typeof x.revision!=='string'||typeof x.resolved!=='boolean')throw Error('Invalid feedback');return {id:x.id,slideId:x.slideId,text:x.text,resolved:x.resolved,revision:x.revision};});}
    return {version:1,videoBudgets:v.videoBudgets===undefined?{...DEFAULT_VIDEO_BUDGETS}:validateVideoBudgets(v.videoBudgets),plans,jobs,feedback};
  }
  private persist(state:State=this.state){writeFileSync(this.file()+'.tmp',JSON.stringify(state,null,2));renameSync(this.file()+'.tmp',this.file());}
  budgets(){return {...this.state.videoBudgets};}
  budgetRevision(){return createHash('sha256').update(JSON.stringify(this.state.videoBudgets)).digest('hex');}
  setBudgets(raw:unknown,expected:string){if(expected!==this.budgetRevision())throw Error('Conflict: reload video settings');this.state.videoBudgets=validateVideoBudgets(raw);for(const plan of this.state.plans)plan.totalSeconds=this.state.videoBudgets[plan.metadata.format];this.persist();return this.budgets();}
  create(raw:unknown){const plan=validatePlan(raw);if(!/^[a-z][a-z-]+$/.test(plan.id))throw Error('콘텐츠 ID는 소문자와 하이픈으로 입력하세요.');if(this.state.plans.some(p=>p.id===plan.id)||this.registeredIds.has(plan.id))throw Error('Content ID already exists');if(new Set([...this.registeredIds,...this.state.plans.map(item=>item.id)]).size>=100)throw Error('Content limit reached');plan.totalSeconds=this.state.videoBudgets[plan.metadata.format];this.state.plans.push(plan);this.persist();return this.topic(plan.id);}
  revision(plan:Plan){return createHash('sha256').update(JSON.stringify({plan,policies:POLICIES,protocol:REVIEW_PROTOCOL,reference:this.reference})).digest('hex');}
  list():Topic[]{return this.state.plans.map(plan=>{const revision=this.revision(plan),jobs=this.state.jobs.filter(j=>j.topicId===plan.id),feedback=this.state.feedback[plan.id]??[];return structuredClone({plan,revision,jobs,feedback,gate:readiness(plan,revision,jobs,feedback)});});}
  topic(id:string){const topic=this.list().find(p=>p.plan.id===id);if(!topic)throw Error('Unknown topic');return topic;}
  save(raw:unknown,expected:string){const plan=validatePlan(raw),old=this.topic(plan.id);plan.totalSeconds=this.state.videoBudgets[plan.metadata.format];if(old.revision!==expected)throw Error('Conflict: reload before saving');this.state.plans[this.state.plans.findIndex(p=>p.id===plan.id)]=plan;this.persist();return this.topic(plan.id);}
  reset(id:string,expected:string){const seed=EXAMPLES.find(p=>p.id===id);if(!seed)throw Error('No initial draft for this topic');return this.save(seed,expected);}
  feedback(id:string,slideId:string,text:string){const t=this.topic(id);if(!t.plan.slides.some(s=>s.id===slideId)||typeof text!=='string'||!text.trim()||text.length>8000)throw Error('Invalid feedback');const f:Feedback={id:randomUUID(),slideId,text,resolved:false,revision:t.revision};(this.state.feedback[id]??=[]).push(f);this.persist();return f;}
  resolve(id:string,feedbackId:string,resolved:boolean){const f=this.state.feedback[id]?.find(f=>f.id===feedbackId);if(!f||typeof resolved!=='boolean')throw Error('Invalid feedback resolution');f.resolved=resolved;this.persist();}
  importReviews(raw:unknown){const topicId=raw&&typeof raw==='object'&&!Array.isArray(raw)&&typeof (raw as Record<string,unknown>).topicId==='string'?String((raw as Record<string,unknown>).topicId):'';const topic=this.topic(topicId),result=validateReviewImport(raw,topic),createdAt=new Date().toISOString(),nextState:State={...this.state,jobs:[...this.state.jobs,...result.rows.map(row=>({id:randomUUID(),topicId,target:row.target,revision:topic.revision,status:'completed' as const,createdAt,report:row.report,provenance:result.provenance}))]};this.persist(nextState);this.state=nextState;return this.topic(topicId);}
  dispose(){}
}
