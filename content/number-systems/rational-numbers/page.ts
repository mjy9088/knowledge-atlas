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
    { id: 'question', title: '1/2와 2/4는 두 수일까요?', block: 0, from: 0, cards: ['표기: 1/2 · 2/4', '수직선의 위치: 하나'], known: '표기와 수의 구별' },
    { id: 'equivalence', title: '교차곱이 같으면 같은 수', block: 1, from: 0, cards: ['a/b = c/d ⇔ ad = bc', '1×4 = 2×2'], known: '정수쌍 표현과 분수 동치' },
    { id: 'zero-denominator', title: '왜 분모 0은 제외할까요?', block: 2, from: 0, cards: ['b ≠ 0', 'a/0: 0×x=a를 만족할 x가 없음'], known: '0으로 나누기를 정의에서 제외하는 이유' },
    { id: 'density', title: '두 유리수 사이를 찾아요', block: 3, from: 0, cards: ['x < (x+y)/2 < y', '1/3 < 5/12 < 1/2'], known: '평균으로 확인하는 유리수의 조밀성', skip: {to: 'transfer', label: '완비성 다음 질문을 건너뛰고 적용하기'} },
    { id: 'completeness', title: '선택: 조밀하면 빈틈이 없을까요?', block: 4, from: 0, cards: ['이번 결과 | 두 유리수 사이에 또 있음', '다음 질문 | 모든 경계도 유리수인가?'], known: '조밀성의 결과와 후속 완비성 증명의 경계' },
    { id: 'transfer', title: '같은 수인지, 사이 수인지', block: 5, from: 0, cards: ['2/3 ≠ 3/4', '2/3 < 17/24 < 3/4'], known: '동치 판정과 중간 유리수의 전이 적용' },
  ],
} satisfies ContentPage;

export default page;
