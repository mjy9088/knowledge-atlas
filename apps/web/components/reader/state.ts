import type {ContentPage, Scene} from '/packages/content/types.js';
export interface ReaderView {sceneId:string;index:number;total:number;scene:Scene}
export function createRelatedReader(page:ContentPage,{onChange=(_view:ReaderView)=>{}}={}){
  let index=0;
  const getState=()=>({sceneId:page.scenes[index].id});
  const inspect=()=>({...getState(),index,total:page.scenes.length,scene:structuredClone(page.scenes[index])});
  const setState=(state:{sceneId:string})=>{const next=page.scenes.findIndex(scene=>scene.id===state?.sceneId);if(next<0)throw new RangeError('Unknown related scene');index=next;onChange(inspect());};
  return {getState,inspect,setState,reset(){setState({sceneId:page.scenes[0].id});},next(){setState({sceneId:page.scenes[Math.min(index+1,page.scenes.length-1)].id});},previous(){setState({sceneId:page.scenes[Math.max(index-1,0)].id});}};
}
