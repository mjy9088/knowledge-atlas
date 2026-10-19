import type { ContentPage } from '../../../packages/content/types.js';

const page = {
  slug: 'complex-numbers',
  articleId: 'article:number-systems.complex-numbers.ko',
  label: '복소수 곱셈과 회전',
  category: '수학 · 수 체계',
  model: null,
  styles: ['/topics/number-systems/complex-numbers.css'],
  claimRefs: [
    'claim:number-systems.complex.definition',
    'claim:number-systems.complex.i-square',
    'claim:number-systems.complex.rotation',
    'claim:number-systems.complex.not-ordered-field',
  ],
  scenes: [
    { id: 'question', title: 'x²=-1은 어디서 풀릴까요?', block: 0, from: 0, cards: ['실수 x: x²≥0', '새 목표: i²=-1'], known: '실수에서 풀리지 않는 방정식이 만드는 확장 문제' },
    { id: 'definition', title: '복소수는 실수쌍입니다', block: 1, from: 0, cards: ['(a,b)(c,d)=(ac-bd, ad+bc)', '(1,1)(1,-1)=(2,0)', '(a,0)(c,0)=(ac,0)'], known: '복소수의 실수쌍 표현과 연산' },
    { id: 'i-square', title: '정의에서 i²=-1이 나옵니다', block: 2, from: 0, cards: ['(0,1)²=(0·0-1·1, 0·1+1·0)', '=(-1,0)=-1', '(1,1)(1,-1)=(2,0)=2'], known: 'i의 제곱과 분배법칙 계산' },
    { id: 'rotation', title: 'i를 곱하면 90도 회전', block: 3, from: 0, cards: ['a+bi → -b+ai', 'z=0은 고정', 'z≠0: 길이 유지 · 각도 +90° (mod 360°)'], known: '0의 고정과 0이 아닌 복소수 곱셈의 기하학적 의미', figure: { src: '/content/number-systems/complex-numbers/figure-i-rotation.svg', alt: '복소평면에서 0이 아닌 벡터 z가 i를 곱한 뒤 반시계 방향으로 90도 회전하여 iz가 되는 모습. 각도는 360도를 한 바퀴로 보며, z의 좌표는 a,b이고 iz의 좌표는 -b,a이다.', caption: 'i 곱셈: 0은 고정 · z≠0이면 길이 유지, 각도 +90° (mod 360°)' } },
    { id: 'order', title: '어떤 순서체 전순서도 실수 순서를 확장하지 못해요', block: 4, from: 0, cards: [], known: '복소수와 순서체의 정확한 구별', figure: { src: '/content/number-systems/complex-numbers/figure-order-contradiction.svg', alt: '복소수에 실수의 표준 순서를 확장하는 순서체 전순서가 있다고 가정한다. i 제곱이 -1이므로 i는 0이 아니고, 삼분법은 i가 양수인 가지와 -i가 양수인 가지로 나뉜다. 두 가지 모두 양수의 곱 규칙으로 -1이 양수라는 결론을 내어, 실수 순서의 -1은 0보다 작다는 사실과 모순된다.', caption: '가정: 실수 순서를 확장하는 순서체 전순서 · 두 삼분법 가지 모두 -1>0을 만들어 -1<0과 모순' } },
    { id: 'transfer', title: '2-i를 실제로 돌려요', block: 5, from: 0, cards: [], known: '새 좌표에 회전 규칙을 적용하고 검산하기', figure: { src: '/content/number-systems/complex-numbers/figure-transfer-rotation.svg', alt: '하나의 같은 눈금 복소평면에서 원점부터 (2,-1)까지의 벡터가 i를 곱한 뒤 원점부터 (1,2)까지의 벡터로 반시계 90도 회전한다. 두 벡터의 제곱 길이는 각각 2의 제곱 더하기 -1의 제곱과 1의 제곱 더하기 2의 제곱으로 모두 5이다.', caption: 'i(2-i)=1+2i · 같은 눈금에서 (2,-1)→(1,2) · 두 제곱 길이는 5' } },
  ],
} satisfies ContentPage;

export default page;
