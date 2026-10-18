import type { ContentPage } from '../../../packages/content/types.js';

const page = {
  slug: 'real-completeness',
  articleId: 'article:number-systems.real-completeness.ko',
  label: '최소 상한과 실수의 완비성',
  category: '수학 · 수 체계',
  model: null,
  claimRefs: [
    'claim:number-systems.completeness.supremum-definition',
    'claim:number-systems.completeness.rationals-dense-in-reals',
    'claim:number-systems.completeness.rational-gap',
    'claim:number-systems.completeness.real-lub',
    'claim:number-systems.completeness.rational-cut',
  ],
  scenes: [
    { id: 'question', title: '유리수 세계의 √2 경계', block: 0, from: 0, cards: ['A={q∈Q | q>0, q²<2}', '1∈A', '2는 상한'], known: '비어 있지 않고 위로 제한된 유리수 집합' },
    { id: 'bounds', title: '우주를 정하고 최소 상한을 정의해요', block: 1, from: 0, cards: ['표준 정의: A⊆R, u∈R', 'Q 비교: 상한도 Q에 한정', '최소 상한: 모든 상한 이하'], known: '실수의 표준 정의와 Q 내부 비교의 명시적 구별' },
    { id: 'gap', title: '유리수 상한은 언제나 더 줄어듭니다', block: 2, from: 0, cards: ['별도 정리: x<y인 실수 사이에 s∈Q', 'Q의 상한 r>√2', '√2<s<r인 s∈Q도 상한'], known: 'Q 내부 평균보다 강한 Q의 R 안에서의 조밀성과 최소 상한의 부재' },
    { id: 'property', title: '실수에서는 경계가 들어옵니다', block: 3, from: 0, cards: ['A⊆R', 'R에서 sup A=√2', '√2∈R'], known: '실수의 최소상한 성질' },
    { id: 'scope', title: '조밀성과 완비성은 다릅니다', block: 4, from: 0, cards: ['Q: 조밀함', 'Q: 최소상한 성질 실패', 'R 구성은 이번 범위 밖'], known: '완비성 주장의 조건과 증명 한계' },
    { id: 'transfer', title: '경계가 유리수라면?', block: 5, from: 0, cards: ['B={q∈Q | q<3}', 'Q에서 sup B=3', '두 예의 대조 · 일반 판정법 아님'], known: '√2 경계 사례와 3 경계 사례의 제한된 대조' },
  ],
} satisfies ContentPage;

export default page;
