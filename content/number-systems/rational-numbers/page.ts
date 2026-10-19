import type { ContentPage } from '../../../packages/content/types.js';

const page = {
  slug: 'rational-numbers',
  articleId: 'article:number-systems.rational-numbers.ko',
  label: '분수가 같은 수일 때',
  category: '수학 · 수 체계',
  model: null,
  claimRefs: [
    'claim:number-systems.rational.definition',
    'claim:number-systems.rational.equivalence',
    'claim:number-systems.rational.zero-denominator',
    'claim:number-systems.rational.density',
    'claim:number-systems.rational.not-complete',
  ],
  scenes: [
    { id: 'question', title: '1/2와 2/4는 두 수일까요?', block: 0, from: 0, cards: [], known: '표기와 수의 구별', figure: { src: '/content/number-systems/rational-numbers/figure-equivalent-halves.svg', alt: '하나의 같은 전체를 위에서는 2칸, 아래에서는 4칸으로 나눈다. 위의 1칸과 아래의 2칸이 같은 왼쪽 절반을 덮고 가운데 경계도 일치하여 1/2와 2/4가 같은 양을 나타낸다.', caption: '같은 전체의 같은 절반: 2칸 중 1칸 = 4칸 중 2칸 · 공통 경계가 일치' } },
    { id: 'equivalence', title: '교차곱이 같으면 같은 수', block: 1, from: 0, cards: ['a/b = c/d ⇔ ad = bc', '1×4 = 2×2'], known: '정수쌍 표현과 분수 동치' },
    { id: 'zero-denominator', title: '왜 분모 0은 제외할까요?', block: 2, from: 0, cards: [], known: '0으로 나누기를 정의에서 제외하는 이유', figure: { src: '/content/number-systems/rational-numbers/figure-zero-denominator-cases.svg', alt: 'a/0=x를 되돌린 식 0×x=a를 a가 0이 아닌 경우와 a가 0인 경우로 나눈다. a가 0이 아니면 해가 없고, a가 0이면 모든 x가 해라서 유일한 몫이 없다. 어느 경우에도 0으로 나눈 값을 하나로 정하지 못하며 0/0=0을 뜻하지 않는다.', caption: 'a≠0: 0×x=a는 불가능 · a=0: 모든 x가 해라서 유일하지 않음 · 두 경우 모두 몫을 정의하지 못함' } },
  { id: 'density', title: '두 유리수 사이를 찾아요', block: 3, from: 0, cards: [], known: '평균으로 확인하는 유리수의 조밀성', figure: { src: '/content/number-systems/rational-numbers/figure-rational-midpoint.svg', alt: '유리수 x와 y가 x보다 y가 큰 조건을 만족할 때 m=(x+y)/2도 유리수이다. 수직선에서 x, m, y가 같은 간격으로 놓이고, 왼쪽 간격 m−x와 오른쪽 간격 y−m는 모두 (y−x)/2로 같으며 양수이다. 따라서 x<m<y이다.', caption: '조건: x,y∈Q, x<y · m=(x+y)/2∈Q · m−x\u00a0=\u00a0y−m\u00a0=\u00a0(y−x)/2>0 · 따라서 x<m<y' }, skip: {to: 'transfer', label: '완비성 다음 질문을 건너뛰고 적용하기'} },
    { id: 'completeness', title: '선택: 조밀하면 빈틈이 없을까요?', block: 4, from: 0, cards: ['이번 결과 | 두 유리수 사이에 또 있음', '다음 질문 | 모든 경계도 유리수인가?'], known: '조밀성의 결과와 후속 완비성 증명의 경계' },
    { id: 'transfer', title: '같은 수인지, 사이 수인지', block: 5, from: 0, cards: [], known: '동치 판정과 중간 유리수의 전이 적용', figure: { src: '/content/number-systems/rational-numbers/figure-transfer-midpoint.svg', alt: '교차곱 2×4=8과 3×3=9가 달라 2/3와 3/4는 같지 않다. 별도의 중점 구성에서 2/3=16/24와 3/4=18/24의 평균을 계산하면 17/24이다. 하나의 균일한 수직선 위에 16/24, 17/24, 18/24가 같은 간격으로 놓인다.', caption: '동치 판정: 8≠9 · 중점 구성: (16/24+18/24)/2=17/24 · 16/24<17/24<18/24' } },
  ],
} satisfies ContentPage;

export default page;
