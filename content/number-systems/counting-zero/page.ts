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
    { id: 'question', title: '빈 상자에는 몇 개가 있을까요?', block: 0, from: 0, cards: ['● ● ● → 1, 2, 3', '빈 상자 → 0'], known: '0이 빈 모음의 개수라는 답' },
    { id: 'empty-set', title: '없는 것도 개수로 말할 수 있어요', block: 1, from: 0, cards: ['∅', '|∅| = 0'], known: '빈 집합과 그 원소 수의 구별' },
    { id: 'identity', title: '0을 더하면 왜 그대로일까요?', block: 2, from: 0, cards: ['5 + 0 = 5', 'n + 0 = n'], known: '0의 덧셈 항등원 역할' },
    { id: 'convention', title: '자연수는 0부터 시작할까요?', block: 3, from: 0, cards: ['이 시리즈: ℕ={0,1,2,…}', '204: 자리 표시 · 0: 수'], known: '명시한 자연수 관례와 0의 두 쓰임' },
    { id: 'transfer', title: '0을 지나가는 뺄셈은 어떨까요?', block: 4, from: 0, cards: ['4−4=0 ∈ ℕ', '4−6=−2 ∉ ℕ'], known: '자연수 뺄셈의 한계와 정수로의 다음 질문' },
  ],
} satisfies ContentPage;

export default page;
