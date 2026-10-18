import type { ContentPage } from '../../../packages/content/types.js';

const page = {
  slug: 'rational-representations',
  articleId: 'article:number-systems.rational-representations.ko',
  label: '분수 표기를 한 수로 묶는 규칙',
  category: '수학 · 수 체계',
  model: null,
  claimRefs: [
    'claim:number-systems.rational-representations.domain',
    'claim:number-systems.rational-representations.cross-product',
    'claim:number-systems.rational-representations.equivalence',
    'claim:number-systems.rational-representations.zero-pair-boundary',
  ],
  scenes: [
    { id: 'opening-case', title: '서로 다른 세 표기, 같은 한 수', block: 0, from: 0, to: 1, cards: ['1/2 · 2/4 · 3/6', '표기는 셋 · 나타내는 수는 하나'], known: '서로 다른 분수 표기와 하나의 수의 구별' },
    { id: 'stable-grouping', title: '중간 표기가 바뀌어도 같은 묶음', block: 0, from: 1, cards: ['1/2 ↔ 2/4', '2/4 ↔ 3/6', '그러면 1/2 ↔ 3/6이어야 함'], known: '중간 표기에 흔들리지 않는 묶음의 필요성' },
    { id: 'cross-product-domain', title: '먼저 허용할 정수쌍을 정해요', block: 1, from: 0, to: 2, cards: ['D={(a,b)∈Z² : b≠0}', '(a,b)~(c,d) ⇔ ad=bc'], known: '분모가 0이 아닌 정수쌍과 교차곱 관계' },
    { id: 'cross-product-chain', title: '연쇄의 두 관계를 확인해요', block: 1, from: 2, cards: ['1×4 = 2×2', '2×6 = 4×3', '남은 질문: 1×6 = 2×3?'], known: '구체적 교차곱 연쇄와 추이성 질문' },
    { id: 'self-and-direction', title: '반사성과 대칭성의 역할', block: 2, from: 0, to: 2, cards: ['반사성: A~A', '대칭성: A~B ⇒ B~A'], known: '반사성과 대칭성이 묶음에 하는 역할' },
    { id: 'middle-link', title: '중간 표기가 달라도 같은 결과', block: 2, from: 2, to: 3, cards: ['A~B, B~C ⇒ A~C'], known: '추이성이 중간 표기의 선택을 제거하는 역할' },
    { id: 'equivalence-name', title: '세 조건을 모두 만족하는 관계', block: 2, from: 3, cards: ['반사성 · 대칭성 · 추이성', '세 조건 모두 ⇒ 동치 관계'], known: '동치 관계의 세 조건과 명칭' },
    { id: 'proof-setup', title: '추이성 증명의 출발점', block: 3, from: 0, to: 3, cards: ['반사성: ab=ba', '대칭성: ad=bc ⇒ cb=da'], known: '교차곱 관계의 반사성·대칭성과 추이성 증명 전략' },
    { id: 'proof-products', title: '두 등식의 가운데 항을 맞춰요', block: 3, from: 3, to: 5, cards: ['ad=bc, cf=de', 'adf=bcf=bde'], known: '추이성 가정과 곱셈으로 연결한 정수 등식' },
    { id: 'integer-cancellation', title: '0이 아닌 중간 분모를 소거해요', block: 3, from: 5, to: 6, cards: ['d(af−be)=0', 'd≠0 ⇒ af−be=0', 'af=be'], known: '중간 분모 조건을 사용한 정수 소거' },
    { id: 'proof-result', title: '양 끝 표기도 같은 묶음입니다', block: 3, from: 6, cards: ['(a,b)~(e,f)', '1×6 = 2×3'], known: '추이성 결론과 처음 연쇄의 완성' },
    { id: 'zero-pair-links', title: '0/0은 모든 표기 사이에 끼어들어요', block: 4, from: 0, to: 2, cards: ['(1,1)~(0,0)', '(0,0)~(1,2)'], known: '모든 정수쌍으로 넓힌 관계에서 생기는 두 연결' },
    { id: 'zero-pair-failure', title: '하지만 양 끝은 관계가 없어요', block: 4, from: 2, to: 4, cards: ['1×2 ≠ 1×1', '(1,1)≁(1,2)', '추이성 실패'], known: '0쌍이 만드는 구체적 추이성 반례' },
    { id: 'counterexample-scope', title: '반례가 말하는 범위를 지켜요', block: 4, from: 4, cards: ['실패: 모든 Z² 위의 이 교차곱 관계', '주장하지 않음: 모든 확장 수 체계의 불가능'], known: '0쌍 반례의 정확한 적용 범위' },
    { id: 'transfer-checks', title: '새 연쇄의 두 교차곱', block: 5, from: 0, to: 2, cards: ['2×6 = 3×4', '4×15 = 6×10'], known: '새 정수쌍 연쇄의 관계 확인' },
    { id: 'transfer-result', title: '중간 분모도 확인해요', block: 5, from: 2, cards: ['6≠0', '2×15 = 3×10 = 30', '(2,3)~(10,15)'], known: '중간 분모 조건을 확인하는 추이성의 전이 적용' },
  ],
} satisfies ContentPage;

export default page;
