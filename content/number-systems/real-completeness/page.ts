import type { ContentPage } from '../../../packages/content/types.js';

const page = {
  slug: 'real-completeness',
  articleId: 'article:number-systems.real-completeness.ko',
  label: '최소 상한과 실수의 완비성',
  category: '수학 · 수 체계',
  model: null,
  styles: ['/topics/number-systems/real-completeness.css'],
  claimRefs: [
    'claim:number-systems.completeness.supremum-definition',
    'claim:number-systems.completeness.rationals-dense-in-reals',
    'claim:number-systems.completeness.rational-gap',
    'claim:number-systems.completeness.real-lub',
    'claim:number-systems.completeness.rational-cut',
  ],
  scenes: [
    { id: 'question', title: '유리수 세계의 √2 경계', block: 0, from: 0, cards: [], known: '비어 있지 않고 위로 제한된 유리수 집합', figure: { src: '/content/number-systems/real-completeness/figure-question.svg', alt: 'A는 양수이고 제곱이 2보다 작은 유리수의 집합이다. 1은 양수이고 1의 제곱이 2보다 작으므로 A에 속한다. 모든 q∈A는 q<√2<2를 만족하므로 2는 상한이다. 공통 수직선에는 1, √2, 2가 이 순서로 놓인다.', caption: '1>0, 1²<2 → 1∈A · 모든 q∈A에 q<√2<2 → 2는 상한' } },
    { id: 'bounds', title: '우주를 정하고 최소 상한을 정의해요', block: 1, from: 0, cards: [], known: '상한·최소 상한·최대 원소와 Q/R 우주의 명시적 구별', figure: { src: '/content/number-systems/real-completeness/figure-bound-definitions.svg', alt: 'A⊆U인 순서 집합 U에서 상한 u∈U는 모든 q∈A에 q≤u를 만족한다. 최소 상한 u는 그 자체로 상한이면서 U에 속한 모든 상한 v에 u≤v를 만족한다. 최대 원소 m은 상한이면서 A 자체에 속해야 한다.', caption: 'A⊆U · 상한 u∈U: 모든 q∈A에 q≤u · 최소 상한: 상한이며 모든 상한 v∈U에 u≤v · 최대 원소: m∈A인 상한' } },
    { id: 'gap', title: '유리수 후보의 세 경우를 모두 봅니다', block: 2, from: 0, cards: [], known: 'Q의 R 안에서의 조밀성을 쓴 세 경우와 최소 상한의 부재', figure: { src: '/content/number-systems/real-completeness/figure-rational-gap.svg', alt: '유리수 후보 r을 √2와 비교한다. r<√2이면 r≤0은 1∈A 때문에 상한이 아니고, 0<r<√2이면 r<q<√2인 유리수 q가 A에 들어가 r을 넘는다. r=√2이면 √2는 유리수가 아니다. r>√2이면 √2<s<r인 유리수 s를 잡을 수 있고, 모든 q∈A에 q<√2<s이므로 s는 r보다 작은 상한이다. 세 경우 모두 r은 Q에서 최소 상한이 아니다.', caption: 'r<√2: A 원소를 놓침 · r=√2: √2∉Q · r>√2: q<√2<s<r이므로 s가 더 작은 상한' } },
    { id: 'property', title: '같은 경계를 Q와 R에서 비교해요', block: 3, from: 0, cards: [], known: '같은 집합의 Q 내부 실패와 R 내부 최소성 증명', figure: { src: '/content/number-systems/real-completeness/figure-ambient-comparison.svg', alt: '같은 집합 A는 유리수 우주 Q에서는 최소 상한이 없다. 실수 우주 R에서는 모든 q∈A가 √2보다 작아 √2가 상한이다. r≤0이면 1∈A가 r을 넘는다. 0<r<√2이면 조밀성으로 r<q<√2인 유리수 q∈A를 골라 r이 상한이 아님을 보인다. 따라서 R에서 sup A=√2이다.', caption: '같은 A · Q: 최소 상한 없음 · R: √2가 상한이고 모든 r<√2는 상한이 아니므로 sup A=√2' } },
    { id: 'scope', title: '조밀성과 완비성은 다릅니다', block: 4, from: 0, cards: ['Q: 조밀함', 'Q: 최소상한 성질 실패', 'R 구성은 이번 범위 밖'], known: '완비성 주장의 조건과 증명 한계' },
    { id: 'transfer', title: '경계가 유리수인 이 사례는?', block: 5, from: 0, cards: [], known: '중점으로 보인 B의 Q 내부 최소 상한과 제한된 대조', figure: { src: '/content/number-systems/real-completeness/figure-transfer.svg', alt: 'B는 3보다 작은 유리수의 집합이다. 3은 유리수이며 B의 상한이다. 임의의 유리수 r<3에 대해 q=(r+3)/2는 유리수이고 r<q<3이므로 B에 속한다. 따라서 r은 상한이 아니며 Q에서 sup B=3이다.', caption: '3은 상한 · r∈Q, r<3이면 q=(r+3)/2∈B이고 r<q<3 · 따라서 Q에서 sup B=3' } },
  ],
} satisfies ContentPage;

export default page;
