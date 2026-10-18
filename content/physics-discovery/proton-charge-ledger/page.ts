import type {ContentPage} from '../../../packages/content/types.js';

export default {
  slug: 'proton-charge-ledger',
  articleId: 'article:physics-discovery.proton-charge-ledger.ko',
  label: '양성자의 전하 장부',
  category: '물리 · 발견',
  claimRefs: [
    'claim:physics-discovery.proton-charge-ledger.valence-label',
    'claim:physics-discovery.proton-charge-ledger.charge-sum',
    'claim:physics-discovery.proton-charge-ledger.composition-limit',
  ],
  scenes: [
    {id: 'question', title: 'uud면 정말 세 입자뿐일까요?', block: 0, from: 0, cards: ['관찰 | 양성자 전하 +1e', '표기 | uud', '질문 | 장부인가 입자 수인가?'], known: '전하 장부와 순간 구성의 구별'},
    {id: 'valence', title: 'uud는 순맛 장부입니다', block: 1, from: 0, cards: ['u−ū | 2', 'd−d̄ | 1', '바다 쌍 | 순맛 0'], known: '원자가 순맛 표기의 의미'},
    {id: 'charge', title: '분수 전하를 직접 더하면', block: 2, from: 0, cards: ['u | +2/3e', 'u | +2/3e', 'd | −1/3e', '합 | +1e'], known: '양성자 전하의 독립 계산'},
    {id: 'sea-gluons', title: '장부를 바꾸지 않는 성분도 있습니다', block: 3, from: 0, cards: ['u+ū | 전하 0 · 순맛 0', '글루온 | 전기전하 0', '주의 | 글루온은 색전하를 지님'], known: '바다 쌍과 글루온의 역할'},
    {id: 'limit', title: 'uud는 순간 배치나 운동량표가 아닙니다', block: 4, from: 0, to: 2, cards: ['아님 | 고전적 구슬 세 개', '아님 | 운동량 1/3씩', '광자 측정 | 모든 순간을 세지 못함'], known: 'uud와 전자기 산란의 한계'},
    {id: 'qcd-scope', title: '전체 상태와 가둠에는 QCD가 필요합니다', block: 4, from: 2, cards: ['별도 자료 | 여러 산란 측정', '별도 이론 | QCD', '별도 문제 | 가둠'], known: '전하 장부 밖의 QCD 범위'},
    {id: 'transfer', title: '쌍과 글루온을 더하면 전하는?', block: 5, from: 0, cards: ['uud | +1e', '추가 uū | 0', '추가 글루온 | 0', '결과 | 여전히 +1e'], known: '같은 전하가 다른 입자 수와 양립함'},
  ],
} satisfies ContentPage;
