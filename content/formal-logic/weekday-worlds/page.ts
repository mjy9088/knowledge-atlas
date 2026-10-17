import type {ContentPage} from '../../../packages/content/types.js';
export default {
  coverArtwork:{src:'/content/formal-logic/weekday-worlds/cover.svg',alt:'IQ 좀 높다면 도전! 20초. 어제가 내일이었으면 좋겠다. 그럼 오늘이 금요일일 텐데… 그렇다면 오늘은 무슨 요일일까? ① 수요일 ② 목요일 ③ 금요일 ④ 일요일'},
  slug:'weekday-worlds',articleId:'article:logic.weekday-worlds.ko',label:'수수께끼로 만나는 양상 논리',category:'논리 · 언어',interactive:'weekday-worlds',cover:true,styles:['/components/worlds/comparison.css','/components/alignment/semantic-alignment.css','/topics/formal-reasoning/weekday-worlds.css'],
  claimRefs:['claim:logic.weekday-worlds.modal-introduction','claim:logic.weekday-worlds.context','claim:logic.weekday-worlds.rules','claim:logic.weekday-worlds.literal','claim:logic.weekday-worlds.explosion','claim:logic.explosion.rule','claim:logic.explosion.not-reality','claim:logic.weekday-worlds.assessment','claim:logic.weekday-worlds.assignments','claim:logic.weekday-worlds.notation','claim:logic.weekday-worlds.conditional-reading','claim:logic.weekday-worlds.modal-translation','claim:logic.weekday-worlds.multiverse'],
  scenes:[
    {id:'question',title:'20초, 일단 풀어 볼까요?',block:0,from:0,cards:[],known:'문제와 첫 추측',suggestion:{example:'question'}},
    {id:'sunday',title:'일요일! 이렇게 풀었나요?',block:2,from:0,cards:[],known:'현실 어제와 가정 내일의 대응',suggestion:{example:'sunday'}},
    {id:'wednesday',title:'그런데 수요일도 나온다고요?',block:3,from:0,cards:[],known:'다른 기준의 요일 계산',suggestion:{example:'wednesday'}},
    {id:'contexts',title:'방금 오간 그 상황: 가능세계',block:1,from:0,cards:[],known:'가능세계라는 상황 비교',suggestion:{example:'contexts'}},
    {id:'notation',title:'‘만약’까지 다루는 논리',block:7,from:0,cards:[],known:'양상 논리와 두 조건문 읽기',suggestion:{example:'notation'}},
    {id:'alethic',title:'‘그랬더라면’을 살려 읽기',block:8,from:0,cards:[],known:'반사실과 바람의 구별',suggestion:{example:'alethic'}},
    {id:'transfer',title:'그럼 월요일이었을 텐데?',block:5,from:0,cards:[],known:'가정을 바꾼 요일 계산',suggestion:{example:'transfer'}},
    {id:'literal',title:'가정도 없이 같다고 우기면?',block:4,from:0,cards:[],known:'모순 폭발로 이어지는 짧은 곁가지',suggestion:{example:'literal'}},
    {id:'conclusion',title:'IQ 대신 ‘만약’을 챙겨 갑시다',block:6,from:0,cards:[],known:'가능세계와 양상 논리의 첫 만남',suggestion:{example:'conclusion'}},
  ],
} satisfies ContentPage;
