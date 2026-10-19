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
    {
      id: 'first-parity',
      title: '분자가 짝수여야 해요',
      block: 2,
      from: 0,
      cards: [],
      known: '홀수 제곱의 계산으로 원래 정수의 짝수성 도출',
      figure: {
        src: '/content/number-systems/irrational-numbers/figure-first-parity.svg',
        alt: '앞서 얻은 p²=2q²에서 p²이 짝수임을 얻는다. 한편 p가 홀수라고 조건부로 가정하면 p=2j+1이고 p²=2(2j²+2j)+1이므로 p²은 홀수다. 같은 p²이 짝수이면서 홀수라는 모순으로 홀수 가정을 버려 p가 짝수라고 결론내고 p=2k로 쓴다.',
        caption: '이전 식의 짝수 결론 + 홀수라는 조건부 가정 → 모순 → 가정 기각 → p=2k',
      },
    },
    {
      id: 'second-parity',
      title: '분모도 짝수가 됩니다',
      block: 3,
      from: 0,
      cards: [],
      known: '두 짝수 결론과 기약 조건의 충돌',
      figure: {
        src: '/content/number-systems/irrational-numbers/figure-second-parity.svg',
        alt: '원래 식 p²=2q²에 앞 장면의 p=2k를 대입해 4k²=2q², 이어 q²=2k²을 얻고 q도 짝수라고 결론낸다. 이미 p도 짝수이므로 2가 p와 q의 공약수다. 이 결론은 처음 유리수 가정이 요구한 gcd(p,q)=1과 직접 모순이다.',
        caption: 'p=2k 대입 → q도 짝수 · p와 q의 공약수 2 → gcd(p,q)=1과 모순',
      },
    },
    { id: 'conclusion', title: '모순이 부정한 것은 무엇일까요?', block: 4, from: 0, cards: ['부정된 가정: √2∈Q', '결론: √2∉Q', '실수에서의 존재는 별도 문제'], known: '비유리성 결론의 정확한 범위' },
    {
      id: 'transfer',
      title: '√8에도 논리를 옮겨요',
      block: 5,
      from: 0,
      cards: [],
      known: '증명한 결과를 새 수에 전이하는 방법',
      figure: {
        src: '/content/number-systems/irrational-numbers/figure-transfer.svg',
        alt: '√8이 유리수라고 가정한다. 2는 0이 아닌 유리수이므로 유리수를 2로 나눈 √8/2도 유리수다. √8=2√2이므로 이 몫은 √2다. 따라서 √2가 유리수라는 결론이 나오지만, 이는 방금 증명한 √2∉Q와 모순이다. 처음 가정을 버려 √8∉Q라고 결론낸다.',
        caption: '√8∈Q → 0이 아닌 유리수 2로 나눠 √2∈Q → 방금 증명한 √2∉Q와 모순 → √8∉Q',
      },
    },
  ],
} satisfies ContentPage;

export default page;
