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
    {id: 'comparison', title: '방해를 줄이면 더 오래 갑니다', block: 1, from: 0, cards: ['통제 | 같은 물체 · 초기 속도 · 수평면', '거친 면 | 같은 시간에 더 큰 감속', '공기층 | 접촉 마찰 크게 감소'], known: '조건을 바꾼 비교 관찰'},
    {id: 'inference', title: '힘은 속도가 아니라 속도 변화를 만듭니다', block: 2, from: 0, cards: ['ΣF외력 = 0', 'v = 일정', '정지와 등속 직선 운동'], known: '알짜 외력과 속도 변화의 관계'},
    {id: 'frame', title: '어디에서 보느냐도 조건입니다', block: 3, from: 0, cards: ['관성 기준계 | 제1법칙 성립', '가속 기준계 | 그대로 적용 불가'], known: '기준계의 가속 여부'},
    {id: 'limit', title: '관찰과 이상화를 나눠 말하면', block: 4, from: 0, cards: ['관찰 | 마찰 감소 → 감속 감소', '이상화 | 저항 0 → 속도 일정', '주의 | 알짜 힘 0 ≠ 힘 없음'], known: '증거가 직접 보인 것과 추론한 한계'},
    {id: 'transfer', title: '일정한 속도의 자동차에는 힘이 없을까요?', block: 5, from: 0, cards: ['수평 | 추진력 = 저항력', '수직 | 지지력 = 중력', '조건 | 관성 기준계에서 합이 0'], known: '상쇄되는 힘을 새 상황에 적용'},
  ],
} satisfies ContentPage;
