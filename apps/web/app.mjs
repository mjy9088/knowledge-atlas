import {deriveExplosion,assertState} from '/packages/models/explosion.mjs';

const $=id=>document.getElementById(id);
const initial=Object.freeze({hasP:true,hasNotP:true,conclusion:'Q'});
let state={...initial};

function getState(){return {...state};}
function setState(next){
 state={...assertState(next)};
 $('has-p').checked=state.hasP;
 $('has-not-p').checked=state.hasNotP;
 $('conclusion').value=state.conclusion;
 render();
}
function reset(){setState(initial)}
function render(){
 const result=deriveExplosion(state);
 const list=$('proof-steps');list.replaceChildren();
 result.steps.forEach((step,index)=>{
  const item=document.createElement('li');item.className='proof-step';item.dataset.semanticId=step.semanticId;
  const num=document.createElement('span');num.className='step-num';num.textContent=`${index+1}`;
  const symbol=document.createElement('span');symbol.className='step-symbol';symbol.textContent=step.symbol;
  const rule=document.createElement('span');rule.className='step-rule';rule.textContent=step.rule;
  item.append(num,symbol,rule);list.append(item);
 });
 const message=$('proof-message');
 message.classList.toggle('active',result.contradiction);
 message.textContent=result.contradiction
  ? `${result.conclusion}가 이 추론 규칙 아래에서 도출됩니다. ${result.conclusion}의 현실적 참을 판정한 것은 아닙니다.`
  : `선택한 전제들로는 이 모순 폭발 증명 경로가 완성되지 않습니다. 다른 증명의 불가능성을 주장하는 것은 아닙니다.`;
 window.__atlasInspection={sceneId:'scene:logic.explosion.proof',state:getState(),result};
}

for(const [id,change] of [
 ['has-p',value=>({hasP:value})],
 ['has-not-p',value=>({hasNotP:value})],
 ['conclusion',value=>({conclusion:value})]
]){
 $(id).addEventListener('change',()=>setState({...state,...change(id==='conclusion'?$(id).value:$(id).checked)}));
}
$('reset').addEventListener('click',reset);
window.__atlasScenes={proof:{getState,setState,reset,describeState:()=>window.__atlasInspection}};

async function populate(){
 try{
  const [data,concepts,rels,sources]=await Promise.all([
   fetch('/content/formal-logic/explosion/content.json').then(r=>r.json()),
   fetch('/knowledge/concepts.json').then(r=>r.json()),
   fetch('/knowledge/relations.json').then(r=>r.json()),
   fetch('/sources/registry.json').then(r=>r.json())
  ]);
  $('article-title').textContent=data.title;
  $('article-summary').textContent=data.summary;
  $('intro-body').textContent=data.blocks.find(b=>b.id==='block:intro')?.text||'';
  $('limits-body').textContent=data.blocks.find(b=>b.id==='block:limits')?.text||'';
  const nav=$('concepts-nav');nav.replaceChildren();
  const available=new Set([ ...data.conceptRefs, ...rels.filter(r=>r.from==='concept:logic.explosion').map(r=>r.to)]);
  for(const c of concepts.filter(c=>available.has(c.id))){
   const btn=document.createElement('button');btn.type='button';btn.textContent=c.title;
   btn.className='concept-link';btn.setAttribute('aria-label',`${c.title} 개념 설명`);
   btn.addEventListener('click',()=>{
    $('concept-title').textContent=c.title;
    $('concept-summary').textContent=c.summary;
    [...nav.children].forEach(x=>x.setAttribute('aria-current','false'));
    btn.setAttribute('aria-current','true');
   });
   nav.append(btn);
  }
  $('source-list').replaceChildren(...sources.filter(s=>data.sourceRefs.includes(s.id)).map(s=>{
   const li=document.createElement('li');
   const a=document.createElement('a');a.href=s.canonicalUrl;a.rel='noopener noreferrer';a.target='_blank';a.textContent=s.title+' ↗';
   const note=document.createElement('span');note.className='source-meta';note.textContent=`${s.providerRevision} · ${s.license} · 감사 상태: ${s.rightsReview}`;
   li.append(a,note);return li;
  }));
 }catch(err){$('intro-body').textContent='로컬 콘텐츠 데이터를 읽지 못했습니다. 개발자 콘솔을 확인하세요.';console.error(err)}
}
render();populate();
