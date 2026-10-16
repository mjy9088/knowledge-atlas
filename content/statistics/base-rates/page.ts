import type {ContentPage} from '../../../packages/content/types.js';
export default {
  slug:'base-rates',articleId:'article:statistics.base-rates.ko',label:'경보와 조건부확률',category:'통계 · 자료 해석',interactive:'base-rates',styles:['/topics/statistics/base-rates.css'],
  claimRefs:['claim:statistics.base-rates.conditional','claim:statistics.base-rates.reverse','claim:statistics.base-rates.bayes','claim:statistics.base-rates.fixture'],
  scenes:[
    {id:'question',title:'경보를 믿어도 될까요?',block:0,from:0,cards:[],known:'경보 확률과 불량 확률의 구별',suggestion:{example:'question'}},
    {id:'predict',title:'절반 이상일까요?',block:1,from:0,cards:[],known:'경보가 난 집합을 비교할 준비',suggestion:{example:'predict'}},
    {id:'observe',title:'정상에서 난 경보도 셉니다',block:2,from:0,cards:[],known:'경보와 실제 상태의 2×2 표',suggestion:{example:'observe'}},
    {id:'denominator',title:'분모는 경보가 난 제품 전체',block:3,from:0,cards:[],known:'조건에 맞춰 분모를 고르는 방법',suggestion:{example:'denominator'}},
    {id:'common',title:'같은 검사기, 다른 불량 비율',block:4,from:0,cards:[],known:'기저 비율이 해석에 미치는 영향',suggestion:{example:'common'}},
    {id:'transfer',title:'오경보를 줄이면 어떤 칸이 줄까요?',block:5,from:0,cards:[],known:'새 조건에서 분모와 변화 방향 설명',suggestion:{example:'transfer'}},
  ],
} satisfies ContentPage;
