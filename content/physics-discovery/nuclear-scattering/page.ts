import type {ContentPage} from '../../../packages/content/types.js';

export default {
  slug: 'nuclear-scattering',
  articleId: 'article:physics-discovery.nuclear-scattering.ko',
  label: '핵 산란',
  category: '물리 · 발견',
  claimRefs: [
    'claim:physics-discovery.nuclear-scattering.observation',
    'claim:physics-discovery.nuclear-scattering.nuclear-inference',
    'claim:physics-discovery.nuclear-scattering.history',
  ],
  scenes: [
    {id: 'question', title: '드문 되튐은 왜 중요했을까요?', block: 0, from: 0, cards: ['대부분 | 거의 직진', '극히 일부 | 큰 각도 · 뒤쪽', '질문 | 한 분포가 어떤 내부 배치를 가르는가?'], known: '희귀 사건과 전체 분포라는 질문'},
    {id: 'apparatus', title: '보이지 않는 내부를 각도로 읽었습니다', block: 1, from: 0, cards: ['알파 입자원 → 얇은 금박', '회전 가능한 검출면 | 섬광 계수', '측정 | 산란 방향'], known: '빔·표적·각도 검출의 역할'},
    {id: 'pattern', title: '통과와 되튐을 함께 설명해야 합니다', block: 2, from: 0, cards: ['얇은 박 | 다중 산란 제한', '희귀 큰각 | 전하 집중 모형에 더 적합', '후속 검사 | 각도 · 두께 · 속도'], known: '관찰 패턴이 모형을 구별하는 방식'},
    {id: 'inference', title: '작고 강한 중심을 놓아 보면', block: 3, from: 0, to: 3, cards: ['멀리 통과 | 작은 편향', '가까이 통과 | 큰 편향', '각도 분포 | 전하 집중', '양의 부호 | 다른 증거와 결합'], known: '전하 집중과 부호 판정의 구별'},
    {id: 'empty-space-limit', title: '빈 공간이라는 말을 한정하면', block: 3, from: 3, cards: ['뜻 | 강한 편향 확률이 작음', '아님 | 전자가 사라진 진공'], known: '탐침에 따른 빈 공간 표현의 범위'},
    {id: 'history-limit', title: '한 번의 놀람으로 끝난 발견은 아닙니다', block: 4, from: 0, cards: ['1908–1909 | 산란 측정', '1909–1911 | 모형·계산', '1912–1913 | 추가 예측 시험', '미해결 | 중성자 · 쿼크 · 전자 상태'], known: '관찰·모형·검증과 후대 지식의 구별'},
    {id: 'transfer', title: '좁은 앞쪽 각도만 측정했다면?', block: 5, from: 0, cards: ['수용 범위 | 앞쪽 좁은 각도', '놓치는 것 | 옆·뒤 희귀 사건', '교훈 | 위치보다 측정 각도'], known: '측정 범위가 추론을 제한하는 방식'},
  ],
} satisfies ContentPage;
