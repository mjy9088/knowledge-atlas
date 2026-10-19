import type { ContentPage } from '../../../packages/content/types.js';

const page = {
  slug: 'counting-zero',
  articleId: 'article:number-systems.counting-zero.ko',
  label: '세기와 0',
  category: '수학 · 수 체계',
  model: null,
  claimRefs: [
    'claim:number-systems.zero.empty-count',
    'claim:number-systems.zero.additive-identity',
    'claim:number-systems.natural.zero-convention',
    'claim:number-systems.zero.placeholder-history',
  ],
  scenes: [
    {
      id: 'question',
      title: '빈 상자에는 몇 개가 있을까요?',
      block: 0,
      from: 0,
      cards: [],
      known: '0이 빈 모음의 개수라는 답',
      figure: {
        src: '/content/number-systems/counting-zero/figure-counting-empty.svg',
        alt: '같은 상자를 비교한다. 왼쪽에는 실제 구슬 세 개가 있어 세면 3이고, 오른쪽에는 구슬이 하나도 없어 세면 0이다.',
        caption: '같은 상자, 다른 내용물: 구슬 3개 → 개수 3 · 빈 상자 → 개수 0',
      },
    },
    {
      id: 'empty-set',
      title: '없는 것도 개수로 말할 수 있어요',
      block: 1,
      from: 0,
      cards: [],
      known: '빈 집합과 그 원소 수의 구별',
      figure: {
        src: '/content/number-systems/counting-zero/figure-empty-cardinality.svg',
        alt: '∅는 원소가 없는 모음을 가리키고, 원소 수를 세는 화살표가 수 0으로 이어진다. |∅|=0은 그 모음의 개수를 답한다. 모음과 개수의 역할을 구별하며 수의 집합론적 구성은 다루지 않는다.',
        caption: '집합 ∅ 자체와 그 원소 수 0을 구별하는 기수 대응: |∅|=0',
      },
    },
    {
      id: 'identity',
      title: '0을 더하면 왜 그대로일까요?',
      block: 2,
      from: 0,
      cards: [],
      known: '0의 덧셈 항등원 역할',
      figure: {
        src: '/content/number-systems/counting-zero/figure-add-zero.svg',
        alt: '실제 항목 다섯 개가 든 모음에 항목이 하나도 없는 빈 모음을 더한다. 결과 모음에도 실제 항목 다섯 개가 남아 5+0=5가 된다.',
        caption: '5개인 모음 + 0개인 빈 모음 = 그대로 5개 · 5+0=5',
      },
    },
    { id: 'convention', title: '자연수는 0부터 시작할까요?', block: 3, from: 0, cards: ['이 시리즈: ℕ={0,1,2,…}', '204: 자리 표시 · 0: 수'], known: '명시한 자연수 관례와 0의 두 쓰임' },
    { id: 'transfer', title: '0을 지나가는 뺄셈은 어떨까요?', block: 4, from: 0, cards: [], known: '자연수 뺄셈의 한계와 정수로의 다음 질문', figure: {src:'/content/number-systems/counting-zero/figure-subtraction-deficit.svg',alt:'실제로 있는 네 개와 필요한 여섯 자리 중 비어 있는 두 자리를 비교한다. −2는 두 개 부족하다는 장부의 잔액이며 실제 사과의 개수가 아니다.',caption:'개수 4 · 필요 6 · 장부 잔액 −2: 실제 사과의 개수와 부족분을 구별합니다.'} },
  ],
} satisfies ContentPage;

export default page;
