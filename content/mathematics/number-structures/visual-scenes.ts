import type {Scene} from '../../../packages/content/types.js';

const figures:Readonly<Record<string,readonly [string,string,string]>>={
  question:['figure-choices.svg','이전 수로 답을 적을 수 없는 네 질문','막힌 문제와 지킬 규칙을 함께 고릅니다.'],
  integers:['figure-undo.svg','2에서 다섯 칸 왼쪽으로 가서 −3에 도착','더하기를 되돌리는 −5를 더합니다.'],
  rationals:['figure-fractions.svg','1/2와 2/4가 같은 양을 나타내는 막대','나누는 방법이 바뀌어도 같은 절반입니다.'],
  diagonal:['figure-diagonal.svg','정사각형의 대각선과 약분된 분수의 짝홀수 모순','정확한 길이와 분수로 쓸 수 있는지는 다른 질문입니다.'],
  'real-completion':['figure-boundary.svg','0과 1 사이 수들의 최소 상한 1은 집합 밖','가장 낮은 천장은 가장 큰 원소와 다를 수 있습니다.'],
  rotation:['figure-rotation.svg','곱하기 i가 (2,−1)을 (1,2)로 돌리고 길이를 보존','좌표의 회전과 곱셈 규칙을 같이 보세요.'],
  payoff:['figure-choices.svg','연산과 방정식에서 서로 다른 확장을 선택하는 질문들','다음 체계는 해결할 질문과 보존할 규칙으로 정합니다.'],
  'cut-definition-order':['figure-cut-overview.svg','절단 집합부터 순서와 연산을 보존하는 대응까지의 증명 의존 관계','전체 흐름 안내이며 각 화살표의 논증은 선택 증명에서 전개합니다.'],
};
const motions:Readonly<Record<string,string>>={integers:'numbers-inverse',rationals:'numbers-fractions',rotation:'numbers-rotation'};
export function numberVisual(scene:Scene):Scene{
  const figure=figures[scene.id],motion=motions[scene.id];
  return {...scene,...(figure?{cards:[],figure:{src:`/content/mathematics/number-structures/${figure[0]}`,alt:figure[1],caption:figure[2]}}:{}),...(motion?{motion:{id:motion}}:{})};
}
