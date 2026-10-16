import {EXPLOSION_EPISODE} from '../../../../content/formal-logic/explosion/episode.js';

export const LESSON_CHAPTERS=Object.freeze([
  {id:'question',title:'질문과 기호',known:'P는 문장, ¬P는 그 문장의 부정이라는 뜻'},
  {id:'premise-p',title:'모순에서 Q까지',known:'P와 ¬P에서 ⊥를 얻고 폭발 규칙으로 Q를 도출하는 과정'},
  {id:'change-r',title:'결론을 바꾸면?',known:'같은 모순에서 임의의 목표를 도출하는 폭발 규칙'},
  {id:'remove-premise',title:'전제를 빼면?',known:'전제를 제외하면 이 증명 경로가 끊긴다는 것과 탐색 실패의 한계'},
  {id:'truth',title:'도출과 사실',known:'가정 아래의 도출과 현실의 사실이 다르다는 것, 일관성의 의미'},
  {id:'summary',title:'정리와 다음 질문',known:'모순 폭발의 조건과 해석의 범위'}
].map(item=>Object.freeze(item)));

// Reading position only. The scientific model and video timing stay independent.
export type LessonView={index:number;total:number;section:typeof EXPLOSION_EPISODE.sections[number];chapter:typeof LESSON_CHAPTERS[number];nextChapter:typeof LESSON_CHAPTERS[number]|undefined;canPrevious:boolean;canNext:boolean};
export function createLessonDialogue({onChange}:{onChange?:(view:LessonView)=>void}={}){
  const sections=EXPLOSION_EPISODE.sections;
  let index=0;
  const getState=()=>({sectionId:sections[index].id});
  const inspect=():LessonView=>{
    const chapter=LESSON_CHAPTERS.findLast(item=>sections.findIndex(s=>s.id===item.id)<=index)??LESSON_CHAPTERS[0];
    const nextChapter=LESSON_CHAPTERS.find(item=>sections.findIndex(s=>s.id===item.id)>index);
    return structuredClone({index,total:sections.length,section:sections[index],chapter,nextChapter,
      canPrevious:index>0,canNext:index<sections.length-1});
  };
  function setState(state:{sectionId:string}){
    if(!state||typeof state.sectionId!=='string')throw new TypeError('sectionId is required');
    const next=sections.findIndex(s=>s.id===state.sectionId);
    if(next<0)throw new RangeError('Unknown lesson section');
    index=next;onChange?.(inspect());
  }
  return {getState,setState,inspect,reset(){setState({sectionId:sections[0].id});},
    next(){setState({sectionId:sections[Math.min(index+1,sections.length-1)].id});},
    previous(){setState({sectionId:sections[Math.max(index-1,0)].id});},
    skip(){const next=inspect().nextChapter;if(next)setState({sectionId:next.id});},
    // Compatibility with existing inspection links; no time-based UI or autoplay.
    seek(timeMs:number){
      if(typeof timeMs!=='number'||!Number.isFinite(timeMs)||timeMs<0)throw new RangeError('Invalid time');
      let end=0;const section=sections.find(s=>{end+=s.durationMs;return timeMs<end;})??sections[sections.length-1];
      setState({sectionId:section.id});
    }
  };
}
