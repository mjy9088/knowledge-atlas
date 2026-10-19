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
    {
      id: 'question',
      title: '높이 좌표 2에서 다섯 칸 내려가면?',
      block: 0,
      from: 0,
      cards: [],
      known: '0을 원점으로 둔 높이 좌표의 계산',
      figure: {
        src: '/content/number-systems/negative-numbers/figure-five-steps.svg',
        alt: '0을 원점으로 둔 수직선에서 좌표 2부터 왼쪽으로 같은 한 칸을 다섯 번 이동해 1, 0, −1, −2를 지나 −3에 도착한다. 건물 층 이름이 아니라 고정된 수학적 좌표이다.',
        caption: '같은 간격으로 다섯 칸: 2 → 1 → 0 → −1 → −2 → −3 · 2−5=−3',
      },
    },
    { id: 'construction', title: '사례가 아니라 연산으로 정수를 만들어요', block: 1, from: 0, cards: ['동기: 빚 · 손실 · 영하', '정의: ℤ={…,−1,0,1,…}'], known: '역사적 동기와 현대 정의의 구별' },
    {
      id: 'inverse',
      title: '반대 수를 더하면 0',
      block: 2,
      from: 0,
      cards: [],
      known: '덧셈 역원과 정수의 순서',
      figure: {
        src: '/content/number-systems/negative-numbers/figure-additive-inverse.svg',
        alt: '같은 간격의 수직선에서 3과 −3은 0에서 세 칸씩 떨어져 반대편에 있고 3+(−3)=0이다. −2는 −5보다 오른쪽에 있으므로 −5<−2이다.',
        caption: '3과 −3: 0에서 같은 거리, 반대 방향, 합은 0 · −2는 −5보다 오른쪽',
      },
    },
    {
      id: 'subtraction',
      title: '빼기는 반대를 더하는 일',
      block: 3,
      from: 0,
      cards: [],
      known: '뺄셈을 덧셈 역원으로 바꾸는 이유',
      figure: {
        src: '/content/number-systems/negative-numbers/figure-subtraction-inverse.svg',
        alt: '−2−(−4)에서 빼는 수 −4의 덧셈 역원 +4를 취해 −2+4로 바꾼다. 수직선에서 −2부터 오른쪽으로 같은 한 칸을 네 번 이동해 2에 도착하므로 −2−(−4)=−2+4=2이다.',
        caption: '−4를 빼기 → 그 덧셈 역원 +4를 더하기 → −2에서 오른쪽 네 칸 → 2',
      },
    },
    { id: 'transfer', title: '정수로도 못 담는 결과는?', block: 4, from: 0, cards: ['−7+10=3', '1÷2 ∉ ℤ'], known: '정수 계산의 범위와 유리수로의 다음 질문' },
  ],
} satisfies ContentPage;

export default page;
