import {EXPLOSION_EPISODE} from '../../content/formal-logic/explosion/episode.mjs';

export const LESSON_CHAPTERS=Object.freeze([
  {id:'question',title:'질문과 기호'},
  {id:'premise-p',title:'모순에서 Q까지'},
  {id:'change-r',title:'결론을 바꾸면?'},
  {id:'remove-premise',title:'전제를 빼면?'},
  {id:'truth',title:'도출과 사실'},
  {id:'summary',title:'정리와 다음 질문'}
].map(Object.freeze));

// Reading position only. The scientific model and video timing stay independent.
export function createLessonDialogue({onChange}={}){
  const sections=EXPLOSION_EPISODE.sections;
  let index=0;
  const getState=()=>({sectionId:sections[index].id});
  const inspect=()=>{
    const chapter=LESSON_CHAPTERS.findLast(item=>sections.findIndex(s=>s.id===item.id)<=index);
    const nextChapter=LESSON_CHAPTERS.find(item=>sections.findIndex(s=>s.id===item.id)>index);
    return structuredClone({index,total:sections.length,section:sections[index],chapter,nextChapter,
      canPrevious:index>0,canNext:index<sections.length-1});
  };
  function setState(state){
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
    seek(timeMs){
      if(typeof timeMs!=='number'||!Number.isFinite(timeMs)||timeMs<0)throw new RangeError('Invalid time');
      let end=0;const section=sections.find(s=>{end+=s.durationMs;return timeMs<end;})??sections.at(-1);
      setState({sectionId:section.id});
    }
  };
}
