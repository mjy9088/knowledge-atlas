import {visualForStep} from '../../../../packages/projection/proof-view.js';
export {visualForStep} from '../../../../packages/projection/proof-view.js';
export function mountInferenceVisual(container:HTMLElement) {
  if(!container) throw new TypeError('Visual container is required');
  const doc=container.ownerDocument;
  const make=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string|null,className?:string)=>{const node=doc.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;};
  function update(input:Parameters<typeof visualForStep>[0]) {
    const view=visualForStep(input);container.hidden=false;container.dataset.sceneId=view.sceneId;
    const head=make('div',null,'inference-visual-head');
    head.append(make('p',view.current?`단계 ${(view.step??0)+1} / ${view.total}`:'추론 결과','inference-visual-progress'),make('h3',view.kind==='premise'?'선택한 전제':view.kind==='derivation'?'이 단계는 어떻게 나왔을까?':'표시할 증명 단계가 없습니다.'));
    const context=make('div',null,'inference-visual-context');
    context.append(make('p',`목표  ${view.goal}`,'inference-visual-goal'),make('p',view.overall,'inference-visual-status'));
    const flow=make('div',null,'inference-visual-flow');
    flow.dataset.kind=view.kind;
    const card=(line:{id:string;label:string;formula:string},kind:string)=>{const element=make('article',null,`inference-visual-card inference-visual-${kind}`);element.dataset.lineId=line.id;element.append(make('span',line.label,'inference-visual-label'),make('p',line.formula,'inference-visual-formula'));return element;};
    if(view.kind==='derivation') {
      if(!view.current)throw new Error('A derivation needs its current line');
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
