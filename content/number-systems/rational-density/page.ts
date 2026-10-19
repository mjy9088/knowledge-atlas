import type { ContentPage } from '../../../packages/content/types.js';

const page = {
  slug: 'rational-density',
  articleId: 'article:number-systems.rational-density.ko',
  label: '두 실수 사이의 유리수 찾기',
  category: '수학 · 수 체계',
  model: null,
  styles: ['/topics/number-systems/rational-density.css'],
  claimRefs: [
    'claim:number-systems.rational.density',
    'claim:number-systems.rational-density.archimedean-mesh',
    'claim:number-systems.rational-density.grid-construction',
    'claim:number-systems.rational-density.theorem',
    'claim:number-systems.rational-density.irrational-endpoint-example',
  ],
  scenes: [
    { id: 'opening-gap', title: '평균만으로 충분할까요?', block: 0, from: 0, to: 2, cards: [], known: '유리수 끝점의 평균 논증과 실수 끝점 문제의 차이', figure: { src: '/content/number-systems/rational-density/figure-midpoint-scope.svg', alt: '왼쪽은 x와 y가 모두 유리수일 때 평균 (x+y)/2도 유리수임을 보인다. 오른쪽은 x와 y가 임의의 실수일 때 평균이 실수이기는 하지만 유리수라고 보장되지 않음을 보인다. 이 비교는 임의의 실수 끝점에는 다른 구성이 필요하다는 뜻이지, 두 실수 사이에 중점이 없다는 뜻이 아니다.', caption: '유리수 끝점의 평균은 유리수 · 임의의 실수 끝점의 평균은 유리수라고 보장되지 않음' } },
    { id: 'grid-plan', title: '정수 격자를 놓아요', block: 0, from: 2, cards: [], known: '임의의 실수 끝점 사이를 찾는 정수 격자 계획', figure: { src: '/content/number-systems/rational-density/figure-grid-plan.svg', alt: '하나의 균일한 수직선 위에 간격 1/n인 격자점들이 놓여 있다. 실수 x는 두 격자점 사이에 있고, 그 바로 오른쪽의 첫 격자점이 선택되어 있다. y는 그보다 오른쪽에 있다. 그림은 구성 원리를 보여 주는 예시이며 일반 정리의 증명이 아니다.', caption: '예시 구성: 간격 1/n의 균일한 격자에서 x\u00a0바로\u00a0오른쪽의 첫 격자점을 선택' } },
    { id: 'choose-mesh', title: '구간보다 촘촘한 격자', block: 1, from: 0, to: 2, cards: ['n∈Z, n>0', '1/n<y−x'], known: '아르키메데스 성질로 고르는 엄격히 작은 격자 간격' },
    { id: 'mesh-points', title: '격자의 모든 점은 유리수예요', block: 1, from: 2, cards: [], known: '양의 정수 n이 만드는 유리수 격자', figure: { src: '/content/number-systems/rational-density/figure-mesh-points.svg', alt: '고정된 양의 정수 n에 대해 세 이웃한 격자점 (k−1)/n, k/n, (k+1)/n이 같은 1/n 간격으로 놓여 있다. k와 n이 정수이고 n이 양수라서 0이 아니므로 모든 격자점은 유리수다.', caption: 'k∈Z, n∈Z, n>0 · 각 k/n∈Q · 이웃한 격자점의 간격은 1/n' } },
    { id: 'first-grid-point', title: 'x 오른쪽의 첫 정수', block: 2, from: 0, to: 1, cards: [], known: '바닥함수로 고른 첫 번째 오른쪽 정수', figure: { src: '/content/number-systems/rational-density/figure-first-grid-point.svg', alt: '하나의 공통 정수 눈금에서 음수 비정수 nx=−2.4는 바닥값 −3과 다음 정수 m=−2 사이에 있고, 정수 경계 nx=2에서는 바닥값이 2이며 m=3이다. 두 경우 모두 바닥함수 성질에서 nx<m≤nx+1을 얻는다.', caption: '⌊nx⌋≤nx<⌊nx⌋+1, m=⌊nx⌋+1 · 음수 비정수와 정수 경계 모두 nx<m≤nx+1' } },
    { id: 'divide-chain', title: 'n으로 나눈 부등식', block: 2, from: 1, to: 3, cards: [], known: '나눗셈과 격자 조건을 잇는 부등식 연쇄', figure: { src: '/content/number-systems/rational-density/figure-divide-chain.svg', alt: '첫 줄 nx<m≤nx+1을 양의 n으로 나누면 부등호 방향이 유지되어 x<m/n≤x+1/n이 된다. 별도로 선택한 1/n<y−x를 양변에 x를 더해 x+1/n<y를 얻는다. 두 결과를 이어 x<m/n≤x+1/n<y가 된다.', caption: 'nx<m≤nx+1 — n>0으로 나눔 → x<m/n≤x+1/n — 엄격한 격자 조건 → x+1/n<y' } },
    { id: 'strict-result', title: '열린 구간 안의 유리수', block: 2, from: 3, cards: ['x<m/n<y', 'm/n∈Q'], known: '두 실수 사이에 구성한 유리수' },
    { id: 'ceiling-boundary', title: '올림은 끝점에 머물 수 있어요', block: 3, from: 0, to: 2, cards: [], known: '올림 선택이 왼쪽 끝점을 되돌릴 수 있는 경우', figure: { src: '/content/number-systems/rational-density/figure-boundary-choice.svg', alt: 'nx가 정수 2인 같은 경계에서 올림값은 2라서 나눈 점이 다시 x가 된다. 비교 행의 바닥함수 더하기 1은 다음 정수 3을 골라 nx보다 엄격히 오른쪽으로 이동한다.', caption: '정수 경계 비교: ⌈nx⌉=nx는 x를 되돌림 · ⌊nx⌋+1은 다음 정수로 이동' } },
    { id: 'floor-escape', title: '바닥함수에 1을 더해 끝점을 피해요', block: 3, from: 2, cards: [], known: '정수 경계에서도 엄격한 오른쪽 이동을 보장하는 선택', figure: { src: '/content/number-systems/rational-density/figure-boundary-choice.svg', alt: 'nx가 정수 2인 같은 경계에서 올림값은 2라서 나눈 점이 다시 x가 된다. 비교 행의 바닥함수 더하기 1은 다음 정수 3을 골라 nx보다 엄격히 오른쪽으로 이동한다.', caption: '정수 경계 비교: ⌈nx⌉=nx는 x를 되돌림 · ⌊nx⌋+1은 다음 정수로 이동' } },
    { id: 'irrational-lower', title: '√2보다 3/2가 큰지 정확히 확인해요', block: 4, from: 0, to: 2, cards: ['(3/2)²=9/4', '2<9/4 ⇒ √2<3/2'], known: '양수의 제곱 비교로 확인한 왼쪽 부등식' },
    { id: 'irrational-upper', title: '3/2가 √3보다 작은지도 확인해요', block: 4, from: 2, cards: ['9/4<3 ⇒ 3/2<√3', '√2<3/2<√3', '소수 근삿값 없음'], known: '무리수 끝점 사이 유리수의 정확한 검산' },
    { id: 'coarse-mesh', title: '같은 간격이면 끝점에 닿아요', block: 5, from: 0, to: 2, cards: [], known: '엄격하지 않은 격자 조건이 열린 구간에서 실패하는 사례', figure: { src: '/content/number-systems/rational-density/figure-mesh-comparison.svg', alt: '같은 구간 1에서 11/10을 두 행에서 비교한다. n=10 행은 격자 폭 1/10이 구간 폭과 같아 선택점 11/10이 오른쪽 끝점에 놓인다. n=20 행은 격자 폭 1/20이 더 작아 선택점 21/20이 두 끝점의 정확한 중간에 놓이며 1<21/20<11/10이다.', caption: '같은 정확한 구간 비교: n=10은 11/10=y에 도달 · n=20은 21/20이 열린 구간 안에 위치' } },
    { id: 'fine-mesh', title: '더 촘촘하면 구간 안에 와요', block: 5, from: 2, cards: [], known: '엄격한 격자 조건을 만족하는 전이 적용', figure: { src: '/content/number-systems/rational-density/figure-mesh-comparison.svg', alt: '같은 구간 1에서 11/10을 두 행에서 비교한다. n=10 행은 격자 폭 1/10이 구간 폭과 같아 선택점 11/10이 오른쪽 끝점에 놓인다. n=20 행은 격자 폭 1/20이 더 작아 선택점 21/20이 두 끝점의 정확한 중간에 놓이며 1<21/20<11/10이다.', caption: '같은 정확한 구간 비교: n=10은 11/10=y에 도달 · n=20은 21/20이 열린 구간 안에 위치' } },
  ],
} satisfies ContentPage;

export default page;
