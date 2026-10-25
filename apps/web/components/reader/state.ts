import type {ContentPage, Scene} from '/packages/content/types.js';
export interface ReaderView {sceneId:string;index:number;total:number;scene:Scene}
export function readerDestination(page:ContentPage,sceneId:string,direction:'next'|'previous'){
  const index=page.scenes.findIndex(scene=>scene.id===sceneId);
  if(index<0)throw new RangeError('Unknown related scene');
  const offset=direction==='next'?1:-1;
  return page.scenes[Math.max(0,Math.min(index+offset,page.scenes.length-1))].id;
}
export function readerSkip(page:ContentPage,sceneId:string){
  const from=page.scenes.findIndex(scene=>scene.id===sceneId),scene=page.scenes[from];
  if(!scene?.skip)return null;
  const to=page.scenes.findIndex(item=>item.id===scene.skip!.to);
  if(to<=from+1||!scene.skip.label.trim())throw new RangeError('Skip must name a distinct forward jump');
  return {to:page.scenes[to].id,label:scene.skip.label,scope:page.scenes.slice(from,to).map(item=>item.known).join(' · '),destination:page.scenes[to].title};
}
export function createRelatedReader(page:ContentPage,{onChange=(_view:ReaderView)=>{}}={}){
  const initialId=page.scenes[0].id;
  let index=page.scenes.findIndex(scene=>scene.id===initialId);
  const getState=()=>({sceneId:page.scenes[index].id});
  const inspect=()=>({...getState(),index,total:page.scenes.length,scene:structuredClone(page.scenes[index])});
  const setState=(state:{sceneId:string})=>{const next=page.scenes.findIndex(scene=>scene.id===state?.sceneId);if(next<0)throw new RangeError('Unknown related scene');index=next;onChange(inspect());};
  return {getState,inspect,setState,reset(){setState({sceneId:initialId});},next(){setState({sceneId:readerDestination(page,getState().sceneId,'next')});},previous(){setState({sceneId:readerDestination(page,getState().sceneId,'previous')});}};
}
