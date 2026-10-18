import type {ContentPage} from '../../../packages/content/types.js';

export default {slug:'electron-evidence',articleId:'article:physics-discovery.electron-evidence.ko',label:'전자의 증거',category:'물리 · 발견',claimRefs:['claim:physics-discovery.electron-evidence.crossed-fields','claim:physics-discovery.electron-evidence.charge-mass-ratio','claim:physics-discovery.electron-evidence.repeatability'],scenes:[
  {id:'question',title:'음극선은 무엇이었을까요?',block:0,from:0,cards:['경쟁 설명 | 파동 현상','경쟁 설명 | 음전하 입자'],known:'관찰과 해석을 구별'},
  {id:'apparatus',title:'두 장을 반대로 걸었습니다',block:1,from:0,cards:['|q|E = |q|vB','직진 조건 | v=E/B','부호 | 편향 방향'],known:'교차 장의 통제'},
  {id:'ratio',title:'측정한 것은 질량이 아니라 비였습니다',block:2,from:0,cards:['|q|vB = mv²/r','|q|/m = v/(Br)','아직 모름 | |q|와 m 각각'],known:'측정량의 경계'},
  {id:'repeat',title:'기체와 방출 방법을 바꾸어도',block:3,from:0,cards:['바꿈 | 기체','바꿈 | 전자 방출 방법','보고 | 비슷한 e/m'],known:'반복 비교'},
  {id:'limit',title:'빔 자국은 직접 사진이 아닙니다',block:4,from:0,cards:['필요 | 장 보정','후속 | 독립 전하 측정','한계 | 원자 구조 전체'],known:'간접 측정의 한계'},
  {id:'transfer',title:'전기장 하나면 충분할까요?',block:5,from:0,cards:['알 수 있음 | 전하 부호','섞여 있음 | 속도와 휨','통제 | 자기장으로 직진'],known:'통제의 역할을 새 장치에 적용'}]} satisfies ContentPage;
