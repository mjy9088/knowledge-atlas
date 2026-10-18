import type {ContentPage} from '../../../packages/content/types.js';

export default {
  slug: 'light-clock-time',
  articleId: 'article:physics-discovery.light-clock-time.ko',
  label: '빛시계와 시간 간격',
  category: '물리 · 발견',
  claimRefs: [
    'claim:physics-discovery.light-clock-time.interval-kind',
    'claim:physics-discovery.light-clock-time.light-clock-deduction',
    'claim:physics-discovery.light-clock-time.coordinate-clocks',
    'claim:physics-discovery.light-clock-time.frame-symmetry',
    'claim:physics-discovery.light-clock-time.observational-support',
  ],
  scenes: [
    {id: 'question', title: '어느 시계가 절대적으로 느릴까요?', block: 0, from: 0, cards: ['빛시계 | 왕복 한 번 = 한 틱', '질문 | 같은 두 틱, 다른 간격'], known: '두 관찰자의 시간 비교'},
    {id: 'proper-time', title: '한 시계의 두 틱이 고유시간입니다', block: 1, from: 0, cards: ['같은 검출기 | 두 사건', '왕복 거리 | 2L', '고유시간 | 2L/c = Δτ'], known: '한 세계선 위의 두 사건'},
    {id: 'triangle', title: '다른 관성계에서는 빛길이 기울어집니다', block: 2, from: 0, cards: ['빛 | cΔt/2', '수평 이동 | vΔt/2', '수직 간격 | 두 계에서 같은 L', '(cΔt/2)² = L² + (vΔt/2)²'], known: '밝힌 가정 아래의 직각삼각형', figure: {src: '/content/physics-discovery/light-clock-time/light-clock.svg', alt: '왼쪽은 빛시계와 함께 가는 기준계에서 수직 간격 L을 왕복한 빛길 2L와 고유시간 Δτ=2L/c를 보인다. 오른쪽은 다른 관성계의 반 왕복을 빗변 cΔt/2, 수평변 vΔt/2, 수직변 L인 직각삼각형으로 보인다. 등속 관성 v<c, 불변인 빛 속력 c, 두 계에서 같은 횡방향 L을 가정한 구성도이며 v=0.6c의 3:4:5 비율은 설명용이다.', caption: '한 왕복의 고유시간과 움직이는 계의 반 왕복 삼각형 · 등속 v<c, c 불변, 횡간격 L 동일 · 구성도이지 측정 자료가 아님'}},
    {id: 'derivation', title: '삼각형에서 γ가 나옵니다', block: 3, from: 0, cards: ['L = cΔτ/2', '(c²−v²)Δt² = c²Δτ²', 'Δt = γΔτ', 'v=0.6c | γ=1.25 | 8 ns→10 ns'], known: '완전한 대수 유도와 계산 예'},
    {id: 'coordinate-time', title: 'Δt는 동기화된 좌표시계의 간격입니다', block: 4, from: 0, cards: ['Δτ | 한 위치 · 한 시계', 'Δt | 서로 다른 위치', '동기화 | 빛의 왕복시간을 반씩'], known: '고유시간과 좌표시간의 측정 조건'},
    {id: 'symmetry', title: '역할을 바꾸면 사건쌍도 바뀝니다', block: 5, from: 0, to: 2, cards: ['A의 두 틱 | E₁ · E₂', 'B의 두 틱 | F₁ · F₂'], known: '역할을 바꿀 때 선택하는 사건쌍'},
    {id: 'reciprocity-limit', title: '상호 비교는 절대 느림을 정하지 않습니다', block: 5, from: 2, cards: ['각 계 | 자기 두 틱은 고유시간', '결론 | 절대 느림 아님', '범위 밖 | 가속 · 재회'], known: '관성계 사이의 대칭과 한계'},
    {id: 'observation', title: '모형의 연역과 관측 근거는 다릅니다', block: 6, from: 0, cards: ['모형 | 빛시계 삼각형', '관측 보고 | 빠른 뮤온', '구별 | 유도 ≠ 측정'], known: '연역과 관측 지지의 구별'},
    {id: 'transfer', title: 'B 시계의 두 틱을 고르면?', block: 7, from: 0, cards: ['F₁·F₂ | B의 고유시간', 'A | 좌표시간', '0.6c | γ=1.25'], known: '바뀐 사건쌍에 원리를 적용'},
  ],
} satisfies ContentPage;
