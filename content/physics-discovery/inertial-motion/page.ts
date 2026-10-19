import type {ContentPage} from '../../../packages/content/types.js';

export default {
  slug: 'inertial-motion',
  articleId: 'article:physics-discovery.inertial-motion.ko',
  label: '관성 운동',
  category: '물리 · 발견',
  claimRefs: [
    'claim:physics-discovery.inertial-motion.friction-evidence',
    'claim:physics-discovery.inertial-motion.first-law',
    'claim:physics-discovery.inertial-motion.frame-limit',
  ],
  scenes: [
    {id: 'question', title: '멈추는 게 자연스러운 걸까요?', block: 0, from: 0, cards: ['질문 | 운동을 유지하는 힘이 필요한가?', '구별 | 움직임 vs 움직임의 변화'], known: '일상에서 물체가 멈춘다는 경험'},
    {id: 'comparison', title: '방해를 줄이면 더 오래 갑니다', block: 1, from: 0, cards: [], known: '조건을 바꾼 비교 관찰', figure: {src: '/content/physics-discovery/inertial-motion/figure-resistance-comparison.svg', alt: '같은 물체, 시작점, 초기 속도, 수평, 같은 시간 간격과 비슷한 공기 조건을 유지하고 접촉 저항만 바꾼 세 줄의 정성 비교. 거친 면은 위치 간격이 가장 빠르게 줄고, 매끈한 면은 덜 줄며, 공기 지지면은 가장 조금 줄어 같은 시간 뒤 가장 멀리 간다. 간격은 설명용이며 측정값이나 축척 예측이 아니고 무마찰을 관찰한 것도 아니다.', caption: '저항만 변경 · 같은 시작·첫 간격·Δt · 거친 면→매끈한 면→공기\u00a0지지면 순으로 감속 감소 · 정성도(측정값·무마찰\u00a0관찰\u00a0아님)'}},
    {id: 'inference', title: '알짜 외력은 속도 변화를 만듭니다', block: 2, from: 0, cards: [], known: '알짜 외력과 속도 변화의 관계', figure: {src: '/content/physics-discovery/inertial-motion/figure-net-force-velocity.svg', alt: '알짜 외력 0인 두 경우. 정지 물체와 오른쪽 등속 직선 운동 물체 모두 왼쪽과 오른쪽의 같은 크기 외력이 반대 방향으로 작용한다. 정지 위치 표시는 한곳에 겹치고 등속 운동 위치 표시는 같은 시간마다 같은 간격이다. 알짜 힘 0은 힘이 없다는 뜻이 아니다.', caption: '같은 ΣF외력=0: v=0 정지 또는 v≠0 등속 직선 운동 · 두\u00a0경우\u00a0모두\u00a0외력이\u00a0상쇄됨'}},
    {id: 'frame', title: '같은 운동도 좌표 차이는 달라집니다', block: 3, from: 0, cards: [], known: '관성계와 가속계의 좌표 비교', figure: {src: '/content/physics-discovery/inertial-motion/figure-braking-frames.svg', alt: '직접 만든 이상화에서 물체와 버스 원점이 지면 기준 초속 4미터로 함께 출발한 뒤 t=0, 1, 2초의 같은 순간을 비교한다. 공통 거리 축에서 수평 알짜 외력이 0인 물체의 지면 위치 x는 0, 4, 8미터이고 제동하는 버스 원점 X는 0, 3, 4미터다. 뺄셈 x′=x−X로 얻은 버스 기준 위치는 0, 1, 4미터다. 지면 구간 이동 4, 4미터는 일정하지만 버스 기준 구간 이동 1, 3미터는 늘어난다. 이는 앞쪽 힘이 새로 생겼다는 뜻이 아니라 버스 기준이 가속하기 때문이다. 지면은 관성계로 근사하고 수직 힘은 상쇄하며 공기 저항, 물체의 수평 접촉력과 끝 충돌을 무시한다. 측정 자료나 서 있는 승객 모형이 아니다.', caption: '직접 만든 이상화 · 함께 출발: 4\u00a0m/s · 같은 t=0,1,2\u00a0s · x: 0→4→8\u00a0m, X: 0→3→4\u00a0m · x′=x−X: 0→1→4\u00a0m · 앞쪽\u00a0힘이\u00a0생긴\u00a0것이\u00a0아님'}},
    {id: 'limit', title: '관찰과 이상화를 나눠 말하면', block: 4, from: 0, cards: ['관찰 | 마찰 감소 → 감속 감소', '이상화 | 저항 0 → 속도 일정', '주의 | 알짜 힘 0 ≠ 힘 없음'], known: '증거가 직접 보인 것과 추론한 한계'},
    {id: 'transfer', title: '일정한 속도의 자동차에는 힘이 없을까요?', block: 5, from: 0, cards: [], known: '상쇄되는 힘을 새 상황에 적용', figure: {src: '/content/physics-discovery/inertial-motion/figure-car-force-balance.svg', alt: '수평 직선 도로를 관성 기준계로 근사한 자동차 자유물체도. 오른쪽 추진력과 왼쪽 저항력, 위쪽 지지력과 아래쪽 중력이 각각 같은 크기로 반대 방향을 향한다. 별도의 오른쪽 화살표는 고정 방향의 일정한 속도이며 힘이 아니다. 네 힘의 합이 0이라는 조건을 그렸고 속도만으로 힘을 추론하지 않는다.', caption: '조건: 추진력↔저항력, 지지력↔중력 · 속도\u00a0화살표는 힘이 아님 · 힘의\u00a0균형은\u00a0먼저\u00a0둔\u00a0조건'}},
  ],
} satisfies ContentPage;
