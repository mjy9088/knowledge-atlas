import {RULES} from '../../packages/models/propositional.mjs';
import {displayFormula} from './formula-display.mjs';

const lineName=id=>String(id).replace(/^line-(\d+)$/,'$1행');
// Presentation of existing proof lines only; no inference or premise rewriting.
export function visualForStep({premises=[],goal='',proof,step=0}) {
  if(!proof || !Array.isArray(proof.lines)) throw new TypeError('An existing proof result is required');
  const lines=proof.lines;
  if(lines.length && (!Number.isInteger(step) || step<0 || step>=lines.length)) throw new RangeError('Step must identify an existing proof line');
  const current=lines[step];
  const overall=proof.goalReached?'전체 탐색에서 목표에 도달했습니다.':proof.limitReached?'탐색 한도에서 멈췄습니다.':'이 탐색에서 목표에 도달하지 못했습니다.';
  const rule=RULES.find(item=>item.id===current?.rule)?.label ?? current?.rule ?? '표시할 단계 없음';
  const card=line=>({id:line.id,label:lineName(line.id),formula:displayFormula(line.formula)});
  return {
    sceneId:'scene:logic.inference.lab',step:current?step:null,total:lines.length,
    goal:displayFormula(goal),premises:premises.map(value=>displayFormula(value)),
    kind:current?(current.rule==='premise'?'premise':'derivation'):'empty',
    current:current?card(current):null,rule,
    dependencies:(current?.dependsOn??[]).map(id=>{const line=lines.find(item=>item.id===id);return line?card(line):{id,label:lineName(id),formula:'참조 단계를 찾을 수 없음',missing:true};}),
    overall,goalReached:Boolean(proof.goalReached),
    limitation:'전제는 사용한 가정입니다. 경로 미발견은 일반적인 증명 불가능성이나 현실의 거짓을 뜻하지 않습니다.',
  };
}

export function mountInferenceVisual(container) {
  if(!container) throw new TypeError('Visual container is required');
  const doc=container.ownerDocument;
  const make=(tag,text,className)=>{const node=doc.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;};
  function update(input) {
    const view=visualForStep(input);container.hidden=false;container.dataset.sceneId=view.sceneId;
    const head=make('div',null,'inference-visual-head');
    head.append(make('p',view.current?`단계 ${view.step+1} / ${view.total}`:'추론 결과','inference-visual-progress'),make('h3',view.kind==='premise'?'선택한 전제':view.kind==='derivation'?'이 단계는 어떻게 나왔을까?':'표시할 증명 단계가 없습니다.'));
    const context=make('div',null,'inference-visual-context');
    context.append(make('p',`목표  ${view.goal}`,'inference-visual-goal'),make('p',view.overall,'inference-visual-status'));
    const flow=make('div',null,'inference-visual-flow');
    flow.dataset.kind=view.kind;
    const card=(line,kind)=>{const element=make('article',null,`inference-visual-card inference-visual-${kind}`);element.dataset.lineId=line.id;element.append(make('span',line.label,'inference-visual-label'),make('p',line.formula,'inference-visual-formula'));return element;};
    if(view.kind==='derivation') {
      const deps=make('div',null,'inference-visual-dependencies');deps.setAttribute('aria-label','사용한 이전 단계');
      view.dependencies.forEach(line=>deps.append(card(line,'dependency')));
      if(!view.dependencies.length) deps.append(make('p','이 단계에 기록된 참조가 없습니다.'));
      const rule=make('div',null,'inference-visual-rule');
      const arrow=make('span','→','inference-visual-arrow');arrow.setAttribute('aria-hidden','true');
      rule.append(make('span','적용한 규칙','inference-visual-label'),make('strong',view.rule),arrow);
      flow.append(deps,rule,card(view.current,'result'));
    } else if(view.current) {
      const premise=card(view.current,'result');
      premise.prepend(make('span','추론의 출발점으로 선택한 가정','inference-visual-premise-note'));
      flow.append(premise,make('p','이 줄은 다른 단계에서 도출한 결과가 아니라 입력한 전제입니다.','inference-visual-explanation'));
    } else flow.append(make('p',view.limitation));
    const limit=make('p',view.limitation,'inference-visual-limitation');
    container.replaceChildren(head,context,flow,limit);
  }
  return {update,invalidate(reason='수식을 완성하면 시각화가 자동으로 갱신됩니다.') {container.replaceChildren(make('p',reason,'inference-visual-limitation'));}};
}
