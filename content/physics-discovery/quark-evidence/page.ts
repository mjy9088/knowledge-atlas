import type {ContentPage} from '../../../packages/content/types.js';

export default {
  slug: 'quark-evidence',
  articleId: 'article:physics-discovery.quark-evidence.ko',
  label: '쿼크의 산란 증거',
  category: '물리 · 발견',
  styles: ['/topics/physics/quark-evidence.css'],
  claimRefs: [
    'claim:physics-discovery.quark-evidence.measurement',
    'claim:physics-discovery.quark-evidence.factored-pattern',
    'claim:physics-discovery.quark-evidence.parton-inference',
  ],
  scenes: [
    {id: 'question', title: '사진 대신 확률 패턴을 읽습니다', block: 0, from: 0, cards: [], known: '산란 측정과 내부 사진의 구별', figure: {src: '/content/physics-discovery/quark-evidence/figure-pipeline.svg', alt: '전자 산란의 증거를 측정, 처리, 조건부 패턴, 해석의 네 단계로 나눈 흐름도입니다. 측정한 출사 에너지와 각도에서 사건 운동학을 계산하고, 알려진 인자를 분리한 뒤 가정과 범위를 보존한 패턴으로 전하 띤 점 모양 파톤 모형을 지지합니다. 화살표는 의존 관계이며 자동 결론이나 양성자 내부 사진이 아닙니다.', caption: '정성 모식도 · 측정 → 처리 → 조건부 패턴 → 해석 · 의존 관계이지 자동 결론이나 내부 사진 아님'}},
    {id: 'measurement', title: '빔 에너지보다 사건의 Q²입니다', block: 1, from: 0, cards: [], known: '심층 비탄성 조건', figure: {src: '/content/physics-discovery/quark-evidence/figure-kinematics.svg', alt: '양성자 정지 실험실계에서 빔 에너지 E와 측정한 출사 에너지 E 프라임, 산란각 세타로 뉴, 현대의 양수 Q 제곱, 하드론 최종상태 불변질량 W를 차례로 정의합니다. W는 구조함수 W1과 W2가 아니며, 에너지는 GeV, 제곱 불변량은 GeV 제곱, c는 1입니다.', caption: '저자 작성 관계도 · 한 사건의 E·E′·θ → ν·양수 Q²=−qμqμ·하드론 W · 양성자 정지 실험실계, c=1 · W와 W₁/W₂는 다른 양'}},
    {id: 'factoring', title: '알려진 의존성을 먼저 분리합니다', block: 2, from: 0, to: 2, cards: [], known: '원시 단면적과 구조함수의 구별', figure: {src: '/content/physics-discovery/quark-evidence/figure-mott-processing.svg', alt: '같은 E, E 프라임, 세타에서 측정 미분 단면적을 모트 단면적으로 나누면 W2 더하기 2W1 탄젠트 제곱 세타 나누기 2라는 구조함수 조합이 남는 처리 장부입니다. 이 값은 원시 단면적의 스케일링이나 유일한 W2가 아닙니다.', caption: '저자 작성 처리 장부 · 같은 운동학의 측정 단면적 ÷ 모트 단면적 = W₂+2W₁tan²(θ/2) · 유일한 W₂ 아님'}},
    {id: 'factored-pattern', title: '고정한 W에서 잔여 의존성을 비교했습니다', block: 2, from: 2, cards: [], known: '분리 뒤 나타난 제한적 패턴', figure: {src: '/content/physics-discovery/quark-evidence/figure-residual-pattern.svg', alt: '하드론 최종상태 불변질량 W를 고정하고 양수 Q 제곱을 바꿀 때, 깊은 비탄성 연속영역의 모트 분리 뒤 의존성이 탄성과 공명보다 약한 정성 비교입니다. W는 구조함수 W1, W2가 아니며 측정점, 수치 축, 오차 띠, 역사 곡선이 아닙니다.', caption: '정성 모식도 · 하드론 불변질량 W 고정, 양수 Q² 변화 · 깊은 연속영역의 잔여 의존이 탄성·공명보다 약함 · 원자료 아님'}},
    {id: 'conditional-extraction', title: '초기 W₂에는 모형 추출 가정이 붙었습니다', block: 3, from: 0, to: 2, cards: [], known: '분리되지 않은 구조함수와 추출 가정', figure: {src: '/content/physics-discovery/quark-evidence/figure-conditional-extraction.svg', alt: '6도와 10도 단면적 조합이 함수 W1과 W2를 따로 정하지 못해 R이 0인 횡편광 우세와 R이 무한대로 가는 종편광 우세를 모형 추출의 두 극단으로 두는 의존 지도입니다. 두 극단은 측정된 오차 띠가 아닙니다.', caption: '정성 의존 지도 · W₁·W₂는 함수 · R=0 횡편광 우세와 R→∞ 종편광 우세는 모형 추출 극단이며 측정 오차 띠 아님'}},
    {id: 'conditional-pattern', title: '두 R 가정은 같은 결과를 주지 않았습니다', block: 3, from: 2, cards: [], known: '조건부 추정에서 얻은 제한적 패턴', figure: {src: '/content/physics-discovery/quark-evidence/figure-scaling-condition.svg', alt: '두 행의 정성 대비입니다. R이 0인 횡편광 우세에서는 뉴 W2가 오메가의 함수라는 결과와 Q 제곱 1 GeV 제곱 초과, 오메가 4 초과에서 측정 오차 안에 양립합니다. R이 무한대로 가는 종편광 우세에서는 보편 곡선으로 모이지 않고 고정 오메가에서 뉴 W2가 Q 제곱과 함께 커집니다. 역사적 자료점이나 오차 띠가 아닙니다.', caption: '정성 2행 대비 · R=0: Q²>1 GeV², ω>4에서 νW₂ 보편 곡선과 오차 안 양립 · R→∞: 불일치, 고정 ω에서 Q²와 함께 증가 · 원자료 아님'}},
    {id: 'parton-inference', title: '억제와 비결맞은 중심을 비교했습니다', block: 4, from: 0, to: 1, cards: [], known: '산란 패턴에서 파톤으로 가는 추론', figure: {src: '/content/physics-discovery/quark-evidence/figure-parton-inference.svg', alt: '퍼진 전하 전체의 결맞은 반응은 분해능이 높아질수록 형태인자 억제가 강해지는 반면, 내부 크기가 풀리지 않는 독립적인 전하 중심과 비결맞게 산란하는 파톤 근사는 약한 잔여 의존성과 조건부 스케일링을 허용한다는 모형 비교입니다. 한 중심 표시는 설명용이며 수 정보를 주지 않습니다.', caption: '정성 모형 비교 · 확장된 결맞은 전하의 형태인자 억제 vs 미해결 독립 전하 중심의 비결맞은 산란 · 한 표시는 설명용, 수 정보 없음'}},
    {id: 'quark-identification', title: '이 독자는 완전한 쿼크 식별을 유도하지 않습니다', block: 4, from: 1, to: 2, cards: [], known: '파톤 해석과 후대 쿼크 동일시의 경계', figure: {src: '/content/physics-discovery/quark-evidence/figure-quark-convergence.svg', alt: 'Nobel의 회고 자료가 파톤 해석이 뒤에 쿼크 모형과 동일시되었다고 보고하는 범위와, 이 독자가 양성자 패턴만으로 완전한 쿼크 정체를 유도하지 않는 경계를 나란히 보여 줍니다. 별도의 역사 증거 목록이나 정량 가중치를 만들지 않습니다.', caption: '출처 경계도 · Nobel 회고: 파톤 해석은 뒤에 쿼크 모형과 동일시 · 이 독자: 양성자 패턴만으로 완전한 정체를 유도하지 않음'}},
    {id: 'gluon-limit', title: '글루온은 Q² 의존 스케일링 위반에서 따로 추론합니다', block: 4, from: 2, cards: [], known: '전자기 산란과 글루온 추론의 구별', figure: {src: '/content/physics-discovery/quark-evidence/figure-gluon-boundary.svg', alt: '가상 광자가 전하 띤 쿼크 중심에 직접 결합하는 경로와 전기적으로 중성인 글루온이 Q 제곱 의존 스케일링 위반과 후속 증거에서 추론되는 별도 경로를 나란히 구분합니다. 한 실험이 완전한 QCD를 단독 확정한 것은 아닙니다.', caption: '정성 경계도 · 광자는 전하 띤 쿼크에 직접 결합 · 중성 글루온은 Q² 의존 스케일링 위반과 후속 증거의 별도 추론'}},
    {id: 'transfer', title: '총개수만 셌다면?', block: 5, from: 0, cards: [], known: '측정 변수가 추론을 가능하게 하는 이유', figure: {src: '/content/physics-discovery/quark-evidence/figure-transfer.svg', alt: '총 사건 수만 있고 출사 에너지와 산란각이 없을 때 사건별 Q 제곱과 에너지 전달 계산, 탄성·공명·DIS 영역 분류, 같은 운동학의 모트 인자 제거, 하드 중심 패턴 고립이 차례로 불가능해지는 끊긴 흐름도입니다. 문제는 표본 수가 아니라 필수 사건 변수와 비교 가능성이 없다는 점입니다.', caption: '정성 모식도 · 총계수만으로 E′·θ를 복구할 수 없음 · Q²·ν, 영역 분류, 같은 운동학 처리, 하드 패턴 고립이 끊김'}},
  ],
} satisfies ContentPage;
