import type {Scene} from '../../../packages/content/types.js';

const directory='/content/physics/newton-to-quantum/';
export const historyScenes:Scene[]=[
  {id:'electron-1897',title:'1897 · 원자보다 작은 음전하의 단서',block:25,from:0,cards:[],known:'음극선의 공통 성질과 전하 대 질량비를 구별',figure:{src:directory+'figure-discharge-tube.svg',alt:'방전관의 음극에서 나온 빔과 전기장에서 휘는 방향을 검출 화면으로 비교하는 개념도',caption:'장치와 힘의 개념도 · 전하와 질량을 각각 잰 결과는 아님'}},
  {id:'proton-1919',title:'1917–1919 · 질소에서 나온 수소 핵',block:26,from:0,cards:[],known:'핵의 존재와 핵의 구성요소 추론은 다름',figure:{src:directory+'figure-nuclear-constituents.svg',alt:'질소 알파 충돌의 수소 핵 검출과 중성 복사의 반동을 구별',caption:'서로 다른 실험의 개념 비교 · 반응 경로의 직접 사진 아님'}},
  {id:'neutron-1932',title:'1932 · 보이지 않는 입자를 반동으로 찾기',block:27,from:0,cards:[],known:'중성 복사와 반동 비교로 중성자를 추론',figure:{src:directory+'figure-recoil-comparison.svg',alt:'입사체 속도가 같은 정면 탄성충돌 모형에서 수소 핵과 무거운 핵의 반동을 비교',caption:'설명용 반동 모형 · 중성자 궤적이나 역사적 측정값 도표 아님'}},
];
const figures:Readonly<Record<string,readonly [string,string,string]>>={
  question:['figure-history-question.svg','운동의 예측에서 원자 내부와 빛의 색에 대한 질문으로','관찰과 모형이 바뀌는 장면들을 따라갑니다.'],
  newton:['figure-prediction.svg','알짜 힘이 없을 때 같은 시간마다 같은 이동','계산과 위치 비교 · 마찰과 저항을 제외한 예시'],
  'nuclear-atom':['figure-scattering.svg','대부분 통과와 드문 큰각 산란을 비교','원본 개념도 · 실제 궤적, 크기, 사건 비율 자료 아님'],
  bohr:['figure-energy-ladder.svg','수소 에너지 −1.51 eV와 −3.40 eV의 차이','공간 궤적이 아닌 에너지 도식 · 선택된 수소 선 계산'],
  'light-and-heat':['figure-cavity-spectrum.svg','공동 속 진동 무늬에서 고전적 평균 에너지 가정과 관측 스펙트럼을 연결하는 정성 도식','정성 비교 · 측정값이 아니며 플랑크 자신의 해석과도 구별'],
  'matter-waves':['figure-amplitudes.svg','진폭 1+1과 1−1의 합을 제곱해 상대 가중치 4와 0을 비교','설명용 비정규화 값 · 실제 입자 궤적이나 확률 4가 아님'],
  'spectral-lines':['figure-selected-lines.svg','수소의 선택한 공기 중 선 파장 410.2, 434.0, 486.1, 656.3 nm의 위치','선택한 선의 위치만 비교 · 전체 스펙트럼이나 밝기 자료 아님'],
  payoff:['figure-history-question.svg','서로 다른 운동과 원자 관찰이 설명을 바꾸는 질문들','발견은 한 줄의 필연적 사다리가 아니었습니다.'],
};
const motions:Readonly<Record<string,string>>={newton:'physics-prediction','nuclear-atom':'physics-scattering',bohr:'physics-energy'};
export function historyVisual(scene:Scene):Scene{
  const figure=figures[scene.id],motion=motions[scene.id];
  return {...scene,...(figure?{cards:[],figure:{src:directory+figure[0],alt:figure[1],caption:figure[2]}}:{}),...(motion?{motion:{id:motion}}:{})};
}
