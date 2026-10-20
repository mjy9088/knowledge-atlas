import { expect, test } from "@playwright/test";

test('spatial viewer can render a non-orbital field and reject an invalid camera state',async({page})=>{
  await page.goto('/knowledge/');
  const result=await page.evaluate(async()=>{
    const {mountFieldViewer}=await import('/components/spatial/field-viewer.js');
    const container=document.createElement('div');container.style.width='400px';container.style.height='300px';document.body.append(container);
    const viewer=mountFieldViewer(container,{label:'Generic signed field'});
    viewer.setField({evaluate:([x,y,z])=>1-x*x-y*y-z*z,weight:v=>Math.max(0,v),bounds:[[-1,1],[-1,1],[-1,1]],resolution:12});
    viewer.setState({mode:'surface',iso:.5});const before=viewer.getState(),snapshot=viewer.inspect();
    let rejected=false;try{viewer.setState({...before,zoom:0});}catch{rejected=true;}
    const unchanged=JSON.stringify(before)===JSON.stringify(viewer.getState());viewer.reset();viewer.setState(before);viewer.seek(100);
    const restored=JSON.stringify(before)===JSON.stringify(viewer.getState());viewer.dispose();return {snapshot,rejected,unchanged,restored,children:container.children.length};
  });
  expect(result.snapshot.triangleCount).toBeGreaterThan(0);expect(result.rejected&&result.unchanged&&result.restored).toBe(true);expect(result.children).toBe(0);
});
