import type {ContentPage} from '../../../packages/content/types.js';

export default {
  slug: 'nuclear-scattering',
  articleId: 'article:physics-discovery.nuclear-scattering.ko',
  label: '핵 산란',
  category: '물리 · 발견',
  styles: ['/topics/physics/nuclear-scattering.css'],
  claimRefs: [
    'claim:physics-discovery.nuclear-scattering.observation',
    'claim:physics-discovery.nuclear-scattering.nuclear-inference',
    'claim:physics-discovery.nuclear-scattering.history',
  ],
  scenes: [
    {id: 'question', title: '드문 되튐은 왜 중요했을까요?', block: 0, from: 0, cards: ['대부분 | 거의 직진', '극히 일부 | 큰 각도 · 뒤쪽', '질문 | 한 분포가 어떤 내부 배치를 가르는가?'], known: '희귀 사건과 전체 분포라는 질문'},
    {id: 'apparatus', title: '보이지 않는 내부를 각도로 읽었습니다', block: 1, from: 0, cards: [], known: '빔·표적·각도 검출의 역할', figure: {src: '/content/physics-discovery/nuclear-scattering/figure-apparatus.svg', alt: '1912–1913년 후속 검증의 정교화된 장치 예입니다. 왼쪽 알파 입자원과 조준 구멍이 가는 빔을 만들고 빔은 가운데 얇은 금박에 닿습니다. 한 황화아연 검출면-현미경 조립체를 금박 둘레에서 회전해 앞 0도, 옆 90도, 뒤 140도 위치의 섬광을 셉니다. 흐린 두 위치는 같은 조립체의 다른 각도이며 동시 검출기가 아닙니다. 앞선 1907–1909년 섬광 계수·박 산란 장치 전체를 재현하지 않으며 각도와 크기는 설명용입니다.', caption: '원본 개념도 · 1912–1913년 정교화된 후속 장치 예 · 한 황화아연 검출면-현미경 조립체를 회전 · 흐린 위치는 동시 검출기 아님'}},
    {id: 'pattern', title: '통과와 되튐을 함께 설명해야 합니다', block: 2, from: 0, cards: [], known: '관찰 패턴이 모형을 구별하는 방식', figure: {src: '/content/physics-discovery/nuclear-scattering/figure-angular-pattern.svg', alt: '위 관찰 띠는 방향 표시가 주로 입사 방향 0도 가까이에 모이고 옆 방향은 더 적으며 90도를 넘는 뒤 방향도 드물게 있음을 정성적으로 보입니다. 아래 모형 띠는 퍼진 전하가 누적된 작은 편향에 어울리는 반면 작은 중심에 집중된 전하는 작은 편향과 드문 큰각 편향을 함께 설명할 수 있음을 비교합니다. 수치, 비율, 히스토그램, 원자료가 아닙니다.', caption: '관찰과 모형 결과 분리 · 주로 앞쪽, 드문 옆·뒤쪽 · 정성 비교(계수·비율·히스토그램·원자료 아님) · 얇은 박은 다중 산란 제한 조건'}},
    {id: 'inference', title: '작고 강한 중심을 놓아 보면', block: 3, from: 0, to: 5, cards: [], known: '전하 집중과 부호 판정의 구별', figure: {src: '/content/physics-discovery/nuclear-scattering/figure-model-paths.svg', alt: '같은 중심에서 멀리 지나는 설명용 점선 경로는 조금 꺾이고 가까이 지나는 점선 경로는 크게 되돌아갑니다. 옆 추론 장부는 관찰한 각도 분포가 전하 집중을 지지하지만 전하 부호는 각도만으로 정하지 못함을 보입니다. 양의 중심 채택에는 베타 입자 흡수와 알파 입자 방출 속도에 관한 별도 힌트 및 후속 연구가 더해졌습니다. 점선은 측정 궤적이 아닙니다.', caption: 'MODEL 경로 · 측정 궤적 아님 · 분포→전하 집중 · 부호는 각도만으로 결정 안 됨 · 양의 중심은 별도 힌트와 후속 연구를 함께 고려'}},
    {id: 'empty-space-limit', title: '빈 공간이라는 말을 한정하면', block: 3, from: 5, cards: ['뜻 | 강한 편향 확률이 작음', '아님 | 전자가 사라진 진공'], known: '탐침에 따른 빈 공간 표현의 범위'},
    {id: 'history-limit', title: '한 번의 놀람으로 끝난 발견은 아닙니다', block: 4, from: 0, cards: ['1908–1909 | 산란 측정', '1909–1911 | 모형·계산', '1912–1913 | 추가 예측 시험', '미해결 | 중성자 · 쿼크 · 전자 상태'], known: '관찰·모형·검증과 후대 지식의 구별'},
    {id: 'transfer', title: '좁은 앞쪽 각도만 측정했다면?', block: 5, from: 0, cards: [], known: '측정 범위가 추론을 제한하는 방식', figure: {src: '/content/physics-discovery/nuclear-scattering/figure-angular-acceptance.svg', alt: '왼쪽의 개념적인 넓은 평면 내 각도 범위와 오른쪽의 좁은 앞쪽 범위가 같은 네 개의 설명용 사건 방향과 끝점을 사용합니다. 왼쪽은 완전한 입체각 4π 검출기가 아니라 산란 평면에서 앞·옆·뒤를 비교하는 범위입니다. 좁은 범위에서는 앞쪽 두 사건만 보이고 옆과 뒤 사건은 범위 밖이라 보이지 않습니다. 보이지 않는 것은 사건이 0이라는 뜻이 아닙니다.', caption: '같은 설명용 사건 방향 유지 · 개념적인 넓은 평면 내 각도 범위 vs 좁은 앞쪽 범위 · 4π 검출기 아님 · 옆·뒤가 안 보임 ≠ 사건 0'}},
  ],
} satisfies ContentPage;
