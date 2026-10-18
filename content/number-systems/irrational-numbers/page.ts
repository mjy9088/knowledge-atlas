import type { ContentPage } from '../../../packages/content/types.js';

const page = {
  slug: 'irrational-numbers',
  articleId: 'article:number-systems.irrational-numbers.ko',
  label: '√2가 무리수인 이유',
  category: '수학 · 수 체계',
  model: null,
  claimRefs: [
    'claim:number-systems.irrational.reduced-form',
    'claim:number-systems.irrational.parity-lemma',
    'claim:number-systems.irrational.sqrt2',
    'claim:number-systems.irrational.sqrt8',
  ],
  scenes: [
    { id: 'question', title: '가까운 분수와 정확한 분수', block: 0, from: 0, cards: ['1.414² ≈ 1.999396', '근삿값 ≠ 등식의 증명'], known: '유한소수 근사와 정확한 같음의 구별' },
    { id: 'assumption', title: '가장 간단한 분수라고 가정', block: 1, from: 0, cards: ['√2 = p/q', 'gcd(p,q)=1', 'p² = 2q²'], known: '귀류법의 가정과 기약분수 조건' },
    { id: 'first-parity', title: '분자가 짝수여야 해요', block: 2, from: 0, cards: ['p=2j+1 ⇒ p²=2(2j²+2j)+1', 'p² 짝수 ⇒ p 짝수', 'p = 2k'], known: '홀수 제곱의 계산으로 원래 정수의 짝수성 도출' },
    { id: 'second-parity', title: '분모도 짝수가 됩니다', block: 3, from: 0, cards: ['4k² = 2q²', 'q² = 2k² ⇒ q 짝수', '2가 공약수: 서로소와 모순'], known: '두 짝수 결론과 기약 조건의 충돌' },
    { id: 'conclusion', title: '모순이 부정한 것은 무엇일까요?', block: 4, from: 0, cards: ['부정된 가정: √2∈Q', '결론: √2∉Q', '실수에서의 존재는 별도 문제'], known: '비유리성 결론의 정확한 범위' },
    { id: 'transfer', title: '√8에도 논리를 옮겨요', block: 5, from: 0, cards: ['√8 = 2√2', '√8∈Q ⇒ √2=√8/2∈Q', '모순 ⇒ √8∉Q'], known: '증명한 결과를 새 수에 전이하는 방법' },
  ],
} satisfies ContentPage;

export default page;
