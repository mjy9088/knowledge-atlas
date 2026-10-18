import type {ContentPage} from '../../../packages/content/types.js';

export default {
  slug: 'quark-evidence',
  articleId: 'article:physics-discovery.quark-evidence.ko',
  label: '쿼크의 산란 증거',
  category: '물리 · 발견',
  claimRefs: [
    'claim:physics-discovery.quark-evidence.measurement',
    'claim:physics-discovery.quark-evidence.factored-pattern',
    'claim:physics-discovery.quark-evidence.parton-inference',
  ],
  scenes: [
    {id: 'question', title: '사진 대신 확률 패턴을 읽습니다', block: 0, from: 0, cards: ['측정 | 출사 에너지 · 산란각', '계산 | 운동량 전달', '질문 | 어떤 내부 모형이 맞는가?'], known: '산란 측정과 내부 사진의 구별'},
    {id: 'measurement', title: '빔 에너지보다 사건의 Q²입니다', block: 1, from: 0, cards: ['입사 에너지 | 가능한 범위', 'Q² | 사건의 운동량 전달', 'DIS | 큰 Q² · 양성자 파괴'], known: '심층 비탄성 조건'},
    {id: 'factoring', title: '알려진 의존성을 먼저 분리합니다', block: 2, from: 0, to: 2, cards: ['측정 단면적 | Q² 의존', '모트 단면적 | 알려진 주된 인자', '구조함수 | 표적 정보'], known: '원시 단면적과 구조함수의 구별'},
    {id: 'factored-pattern', title: '분리한 연속영역의 의존성은 약했습니다', block: 2, from: 2, cards: ['비탄성 연속영역 | Q² 의존 약함', '비교 | 탄성 · 공명보다 약함'], known: '분리 뒤 나타난 제한적 패턴'},
    {id: 'conditional-extraction', title: '초기 W₂에는 가정이 붙었습니다', block: 3, from: 0, to: 2, cards: ['6° · 10° | W₁/W₂ 분리 불가', 'R=σL/σT | 경계 가정'], known: '분리되지 않은 구조함수와 추출 가정'},
    {id: 'conditional-pattern', title: '그 조건 안에서 스케일링과 양립했습니다', block: 3, from: 2, cards: ['범위 | 해당 운동학', 'νW₂ | 측정 오차 안에서 양립'], known: '조건부 추정에서 얻은 제한적 패턴'},
    {id: 'parton-inference', title: '점 모양의 전하 띤 파톤으로 해석했습니다', block: 4, from: 0, to: 1, cards: ['퍼진 전하 | 전체와 함께 반응', '하드 산란 | 전하 띤 파톤'], known: '산란 패턴에서 파톤으로 가는 추론'},
    {id: 'quark-identification', title: '쿼크 식별에는 다른 자료도 필요했습니다', block: 4, from: 1, to: 2, cards: ['중성자 자료', '전하 · 스핀 측정', '하드론 분류'], known: '전하 띤 파톤을 쿼크로 식별한 결합 증거'},
    {id: 'gluon-limit', title: '글루온은 별도 증거로 추론했습니다', block: 4, from: 2, cards: ['광자 | 전하에 직접 결합', '글루온 | 전기적으로 중성', '추론 | 스케일 변화 · 후속 증거'], known: '전자기 산란과 글루온 추론의 구별'},
    {id: 'transfer', title: '총개수만 셌다면?', block: 5, from: 0, cards: ['누락 | 각도 · 출사 에너지', '불가능 | Q² · 영역 분류', '결과 | 하드 중심 패턴 고립 실패'], known: '측정 변수가 추론을 가능하게 하는 이유'},
  ],
} satisfies ContentPage;
