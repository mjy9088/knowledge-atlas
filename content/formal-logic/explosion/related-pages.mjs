// Presentation only: prose and evidence remain in related.json, addressed by stable block IDs.
export const RELATED_PAGES=[
  {slug:'consistency',articleId:'article:logic.consistency.ko',label:'일관성',experiment:true,scenes:[
    {id:'theory',title:'무엇을 출발점으로 삼을까요?',block:0,from:0,to:1,cards:['공리','허용된 추론 규칙'],known:'이론을 이루는 공리와 추론 규칙'},
    {id:'definition',title:'일관성이란?',block:0,from:1,to:2,cards:['이론으로부터','모순을 증명할 수 없음'],known:'일관성의 의미'},
    {id:'explosion',title:'모순을 얻으면 어떻게 될까요?',block:0,from:2,cards:['모순 ⊥','Q와 ¬Q도 도출'],known:'폭발과 도출의 구별 기능'},
    {id:'boundary',title:'이 예시가 증명하지 않은 것',block:1,from:0,cards:['일관성의 역할','특정 이론의 일관성 증명은 별도'],known:'예시와 일관성 증명의 차이'}]},
  {slug:'paraconsistent-logic',articleId:'article:logic.paraconsistent.ko',label:'초일관 논리',scenes:[
    {id:'rules',title:'폭발 규칙을 항상 허용해야 할까요?',block:0,from:0,to:2,cards:['A와 ¬A','임의의 B로의 폭발을 일반적으로 허용하지 않음'],known:'초일관성의 비폭발성'},
    {id:'intuitionistic',title:'고전논리가 아니라면?',block:0,from:2,cards:['통상적인 직관주의 논리','폭발을 허용'],known:'직관주의 논리와 폭발의 관계'},
    {id:'truth',title:'추론 규칙과 진리관을 구별해요',block:1,from:0,to:2,cards:['어떤 추론을 허용하는가','어떤 모순이 참이라고 주장하는가'],known:'초일관 추론과 참인 모순을 인정하는 진리관의 구별'},
    {id:'boundary',title:'어떤 규칙을 쓰는지 먼저 확인해요',block:1,from:2,cards:['논리마다 규칙이 다름','고전 규칙을 그대로 옮기지 않음'],known:'각 논리의 규칙을 확인해야 하는 이유'}]},
  {slug:'zfc',articleId:'article:set.zfc.ko',label:'ZFC',scenes:[
    {id:'sets',title:'집합론은 무엇을 다룰까요?',block:0,from:0,to:1,cards:['집합','원소가 속한다는 관계'],known:'집합론의 기본 대상'},
    {id:'axioms',title:'ZFC는 출발 가정을 정합니다',block:0,from:1,cards:['ZF','선택공리 C','ZFC'],known:'ZFC의 이름과 공리의 역할'},
    {id:'consistency',title:'Con(ZFC)는 무슨 뜻일까요?',block:1,from:0,to:1,cards:['Con(ZFC)','ZFC에서 모순을 증명할 수 없음'],known:'Con(ZFC)의 의미'},
    {id:'boundary',title:'독립성 설명에 조건이 붙는 이유',block:1,from:1,cards:['만일 모순이 증명되면','CH와 ¬CH도 도출'],known:'CH 독립성 설명의 일관성 조건'}]},
  {slug:'continuum-hypothesis',articleId:'article:set.ch-independence.ko',label:'연속체 가설과 독립성',scenes:[
    {id:'size',title:'무한의 크기도 비교할 수 있나요?',block:0,from:0,to:2,cards:['자연수의 기수','실수의 기수가 더 큼'],known:'일대일 대응과 기수 비교'},
    {id:'ch',title:'연속체 가설이 묻는 것',block:0,from:2,cards:['CH','그 사이 기수의 집합이 없음'],known:'CH의 의미와 실수 사이 간격과의 구별'},
    {id:'independence',title:'ZFC로부터 독립이라는 뜻',block:1,from:0,cards:['ZFC가 일관적이라면','CH도 ¬CH도 ZFC만으로 증명되지 않음'],known:'상대일관성 결과와 고정된 이론의 독립성'},
    {id:'boundary',title:'탐색 실패와 독립성 증명은 달라요',block:2,from:0,cards:['구성가능 우주 · 강제법','별도의 정리가 필요'],known:'컴퓨터의 탐색 실패와 독립성 정리의 구별'}]}
];

export const pageURL=page=>`/knowledge/${page.slug}/`;
export function sceneText(article,scene){
  const sentences=article.blocks[scene.block].text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/gu)??[];
  return sentences.slice(scene.from,scene.to).join('').trim();
}
