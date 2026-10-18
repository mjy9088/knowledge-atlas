import type { ContentPage } from '../../../packages/content/types.js';

const page = {
  slug: 'negative-numbers',
  articleId: 'article:number-systems.negative-numbers.ko',
  label: '0 아래의 수',
  category: '수학 · 수 체계',
  model: null,
  claimRefs: [
    'claim:number-systems.integer.extension',
    'claim:number-systems.integer.additive-inverse',
    'claim:number-systems.integer.number-line',
    'claim:number-systems.integer.subtraction',
    'claim:number-systems.integer.historical-motivation',
  ],
  scenes: [
    { id: 'question', title: '높이 좌표 2에서 다섯 칸 내려가면?', block: 0, from: 0, cards: ['원점 0 · 위쪽 + · 아래쪽 −', '2 → 1 → 0 → −1 → −2 → −3', '2−5=−3'], known: '0을 원점으로 둔 높이 좌표의 계산' },
    { id: 'construction', title: '사례가 아니라 연산으로 정수를 만들어요', block: 1, from: 0, cards: ['동기: 빚 · 손실 · 영하', '정의: ℤ={…,−1,0,1,…}'], known: '역사적 동기와 현대 정의의 구별' },
    { id: 'inverse', title: '반대 수를 더하면 0', block: 2, from: 0, cards: ['3+(−3)=0', '−5 < −2 < 0 < 2'], known: '덧셈 역원과 정수의 순서' },
    { id: 'subtraction', title: '빼기는 반대를 더하는 일', block: 3, from: 0, cards: ['a−b=a+(−b)', '−2−(−4)=−2+4=2'], known: '뺄셈을 덧셈 역원으로 바꾸는 이유' },
    { id: 'transfer', title: '정수로도 못 담는 결과는?', block: 4, from: 0, cards: ['−7+10=3', '1÷2 ∉ ℤ'], known: '정수 계산의 범위와 유리수로의 다음 질문' },
  ],
} satisfies ContentPage;

export default page;
