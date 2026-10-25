import {modalFrameSystems} from '/packages/models/modal-frame-systems.js';
import type {ModalFrame} from '/packages/models/weekday-modal.js';
import type {WeekdayInterpretation} from '/packages/models/weekday-worlds.js';

export const SYSTEM_ROWS=[
  ['K','추가 없음','R에 조건 없음'],
  ['D','D: □P → ◇P','모든 세계에 나가는 화살표'],
  ['T','T: □P → P','반사적: 모든 자기 고리'],
  ['B','T + B: P → □◇P','반사적 + 대칭적 (역방향)'],
  ['S4','T + 4: □P → □□P','반사적 + 전이적 (직접 연결도)'],
  ['S5','T + 5: ◇P → □◇P','동치 관계: 반사·대칭·전이'],
] as const;

export function mountWeekdayFrameSystems(container:HTMLElement){
  const doc=container.ownerDocument;container.className='weekday-frame-systems';container.setAttribute('aria-label','현재 접근 관계의 공리 체계 조건');
  function element(tag:string,text:string){const node=doc.createElement(tag);node.textContent=text;return node;}
  return {render(input:WeekdayInterpretation,frame:ModalFrame){
    const result=modalFrameSystems(input.worlds?.map(w=>w.id)??[0,1],frame);container.replaceChildren(element('h3','편집기의 기본 보장: K'));
    const systems=element('div','');systems.className='weekday-frame-classes';
    for(const [name]of SYSTEM_ROWS){const badge=element('span',name+(result.systems[name]?' ✓':' ×'));badge.dataset.system=name;badge.dataset.satisfied=String(result.systems[name]);systems.append(badge);}container.append(systems);
    const properties=element('div','');properties.className='weekday-frame-properties';
    for(const [key,label]of [['serial','모든 세계에서 어딘가로'],['reflexive','모든 자기 고리'],['symmetric','화살표마다 역방향'],['transitive','두 단계면 직접 연결도']] as const){const line=element('p',(result[key]?'✓ ':'× ')+label);line.dataset.property=key;properties.append(line);}container.append(properties);
    container.append(element('p','기본 설정: S4 · 체크: 현재 관계 전체의 조건'),element('small','요일 해·P와 별개인 프레임 판정이며, 가능세계나 유한 모형 자체가 한 공리 체계인 것은 아닙니다.'));
  }};
}
