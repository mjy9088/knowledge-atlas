import type {ContentPage} from '../../../packages/content/types.js';

export default {
  slug: 'atom-evidence',
  articleId: 'article:physics-discovery.atom-evidence.ko',
  label: '원자의 증거',
  category: '물리 · 발견',
  styles: ['/topics/physics/atom-evidence.css'],
  claimRefs: [
    'claim:physics-discovery.atom-evidence.proxy-observation',
    'claim:physics-discovery.atom-evidence.quantitative-test',
    'claim:physics-discovery.atom-evidence.convergence',
  ],
  scenes: [
    {id: 'question', title: '보지 못한 것을 어떻게 검증할까요?', block: 0, from: 0, cards: ['가설 | 물질은 불연속적인 입자로 이루어짐', '과제 | 보인다면 어떤 수량적 흔적이 남을까?'], known: '직접 관찰과 간접 증거의 차이'},
    {id: 'observe', title: '보인 것은 원자가 아니라 흔들리는 입자였습니다', block: 1, from: 0, cards: [], known: '브라운 운동과 관찰 대상의 구별', figure: {src: '/content/physics-discovery/atom-evidence/figure-visible-proxy.svg', alt: '큰 콜로이드 입자만 현미경 관찰 대상입니다. 작은 물 분자 기호와 충돌 화살표는 관찰이 아니라 분자충돌 모형이며 크기는 비례하지 않습니다. 점선 지그재그 하나는 저자가 만든 설명용 경로이고 측정값, 역사적 궤적, 시뮬레이션 또는 확률 모형 검증 결과가 아닙니다.', caption: '원본 개념도 · 콜로이드만 관찰 대상 · 분자 기호·충돌 화살표는 모형이며 관찰·비례 크기 아님 · 점선은 저자 설명 경로'}},
    {id: 'predict', title: '변위 통계에서 Nₐ까지 이어 보면', block: 2, from: 0, cards: [], known: '관찰량에서 미시적 상수까지의 모형 다리', figure: {src: '/content/physics-discovery/atom-evidence/figure-measurement-pipeline.svg', alt: '한 좌표의 평균제곱변위와 시간 간격에서 확산계수 D를 구하고, 아인슈타인 관계, 구형 입자의 스토크스 항력, 기체 상수 관계를 대입해 Nₐ=RT/(6πηaD)를 얻는 원본 계산도입니다. 모든 양과 SI 단위, 평형·무표류·경계 영향 무시·구형 입자·희석계·스토크스 적용 범위를 표시하며 가상 수치는 없습니다.', caption: '원본 병진 모형 다리 · ⟨(Δx)²⟩→D→k_B→Nₐ · 양·단위·적용 가정 표시 · 가상 수치·역사값 변환 없음'}},
    {id: 'measure', title: '세 측정값을 직접 비교하면', block: 3, from: 0, to: 2, cards: [], known: '서로 다른 방법의 역사적 추정', figure: {src: '/content/physics-discovery/atom-evidence/figure-historical-estimates.svg', alt: '1926년 연설이 침강, 병진 운동, 회전 운동을 서술한 순서와 뒤이은 68.2, 68.8, 65 값의 순서를 대응시킨 뒤 수소 2그램당 10의 22제곱 개라는 공통 역사적 축에 표시합니다. 마지막 문장은 방법 이름을 붙인 표가 아닙니다. 범위는 3.8, 최솟값 대비 약 5.8퍼센트이며 오차 막대와 현대 몰 역수 값은 없습니다.', caption: '연설의 방법 서술 순서와 값 순서를 대응한 원본 공통축(명시적 값 표 아님) · ×10²²개/수소 2g · 범위 3.8 · 오차 막대 없음'}},
    {id: 'uncertainty', title: '오차 막대가 없다는 한계를 남깁니다', block: 3, from: 2, cards: ['말할 수 있음 | 서로 다른 방법의 가까운 보고값', '말할 수 없음 | 독립 오차 · 오차 범위의 일치'], known: '보고값의 수렴과 통계적 합치의 구별'},
    {id: 'limit', title: '역사적 값과 현대 단위를 구별합니다', block: 4, from: 0, cards: ['역사 | 수소 2g당 분자 수', '현대 SI | mol⁻¹', '탐침 | 콜로이드 ≠ 원자'], known: '모형을 거친 증거의 힘과 한계'},
    {id: 'transfer', title: '햇빛 속 먼지도 같은 증거일까요?', block: 5, from: 0, cards: ['저자 적용 점검표 | 공기 흐름 · 진동 · 온도 차', '검사 | 정량 예측과 통계 비교', '강화 | 다른 방법의 같은 상수'], known: '새 관찰을 증거로 평가하는 기준'},
  ],
} satisfies ContentPage;
