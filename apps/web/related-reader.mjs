export function createRelatedReader(page,{onChange=()=>{}}={}){
  let index=0;
  const getState=()=>({sceneId:page.scenes[index].id});
  const inspect=()=>({...getState(),index,total:page.scenes.length,scene:structuredClone(page.scenes[index])});
  const setState=state=>{const next=page.scenes.findIndex(scene=>scene.id===state?.sceneId);if(next<0)throw new RangeError('Unknown related scene');index=next;onChange(inspect());};
  return {getState,inspect,setState,reset(){setState({sceneId:page.scenes[0].id});},next(){setState({sceneId:page.scenes[Math.min(index+1,page.scenes.length-1)].id});},previous(){setState({sceneId:page.scenes[Math.max(index-1,0)].id});}};
}
