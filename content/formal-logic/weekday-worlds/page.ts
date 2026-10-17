import type {ContentPage} from '../../../packages/content/types.js';
export default {
  thumbnail:{src:'/content/formal-logic/weekday-worlds/thumbnail.svg',coverSrc:'/content/formal-logic/weekday-worlds/thumbnail.svg#question',alt:'어제가 내일이었으면 좋겠다는 요일 문제. 수요일·목요일·금요일·일요일의 네 보기를 비교하는 표지'},
  slug:'weekday-worlds',articleId:'article:logic.weekday-worlds.ko',label:'가능세계와 숨은 기준',category:'논리 · 언어',interactive:'weekday-worlds',cover:true,styles:['/components/worlds/comparison.css','/components/alignment/semantic-alignment.css','/topics/formal-reasoning/weekday-worlds.css'],
  claimRefs:['claim:logic.weekday-worlds.context','claim:logic.weekday-worlds.rules','claim:logic.weekday-worlds.literal','claim:logic.weekday-worlds.explosion','claim:logic.explosion.rule','claim:logic.explosion.not-reality','claim:logic.weekday-worlds.assessment','claim:logic.weekday-worlds.assignments','claim:logic.weekday-worlds.notation','claim:logic.weekday-worlds.conditional-reading','claim:logic.weekday-worlds.modal-translation','claim:logic.weekday-worlds.multiverse'],
  scenes:[
    {id:'question',title:'답보다 먼저, 어떤 기준인가요?',block:0,from:0,cards:[],known:'단일 정답에 필요한 해석 조건',suggestion:{example:'question'}},
    {id:'contexts',title:'가능세계에도 기준이 필요합니다',block:1,from:0,cards:[],known:'세계와 지시어 기준의 구별',suggestion:{example:'contexts'}},
    {id:'sunday',title:'A · 일요일은 어떻게 나오나요?',block:2,from:0,cards:[],known:'현실 어제와 가정 내일의 대응',suggestion:{example:'sunday'}},
    {id:'wednesday',title:'B · 수요일은 다른 조건입니다',block:3,from:0,cards:[],known:'가정 어제와 현실 내일의 대응',suggestion:{example:'wednesday'}},
    {id:'literal',title:'한 기준에서 같다고 하면?',block:4,from:0,cards:[],known:'조건 불가능과 기준 변경의 구별',suggestion:{example:'literal'}},
    {id:'transfer',title:'금요일 대신 월요일이라면?',block:5,from:0,cards:[],known:'목표 요일을 바꾼 조건부 추론',suggestion:{example:'transfer'}},
    {id:'notation',title:'식으로 옮기고 해를 비교합니다',block:7,from:0,cards:[],known:'달력 제약 Γ와 단일한 답 추출',suggestion:{example:'notation'}},
    {id:'alethic',title:'바람과 반사실을 기호로 옮기면?',block:8,from:0,cards:[],known:'바람 표기와 반사실 조건문의 번역 범위',suggestion:{example:'alethic'}},
    {id:'conclusion',title:'판정의 근거가 충분한가요?',block:6,from:0,cards:[],known:'해석 명시와 문해력 판정의 한계',suggestion:{example:'conclusion'}},
  ],
} satisfies ContentPage;
