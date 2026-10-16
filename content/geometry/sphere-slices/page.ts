import type {ContentPage} from '../../../packages/content/types.js';
export default {
  slug:'sphere-slices',articleId:'article:geometry.sphere-slices.ko',label:'공의 단면',category:'기하학',interactive:'sphere-slices',
  styles:['/topics/geometry/sphere-slices.css'],
  claimRefs:['claim:geometry.slices.section','claim:geometry.slices.radius','claim:geometry.slices.symmetry','claim:geometry.slices.boundary'],
  scenes:[
    {id:'question',title:'어디를 잘라야 가장 클까요?',block:0,from:0,cards:[],known:'구의 옆 단면과 절단면의 구별',suggestion:{example:'center'}},
    {id:'predict',title:'조금 위에서 자른다면?',block:1,from:0,cards:[],known:'R과 h의 의미와 단면 변화',suggestion:{example:'predict'}},
    {id:'explain',title:'숨어 있는 직각삼각형',block:2,from:0,cards:[],known:'단면 반지름 r²=R²−h²의 이유',suggestion:{example:'triangle'}},
    {id:'mirror',title:'위아래를 바꾸면?',block:3,from:0,cards:[],known:'h와 −h에서 같은 단면 크기',suggestion:{example:'mirror'}},
    {id:'boundary',title:'한 점과 아무것도 없는 곳',block:4,from:0,cards:[],known:'접하는 평면과 구 바깥 평면의 구별',suggestion:{example:'outside'}},
    {id:'transfer',title:'원판 하나로 구를 알 수 있을까요?',block:5,from:0,cards:[],known:'단면 크기에 대한 R과 h의 의존성',suggestion:{example:'transfer'}},
  ],
} satisfies ContentPage;
