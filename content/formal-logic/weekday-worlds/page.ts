import type {ContentPage} from '../../../packages/content/types.js';
export default {
  coverArtwork:{src:'/content/formal-logic/weekday-worlds/cover.svg',alt:'IQ 좀 높다면 도전! 20초. 어제가 내일이었으면 좋겠다. 그럼 오늘이 금요일일 텐데… 그렇다면 오늘은 무슨 요일일까? ① 수요일 ② 목요일 ③ 금요일 ④ 일요일'},
  slug:'weekday-worlds',articleId:'article:logic.weekday-worlds.ko',label:'요일 수수께끼',category:'논리 · 언어',interactive:'weekday-worlds',cover:true,styles:['/components/worlds/comparison.css','/components/alignment/semantic-alignment.css','/topics/formal-reasoning/weekday-worlds.css'],
  claimRefs:['claim:logic.weekday-worlds.modal-introduction','claim:logic.weekday-worlds.context','claim:logic.weekday-worlds.rules','claim:logic.weekday-worlds.literal','claim:logic.weekday-worlds.explosion','claim:logic.explosion.rule','claim:logic.explosion.not-reality','claim:logic.weekday-worlds.assessment','claim:logic.weekday-worlds.assignments','claim:logic.weekday-worlds.notation','claim:logic.weekday-worlds.conditional-reading','claim:logic.weekday-worlds.deduced-modality','claim:logic.weekday-worlds.inference-rules','claim:logic.weekday-worlds.multiverse'],
  scenes:[
    {id:'question',title:'20초, 일단 풀어 볼까요?',block:0,from:0,cards:[],known:'문제와 첫 추측',suggestion:{example:'question'}},
    {id:'conditional',title:'풀기 쉽게 문장을 줄여 봅시다',block:9,from:0,cards:[],known:'설명용 조건문 단순화',suggestion:{example:'conditional'}},
    {id:'sunday',title:'일요일! 이렇게 풀었나요?',block:2,from:0,cards:[],known:'현실 어제와 가정 내일의 대응',suggestion:{example:'sunday'}},
    {id:'wednesday',title:'그런데 수요일도 나온다고요?',block:3,from:0,cards:[],known:'다른 기준의 요일 계산',suggestion:{example:'wednesday'}},
    {id:'notation',title:'먼저 기호로 줄여 보면',block:7,from:0,cards:[],known:'조건문 A → B',suggestion:{example:'notation'}},
    {id:'inference',title:'여기서 쓴 추론 규칙은?',block:10,from:0,cards:[],known:'고전 논리의 전건 긍정',suggestion:{example:'inference'}},
    {id:'contexts',title:'방금 오간 그 상황: 가능세계',block:1,from:0,cards:[],known:'가능세계라는 상황 비교',suggestion:{example:'contexts'}},
    {id:'modal-comparison',title:'참이다 vs 가능하다 vs 필연적이다',block:11,from:0,cards:[],known:'P와 ◇P, □P의 비교',suggestion:{example:'modal-comparison'}},
    {id:'alethic',title:'◇와 □를 이 문제에 써 보면',block:8,from:0,cards:[],known:'요일 명제의 가능성과 필연성',suggestion:{example:'alethic'}},
    {id:'modal-rules',title:'양상 논리는 어떻게 추론할까?',block:12,from:0,cards:[],known:'K 공리, 필연화, 체계에 따른 조건',suggestion:{example:'modal-rules'}},
    {id:'transfer',title:'목표가 월요일이라면?',block:5,from:0,cards:[],known:'가정을 바꾼 요일 계산',suggestion:{example:'transfer'}},
    {id:'literal',title:'가정도 없이 같다고 우기면?',block:4,from:0,cards:[],known:'모순 폭발로 이어지는 짧은 곁가지',suggestion:{example:'literal'}},
    {id:'conclusion',title:'IQ 대신 ‘만약’을 챙겨 갑시다',block:6,from:0,cards:[],known:'가능세계와 양상 논리의 첫 만남',suggestion:{example:'conclusion'}},
  ],
} satisfies ContentPage;
