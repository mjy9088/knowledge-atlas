import type {Scene} from '../../../packages/content/types.js';

const directory='/content/physics/newton-to-quantum/';
export const historyScenes:Scene[]=[
  {id:'electron-1897',title:'1897 · 원자보다 작은 음전하의 단서',block:25,from:0,cards:[],known:'음극선의 공통 성질과 전하 대 질량비를 구별',figure:{src:'/content/physics-discovery/electron-evidence/figure-crossed-fields.svg',alt:'음극선의 전기장과 자기장 힘을 비교하는 모형',caption:'장치와 힘의 개념도 · 궤적 사진 아님'}},
  {id:'proton-1919',title:'1917–1919 · 질소에서 나온 수소 핵',block:26,from:0,cards:[],known:'핵의 존재와 핵의 구성요소 추론은 다름',figure:{src:directory+'figure-nuclear-constituents.svg',alt:'질소 알파 충돌의 수소 핵 검출과 중성 복사의 반동을 구별',caption:'서로 다른 실험의 개념 비교 · 반응 경로의 직접 사진 아님'}},
  {id:'neutron-1932',title:'1932 · 보이지 않는 입자를 반동으로 찾기',block:27,from:0,cards:[],known:'중성 복사와 반동 비교로 중성자를 추론',figure:{src:directory+'figure-nuclear-constituents.svg',alt:'베릴륨 복사가 다른 물질의 핵을 밀어낸 반동을 비교',caption:'보이는 것은 표적의 반동 · 중성자 자체의 사진 아님'}},
];
const figures:Readonly<Record<string,readonly [string,string,string]>>={
  question:['figure-history-question.svg','운동의 예측에서 원자 내부와 빛의 색에 대한 질문으로','관찰과 모형이 바뀌는 장면들을 따라갑니다.'],
  newton:['figure-prediction.svg','알짜 힘이 없을 때 같은 시간마다 같은 이동','계산과 위치 비교 · 마찰과 저항을 제외한 예시'],
  'nuclear-atom':['figure-scattering.svg','대부분 통과와 드문 큰각 산란을 비교','원본 개념도 · 실제 궤적, 크기, 사건 비율 자료 아님'],
  bohr:['figure-energy-ladder.svg','수소 에너지 −1.51 eV와 −3.40 eV의 차이','공간 궤적이 아닌 에너지 도식 · 선택된 수소 선 계산'],
  'light-and-heat':['figure-thermal-comparison.svg','같은 온도에서 관측된 감소와 고전적 고주파 증가의 정성 비교','정성 비교 · 측정값이 아니며 플랑크 자신의 해석과도 구별'],
  'matter-waves':['figure-amplitudes.svg','진폭 1+1과 1−1의 합을 제곱해 상대 가중치 4와 0을 비교','설명용 비정규화 값 · 실제 입자 궤적이나 확률 4가 아님'],
  payoff:['figure-history-question.svg','서로 다른 운동과 원자 관찰이 설명을 바꾸는 질문들','발견은 한 줄의 필연적 사다리가 아니었습니다.'],
};
const motions:Readonly<Record<string,string>>={newton:'physics-prediction','nuclear-atom':'physics-scattering',bohr:'physics-energy'};
export function historyVisual(scene:Scene):Scene{
  const figure=figures[scene.id],motion=motions[scene.id];
  return {...scene,...(figure?{figure:{src:directory+figure[0],alt:figure[1],caption:figure[2]}}:{}),...(motion?{motion:{id:motion}}:{})};
}
