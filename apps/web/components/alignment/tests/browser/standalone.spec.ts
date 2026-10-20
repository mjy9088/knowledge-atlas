import { expect, test } from "@playwright/test";

test('structural alignment instances isolate paths and validate deterministic state',async({page})=>{
  await page.goto('/knowledge/');
  const result=await page.evaluate(async()=>{
    const {markAlignment,mountSemanticAlignment}=await import('/components/alignment/semantic-alignment.js');
    const forest=[{id:'root',label:'Expression'},{id:'branch',parent:'root',label:'Argument'},{id:'leaf',parent:'branch',label:'Value'},{id:'sibling',parent:'root',label:'Value'}];
    function fixture(){
      const root=document.createElement('section'),status=document.createElement('p');
      for(const side of ['source','symbol'] as const){const top=markAlignment(document.createElement('span'),'root',side),branch=markAlignment(document.createElement('span'),'branch',side),leaf=markAlignment(document.createElement('span'),'leaf',side),sibling=markAlignment(document.createElement('span'),'sibling',side);leaf.textContent=sibling.textContent='x';branch.append(leaf);top.append(branch,sibling);root.append(top);}
      root.append(status);document.body.append(root);const api=mountSemanticAlignment(root,forest,status);api.refresh();return {root,api,status};
    }
    const a=fixture(),b=fixture();a.api.setState({activeId:'leaf'});
    const selected=[...a.root.querySelectorAll('[data-alignment-on-path]')].map(n=>(n as HTMLElement).dataset.alignmentNode);
    const detached=a.api.getState();detached.activeId='sibling';
    let rejected=false;try{a.api.setState({activeId:'unknown'});}catch{rejected=true;}
    const preserved=a.api.getState(),isolated=b.api.getState();a.api.reset();const reset=a.api.getState();a.api.setState(preserved);a.api.refresh();const refreshed=a.api.getState();
    a.api.destroy();a.root.querySelector('[data-alignment-node="leaf"]')!.dispatchEvent(new PointerEvent('pointermove',{bubbles:true}));const destroyed=a.api.getState();b.api.destroy();a.root.remove();b.root.remove();
    return {selected,rejected,preserved,isolated,reset,refreshed,destroyed};
  });
  expect(result.selected).toEqual(['root','branch','leaf','root','branch','leaf']);expect(result.rejected).toBe(true);expect(result.preserved).toEqual({activeId:'leaf'});
  for(const state of [result.isolated,result.reset,result.refreshed,result.destroyed])expect(state).toEqual({activeId:null});
});
