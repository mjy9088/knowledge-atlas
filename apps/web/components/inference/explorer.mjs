import {mountInferenceVisual} from './visual.mjs';
import {FDE_VALUES} from '/packages/models/related-inference.mjs';
export function mountInferenceExplorer(container){
  const doc=container.ownerDocument,make=(tag,text,className)=>{const node=doc.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;};
  const diagram=make('div',null,'explorer-diagram'),flow=make('nav',null,'explorer-lines');flow.setAttribute('aria-label','추론의 흐름');
  container.replaceChildren(diagram,flow);const visual=mountInferenceVisual(diagram);
  let info,index=0;
  function render(){
    diagram.replaceChildren();
    const counter=info.proof.semantics?.counterexample;
    if(counter){
      diagram.append(make('p','FDE · 전제는 지정값, 목표는 비지정값인 평가','eyebrow'));
      const cards=make('div',null,'counterexample-grid');
      for(const [name,value]of Object.entries(counter.assignment)){const card=make('article');card.append(make('strong',name),make('span',FDE_VALUES[value]));cards.append(card);}
      diagram.append(cards,make('p',`목표 ${info.goal}: ${FDE_VALUES[counter.goalValue]}`,'counterexample-goal'));
      diagram.append(make('p',info.premises.map((formula,i)=>`${formula}: ${FDE_VALUES[counter.premiseValues[i]]}`).join(' · '),'explorer-note'));
    }else if(info.proof.lines.length)visual.update({...info,step:index});
    else diagram.append(make('p','이 입력에서 표시할 도출 행이 없습니다.'));
    const title=make('strong','추론의 흐름');flow.replaceChildren(title);
    info.proof.lines.forEach((line,i)=>{
      const button=make('button');button.type='button';button.dataset.lineId=line.id;button.setAttribute('aria-current',i===index?'step':'false');
      button.append(make('span',String(i+1),'explorer-number'),make('strong',line.formula),make('small',info.proof.ruleLabels?.[line.rule]??(line.rule==='premise'?'전제':line.rule)));
      button.addEventListener('click',()=>{index=i;render();flow.querySelector('[aria-current=step]')?.focus({preventScroll:true});});flow.append(button);
    });
    if(counter)flow.append(make('p','위 값 배정이 추론의 반례입니다.','explorer-note'));
    else if(!info.proof.goalReached)flow.append(make('p','목표 경로 미발견 · 표시한 행은 도달한 부분입니다.','explorer-note'));
  }
  return {update(next){info=structuredClone(next);const target=info.proof.lines.findIndex(line=>line.formula===info.goal);index=target>=0?target:Math.max(0,info.proof.lines.length-1);render();},invalidate(reason){info=null;index=0;diagram.replaceChildren(make('p',reason));flow.replaceChildren();},getState:()=>({step:index}),setState(state){if(!info||!Number.isInteger(state?.step)||state.step<0||state.step>=info.proof.lines.length)throw new RangeError('Unknown proof step');index=state.step;render();},reset(){if(info){index=0;render();}}};
}
