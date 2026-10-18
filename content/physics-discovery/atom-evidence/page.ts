import type {ContentPage} from '../../../packages/content/types.js';

export default {
  slug: 'atom-evidence',
  articleId: 'article:physics-discovery.atom-evidence.ko',
  label: '원자의 증거',
  category: '물리 · 발견',
  claimRefs: [
    'claim:physics-discovery.atom-evidence.proxy-observation',
    'claim:physics-discovery.atom-evidence.quantitative-test',
    'claim:physics-discovery.atom-evidence.convergence',
  ],
  scenes: [
    {id: 'question', title: '보지 못한 것을 어떻게 검증할까요?', block: 0, from: 0, cards: ['가설 | 물질은 불연속적인 입자로 이루어짐', '과제 | 보인다면 어떤 수량적 흔적이 남을까?'], known: '직접 관찰과 간접 증거의 차이'},
    {id: 'observe', title: '보인 것은 원자가 아니라 흔들리는 입자였습니다', block: 1, from: 0, cards: ['현미경 | 콜로이드 입자', '관찰 | 불규칙한 이동', '보이지 않음 | 물 분자 하나하나'], known: '브라운 운동과 관찰 대상의 구별'},
    {id: 'predict', title: '무작위에도 계산할 패턴이 있습니다', block: 2, from: 0, cards: ['한 경로 | 모양을 맞히지 않음', '많은 입자 | 변위 통계', '다른 방법 | 같은 Nₐ를 예측'], known: '분자 모형에서 측정 가능한 예측으로 이동'},
    {id: 'measure', title: '세 측정값을 직접 비교하면', block: 3, from: 0, to: 2, cards: ['68.2 · 68.8 · 65', '단위 | ×10²² / 수소 2g', '범위 | 최대−최소 ≈ 최소의 5.8%'], known: '아보가드로 수의 독립적 추정'},
    {id: 'uncertainty', title: '오차 막대가 없다는 한계를 남깁니다', block: 3, from: 2, cards: ['말할 수 있음 | 가까운 값', '말할 수 없음 | 오차 범위의 일치'], known: '보고값의 수렴과 통계적 합치의 구별'},
    {id: 'limit', title: '역사적 값과 현대 단위를 구별합니다', block: 4, from: 0, cards: ['역사 | 수소 2g당 분자 수', '현대 SI | mol⁻¹', '탐침 | 콜로이드 ≠ 원자'], known: '모형을 거친 증거의 힘과 한계'},
    {id: 'transfer', title: '햇빛 속 먼지도 같은 증거일까요?', block: 5, from: 0, cards: ['통제 | 대류 · 진동 · 온도 차', '검사 | 정량 예측과 통계 비교', '강화 | 다른 방법의 같은 상수'], known: '새 관찰을 증거로 평가하는 기준'},
  ],
} satisfies ContentPage;
