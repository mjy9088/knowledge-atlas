import type { ContentPage } from '../../../packages/content/types.js';

const page = {
  slug: 'complex-numbers',
  articleId: 'article:number-systems.complex-numbers.ko',
  label: '복소수 곱셈과 회전',
  category: '수학 · 수 체계',
  model: null,
  claimRefs: [
    'claim:number-systems.complex.definition',
    'claim:number-systems.complex.i-square',
    'claim:number-systems.complex.rotation',
    'claim:number-systems.complex.not-ordered-field',
  ],
  scenes: [
    { id: 'question', title: 'x²=-1은 어디서 풀릴까요?', block: 0, from: 0, cards: ['실수 x: x²≥0', '새 목표: i²=-1'], known: '실수에서 풀리지 않는 방정식이 만드는 확장 문제' },
    { id: 'definition', title: '복소수는 실수쌍입니다', block: 1, from: 0, cards: ['a+bi ↔ (a,b)', '(a,b)(c,d)=(ac-bd, ad+bc)', 'a∈R ↔ (a,0)'], known: '복소수의 실수쌍 표현과 연산' },
    { id: 'i-square', title: '정의에서 i²=-1이 나옵니다', block: 2, from: 0, cards: ['i=(0,1)', 'i²=(-1,0)=-1', '(1+i)(1-i)=2'], known: 'i의 제곱과 분배법칙 계산' },
    { id: 'rotation', title: 'i를 곱하면 90도 회전', block: 3, from: 0, cards: ['a+bi → -b+ai', 'z=0은 고정', 'z≠0: 길이 유지 · 각도 +90° (mod 360°)'], known: '0의 고정과 0이 아닌 복소수 곱셈의 기하학적 의미', figure: { src: '/content/number-systems/complex-numbers/figure-i-rotation.svg', alt: '복소평면에서 0이 아닌 벡터 z가 i를 곱한 뒤 반시계 방향으로 90도 회전하여 iz가 되는 모습. 각도는 360도를 한 바퀴로 보며, z의 좌표는 a,b이고 iz의 좌표는 -b,a이다.', caption: 'i 곱셈: 0은 고정 · z≠0이면 길이 유지, 각도 +90° (mod 360°)' } },
    { id: 'order', title: '복소수는 실수처럼 줄 세울 수 없어요', block: 4, from: 0, cards: ['i²=-1 ⇒ i≠0', '삼분법: i>0 또는 -i>0', '-1>0은 1>0과 충돌'], known: '복소수와 순서체의 정확한 구별' },
    { id: 'transfer', title: '2-i를 실제로 돌려요', block: 5, from: 0, cards: ['i(2-i)=1+2i', '(2,-1) → (1,2)', '두 길이: √5'], known: '새 좌표에 회전 규칙을 적용하고 검산하기' },
  ],
} satisfies ContentPage;

export default page;
