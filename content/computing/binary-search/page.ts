import type {ContentPage} from '../../../packages/content/types.js';
export default {
  slug:'binary-search',articleId:'article:computing.binary-search.ko',label:'이진 탐색',category:'컴퓨팅 · 알고리즘',interactive:'binary-search',styles:['/topics/computing/binary-search.css'],
  claimRefs:['claim:computing.binary-search.elimination','claim:computing.binary-search.bound','claim:computing.binary-search.absence'],
  scenes:[
    {id:'question',title:'1,000번보다 적게 찾을 수 있을까요?',block:0,from:0,cards:[],known:'정렬된 목록과 비교 횟수라는 질문',suggestion:{example:'thousand'}},
    {id:'observe',title:'한 번 비교하면 무엇을 지울 수 있나요?',block:1,from:0,cards:[],known:'정렬을 근거로 한쪽 후보 제외',suggestion:{example:'observe'}},
    {id:'explain',title:'남은 구간에서 같은 일을 반복해요',block:2,from:0,cards:[],known:'이진 탐색의 반복과 발견 종료',suggestion:{example:'observe'}},
    {id:'double',title:'목록이 두 배면 비교도 두 배일까요?',block:3,from:0,cards:[],known:'목록 크기와 최악의 비교 횟수',suggestion:{example:'double'}},
    {id:'missing',title:'없는 값은 어떻게 확인할까요?',block:4,from:0,cards:[],known:'후보 구간이 비었을 때의 부재 판정',suggestion:{example:'missing'}},
    {id:'transfer',title:'이 방법을 쓰려면 무엇이 필요할까요?',block:5,from:0,cards:[],known:'정렬 조건과 비교 횟수의 적용 범위',suggestion:{example:'transfer'}}
  ]
} satisfies ContentPage;
