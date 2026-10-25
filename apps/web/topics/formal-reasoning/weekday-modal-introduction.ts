import {MODAL_INTRO_EXAMPLES} from '/content/formal-logic/weekday-worlds/modal-examples.js';
import {WEEKDAYS} from '/packages/models/weekday-worlds.js';
import {alethicValuationAt} from '/packages/models/weekday-modal.js';
import {colorWorld,worldLabel} from './weekday-world-style.js';

export function mountWeekdayModalIntroduction(container:HTMLElement){
  const doc=container.ownerDocument;container.className='weekday-modal-introduction';container.setAttribute('aria-label','가능성과 필연성의 두 예시');container.dataset.claimRefs='claim:logic.weekday-worlds.modal-examples';
  const make=(tag:string,text:string,cls='')=>{const e=doc.createElement(tag);e.textContent=text;e.className=cls;return e;};
  container.append(make('p','P: “이 세계의 오늘은 금요일이다.”','weekday-modal-intro-proposition'));
  const cases=make('div','','weekday-modal-intro-cases');
  for(const example of MODAL_INTRO_EXAMPLES){
    const result=alethicValuationAt(example.worlds.map(w=>w.id),example.worlds.filter(w=>w.today===4).map(w=>w.id),{evaluationWorld:0,access:example.worlds.map(w=>[0,w.id])});
    const card=make('section','','weekday-modal-intro-case');card.dataset.example=example.id;
    card.append(make('h2',example.title),make('p',`현실에서 P: ${result.actual?'참':'거짓'}`,'weekday-modal-intro-actual'),make('p','현실에서 살펴볼 세계 ↓','weekday-modal-intro-access'));
    const worlds=make('div','','weekday-modal-intro-worlds');
    const rail=doc.createElementNS('http://www.w3.org/2000/svg','svg');
    rail.setAttribute('viewBox','0 0 600 80');rail.setAttribute('preserveAspectRatio','none');rail.setAttribute('class','weekday-modal-intro-rail');rail.setAttribute('aria-hidden','true');
    rail.innerHTML=`<defs><marker id="intro-arrow-${example.id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#627e73"/></marker></defs>${[100,300,500].map(x=>`<path d="M100 72 C${x===100?30:100} ${x===100?8:2} ${x===100?170:x} ${x===100?8:2} ${x} 72" fill="none" stroke="#627e73" stroke-width="2" marker-end="url(#intro-arrow-${example.id})"/>`).join('')}`;
    worlds.append(rail);
    for(const w of example.worlds){const chip=make('div','','weekday-modal-intro-world');colorWorld(chip,w.id);delete chip.dataset.world;chip.dataset.exampleWorld=String(w.id);chip.dataset.truth=String(w.today===4);chip.append(make('span',worldLabel(w.id)),make('strong',WEEKDAYS[w.today]),make('small',w.today===4?'✓ P 참':'× P 거짓'));worlds.append(chip);}card.append(worlds);
    const verdicts=make('div','','weekday-modal-intro-verdicts');
    for(const [symbol,truth,text]of [['◇P',result.diamond,'하나 이상에서 P'],['□P',result.box,'모든 세계에서 P']] as const){const line=make('p','');line.dataset.operator=symbol;line.dataset.truth=String(truth);line.append(make('strong',`${symbol}: ${truth?'참':'거짓'}`));
      const evidence=make('span','','weekday-quantifier-evidence'),dots=make('span','','weekday-quantifier-dots');
      const matches=example.worlds.filter(world=>world.today===4).length;
      dots.setAttribute('aria-label',`${example.worlds.length}개 중 ${matches}개 세계에서 P가 참`);
      for(const world of example.worlds){const dot=make('i',world.today===4?'✓':'×');dot.dataset.truth=String(world.today===4);dots.append(dot);}
      evidence.append(dots,make('span',text));line.append(evidence);verdicts.append(line);}card.append(verdicts);cases.append(card);
  }
  container.append(cases,make('p','두 예시 모두 표시한 세 세계를 살펴볼 수 있다고 둡니다. 수수께끼의 요일 풀이와는 별도의 개념 예시입니다.','weekday-modal-intro-note'));
}
