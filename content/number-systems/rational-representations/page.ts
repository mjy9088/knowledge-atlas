import type { ContentPage } from '../../../packages/content/types.js';

const page = {
  slug: 'rational-representations',
  articleId: 'article:number-systems.rational-representations.ko',
  label: '분수 표기를 한 수로 묶는 규칙',
  category: '수학 · 수 체계',
  styles: ['/topics/number-systems/rational-representations.css'],
  model: null,
  claimRefs: [
    'claim:number-systems.rational-representations.domain',
    'claim:number-systems.rational-representations.cross-product',
    'claim:number-systems.rational-representations.equivalence',
    'claim:number-systems.rational-representations.zero-pair-boundary',
  ],
  scenes: [
    { id: 'opening-case', title: '서로 다른 세 표기, 같은 한 수', block: 0, from: 0, to: 1, cards: [], known: '서로 다른 분수 표기와 하나의 수의 구별', figure: { src: '/content/number-systems/rational-representations/figure-opening-group.svg', alt: '서로 다른 표기 1/2, 2/4, 3/6이 하나의 같은 값 묶음으로 모인다. 세 표기는 서로 다르지만 모두 같은 절반을 나타낸다는 문제를 보여 준다.', caption: '표기는 셋 · 의도한 값 묶음은 하나: 1/2, 2/4, 3/6' } },
    { id: 'stable-grouping', title: '중간 표기가 바뀌어도 같은 묶음', block: 0, from: 1, cards: [], known: '중간 표기에 흔들리지 않는 묶음의 필요성', figure: { src: '/content/number-systems/rational-representations/figure-grouping-need.svg', alt: '분수식 1/2와 2/4, 2/4와 3/6이 각각 같은 수를 나타내는 표기로 묶여 있다. 아직 규칙을 정의하기 전이며, 중간 표기에 흔들리지 않으려면 1/2와 3/6도 직접 같은 묶음이어야 한다는 질문을 보여 준다.', caption: '두 번의 같은 값 묶음이 양 끝의 묶음도 요구할까요?' } },
    { id: 'cross-product-domain', title: '먼저 허용할 정수쌍을 정해요', block: 1, from: 0, to: 2, cards: ['D={(a,b)∈Z² : b≠0}', '(a,b)~(c,d) ⇔ ad=bc'], known: '분모가 0이 아닌 정수쌍과 교차곱 관계' },
    { id: 'cross-product-chain', title: '연쇄의 두 관계를 확인해요', block: 1, from: 2, cards: [], known: '구체적 교차곱 연쇄와 추이성 질문', figure: { src: '/content/number-systems/rational-representations/figure-chain-target.svg', alt: '세 노드 1/2, 2/4, 3/6 사이에서 첫 연결은 1×4=2×2, 둘째 연결은 2×6=4×3으로 확인된다. 양 끝 연결은 1×6=2×3인지 증명해야 할 목표로 표시된다.', caption: '안쪽 두 교차곱은 확인됨 · 바깥 교차곱 1×6=2×3은 아직 증명 목표' } },
    { id: 'self-and-direction', title: '반사성과 대칭성의 역할', block: 2, from: 0, to: 2, cards: [], known: '반사성과 대칭성이 묶음에 하는 역할', figure: { src: '/content/number-systems/rational-representations/figure-property-roles.svg', alt: '반사성은 A가 자기 자신과 연결되어 표기가 묶음 밖에 남지 않게 한다. 대칭성은 A와 B의 관계를 방향 없는 연결로 나타내어 어느 쪽에서 읽어도 같은 묶음임을 보여 준다.', caption: '반사성: 자기 포함 · 대칭성: 읽는 방향과 무관' } },
    { id: 'middle-link', title: '중간 표기가 달라도 같은 결과', block: 2, from: 2, to: 3, cards: [], known: '추이성이 중간 표기의 선택을 제거하는 역할', figure: { src: '/content/number-systems/rational-representations/figure-middle-link.svg', alt: '두 전제 A~B와 B~C에서 추이성이라는 논리 단계를 거쳐 결론 A~C를 얻는다. 화살표는 관계의 방향이 아니라 전제에서 결론으로 가는 추론 순서를 나타낸다.', caption: 'A~B와 B~C를 전제로 추이성을 적용하면 A~C' } },
    { id: 'equivalence-name', title: '세 조건을 모두 만족하는 관계', block: 2, from: 3, cards: ['반사성 · 대칭성 · 추이성', '세 조건 모두 ⇒ 동치 관계'], known: '동치 관계의 세 조건과 명칭' },
    { id: 'proof-setup', title: '추이성 증명의 출발점', block: 3, from: 0, to: 3, cards: ['반사성 완료: ab=ba', '대칭성 완료: ad=bc ⇒ cb=da', '남은 일: 정수 곱셈과 등식만으로 추이성 증명'], known: '교차곱 관계의 반사성·대칭성과 추이성 증명 전략' },
    { id: 'proof-products', title: '두 등식의 가운데 항을 맞춰요', block: 3, from: 3, to: 5, cards: [], known: '추이성 가정과 곱셈으로 연결한 정수 등식', figure: { src: '/content/number-systems/rational-representations/figure-common-product.svg', alt: '추이성의 두 정수 등식 ad=bc와 cf=de가 위아래로 놓인다. 첫 식에는 f를 곱해 adf=bcf를 만들고 둘째 식에는 b를 곱해 bcf=bde를 만든다. 두 결과가 공통 항 bcf에서 만나 adf=bcf=bde가 된다.', caption: '첫 식 ×f, 둘째 식 ×b → 공통 정수곱 bcf에서 연결 → adf=bcf=bde' } },
    { id: 'integer-cancellation', title: '0이 아닌 중간 분모를 소거해요', block: 3, from: 5, to: 6, cards: [], known: '중간 분모 조건을 사용한 정수 소거', figure: { src: '/content/number-systems/rational-representations/figure-integer-cancellation.svg', alt: '정수 등식 d(af−be)=0에서 영인수 성질로 d=0 또는 af−be=0 두 갈래가 나온다. 정의역 조건 d≠0이 첫 갈래만 제외한다. 남은 af−be=0에서 af=be를 얻으며 유리수 나눗셈은 사용하지 않는다.', caption: '정수의 영인수 성질: d=0 또는 af−be=0 · d≠0이 첫 갈래를 제외 → af=be' } },
    { id: 'proof-result', title: '양 끝 표기도 같은 묶음입니다', block: 3, from: 6, cards: [], known: '추이성 결론과 처음 연쇄의 완성', figure: { src: '/content/number-systems/rational-representations/figure-proof-result.svg', alt: '방금 얻은 af=be를 관계의 정의 (a,b)~(e,f)와 직접 대응시킨다. 같은 정의를 처음 연쇄에 적용하면 1×6=2×3이어서 1/2와 3/6의 바깥 연결이 완성된다.', caption: 'af=be ⇔ (a,b)~(e,f) · 정의로 돌아가 처음 목표 1×6=2×3을 완성' } },
    { id: 'zero-pair-links', title: '0/0은 모든 표기 사이에 끼어들어요', block: 4, from: 0, to: 2, cards: [], known: '모든 정수쌍으로 넓힌 관계에서 생기는 두 연결', figure: { src: '/content/number-systems/rational-representations/figure-zero-pair-counterexample.svg', alt: '세 노드 (1,1), (0,0), (1,2)가 유지된다. (1,1)과 (0,0)의 교차곱은 0=0이고, (0,0)과 (1,2)의 교차곱도 0=0이라 두 안쪽 연결은 유효하다. 그러나 양 끝의 교차곱은 2와 1로 달라 바깥 연결은 실패한다.', caption: '같은 세 노드 유지: 안쪽 0=0, 0=0은 유효 · 바깥 2≠1은 실패' } },
    { id: 'zero-pair-failure', title: '하지만 양 끝은 관계가 없어요', block: 4, from: 2, to: 4, cards: [], known: '0쌍이 만드는 구체적 추이성 반례', figure: { src: '/content/number-systems/rational-representations/figure-zero-pair-counterexample.svg', alt: '세 노드 (1,1), (0,0), (1,2)의 안쪽 두 관계는 모두 0=0으로 성립하지만 양 끝은 1×2=2와 1×1=1이 달라 관계가 없다. 따라서 참인 두 전제에서 거짓인 바깥 결론이 나와 이 확대 관계의 추이성이 실패한다.', caption: '(1,1)~(0,0), (0,0)~(1,2), 그러나 (1,1)≁(1,2): 정확한 추이성 반례' } },
    { id: 'counterexample-scope', title: '반례가 말하는 범위를 지켜요', block: 4, from: 4, cards: ['실패: 모든 Z² 위의 이 교차곱 관계', '주장하지 않음: 모든 확장 수 체계의 불가능'], known: '0쌍 반례의 정확한 적용 범위' },
    { id: 'transfer-checks', title: '새 연쇄의 두 교차곱', block: 5, from: 0, to: 2, cards: [], known: '새 정수쌍 연쇄의 관계 확인', figure: { src: '/content/number-systems/rational-representations/figure-transfer-chain.svg', alt: '새 연쇄 (2,3), (4,6), (10,15)에서 첫 안쪽 연결은 2×6=3×4=12, 둘째 연결은 4×15=6×10=60으로 확인된다. 가운데 쌍의 분모 6도 함께 표시된다.', caption: '새 연쇄의 안쪽 확인: 12=12 · 60=60' } },
    { id: 'transfer-result', title: '중간 분모도 확인해요', block: 5, from: 2, cards: [], known: '중간 분모 조건을 확인하는 추이성의 전이 적용', figure: { src: '/content/number-systems/rational-representations/figure-transfer-chain.svg', alt: '새 연쇄의 가운데 분모는 6으로 0이 아니다. 따라서 추이성을 적용할 수 있고, 양 끝의 독립 교차곱도 2×15=30과 3×10=30으로 일치하여 (2,3)과 (10,15)의 관계를 확인한다.', caption: '중간 분모 6≠0 · 추이성 적용 · 바깥 독립 확인 30=30' } },
  ],
} satisfies ContentPage;

export default page;
