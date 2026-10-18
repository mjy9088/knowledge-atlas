import type { ContentPage } from '../../../packages/content/types.js';

const page = {
  slug: 'rational-density',
  articleId: 'article:number-systems.rational-density.ko',
  label: '두 실수 사이의 유리수 찾기',
  category: '수학 · 수 체계',
  model: null,
  claimRefs: [
    'claim:number-systems.rational-density.archimedean-mesh',
    'claim:number-systems.rational-density.grid-construction',
    'claim:number-systems.rational-density.theorem',
    'claim:number-systems.rational-density.irrational-endpoint-example',
  ],
  scenes: [
    { id: 'opening-gap', title: '평균만으로 충분할까요?', block: 0, from: 0, to: 2, cards: ['유리수 끝점: 평균', '실수 끝점: x<y'], known: '유리수 끝점의 평균 논증과 실수 끝점 문제의 차이' },
    { id: 'grid-plan', title: '정수 격자를 놓아요', block: 0, from: 2, cards: ['구간 폭 y−x', '격자 폭 1/n', 'x 오른쪽의 첫 격자점'], known: '임의의 실수 끝점 사이를 찾는 정수 격자 계획' },
    { id: 'choose-mesh', title: '구간보다 촘촘한 격자', block: 1, from: 0, to: 2, cards: ['n∈Z, n>0', '1/n<y−x'], known: '아르키메데스 성질로 고르는 엄격히 작은 격자 간격' },
    { id: 'mesh-points', title: '격자의 모든 점은 유리수예요', block: 1, from: 2, cards: ['…, (k−1)/n, k/n, (k+1)/n, …', 'k∈Z'], known: '양의 정수 n이 만드는 유리수 격자' },
    { id: 'first-grid-point', title: 'x 오른쪽의 첫 정수', block: 2, from: 0, to: 1, cards: ['m=⌊nx⌋+1', 'nx<m≤nx+1'], known: '바닥함수로 고른 첫 번째 오른쪽 정수' },
    { id: 'divide-chain', title: 'n으로 나눈 부등식', block: 2, from: 1, to: 3, cards: ['x<m/n≤x+1/n', 'x+1/n<y'], known: '나눗셈과 격자 조건을 잇는 부등식 연쇄' },
    { id: 'strict-result', title: '열린 구간 안의 유리수', block: 2, from: 3, cards: ['x<m/n<y', 'm/n∈Q'], known: '두 실수 사이에 구성한 유리수' },
    { id: 'ceiling-boundary', title: '올림은 끝점에 머물 수 있어요', block: 3, from: 0, to: 2, cards: ['nx∈Z', '⌈nx⌉=nx', '⌈nx⌉/n=x'], known: '올림 선택이 왼쪽 끝점을 되돌릴 수 있는 경우' },
    { id: 'floor-escape', title: '바닥함수에 1을 더해 끝점을 피해요', block: 3, from: 2, cards: ['m=⌊nx⌋+1', '항상 nx<m'], known: '정수 경계에서도 엄격한 오른쪽 이동을 보장하는 선택' },
    { id: 'irrational-lower', title: '√2보다 3/2가 큰지 정확히 확인해요', block: 4, from: 0, to: 2, cards: ['(3/2)²=9/4', '2<9/4 ⇒ √2<3/2'], known: '양수의 제곱 비교로 확인한 왼쪽 부등식' },
    { id: 'irrational-upper', title: '3/2가 √3보다 작은지도 확인해요', block: 4, from: 2, cards: ['9/4<3 ⇒ 3/2<√3', '√2<3/2<√3', '소수 근삿값 없음'], known: '무리수 끝점 사이 유리수의 정확한 검산' },
    { id: 'coarse-mesh', title: '같은 간격이면 끝점에 닿아요', block: 5, from: 0, to: 2, cards: ['n=10', '1/n=y−x', 'm/n=y'], known: '엄격하지 않은 격자 조건이 열린 구간에서 실패하는 사례' },
    { id: 'fine-mesh', title: '더 촘촘하면 구간 안에 와요', block: 5, from: 2, cards: ['n=20, m=21', '1<21/20<11/10'], known: '엄격한 격자 조건을 만족하는 전이 적용' },
  ],
} satisfies ContentPage;

export default page;
