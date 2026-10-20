import {test,expect} from '@playwright/test';

test('spatial restoration synchronously draws the final reader layout before any resize callback',async({page})=>{
  await page.goto('/knowledge/newton-to-quantum/#orbital-density');
  await page.waitForFunction(()=>window.__atlasRelated);
  await page.getByRole('combobox',{name:'주양자수 n',exact:true}).selectOption('3');
  await page.getByRole('combobox',{name:'오비탈 종류·방향',exact:true}).selectOption('dxy');
  await page.getByRole('combobox',{name:'핵전하 Z',exact:true}).selectOption('2');
  for(const sceneId of ['orbital-density','orbital-phase']){
    const result=await page.evaluate(sceneId=>{
      const api=window.__atlasRelated;
      api.setState({sceneId});
      const saved=api.getState();
      api.reset();api.setState(saved);
      const canvas=document.querySelector('canvas');
      if(!(canvas instanceof HTMLCanvasElement))throw new Error('Missing spatial canvas');
      const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);
      const matchesLayout=canvas.width===Math.round(rect.width*dpr)&&canvas.height===Math.round(rect.height*dpr);
      const pixels=canvas.toDataURL(),state=JSON.stringify(api.getState());
      api.seek(700);
      return{matchesLayout,pixelsStable:pixels===canvas.toDataURL(),stateStable:state===JSON.stringify(api.getState())};
    },sceneId);
    expect(result,sceneId).toEqual({matchesLayout:true,pixelsStable:true,stateStable:true});
  }
});

test('a fractional-size field canvas clears every backing-store pixel before redrawing',async({page})=>{
  await page.goto('/knowledge/');
  const result=await page.evaluate(async()=>{
    const {mountFieldViewer}=await import('/components/spatial/field-viewer.js');
    const container=document.createElement('div');
    container.style.cssText='position:fixed;left:0;top:0;width:321.25px;height:180.5px';
    document.body.append(container);
    const viewer=mountFieldViewer(container);
    viewer.setField({evaluate:()=>1,weight:()=>1,bounds:[[-1,1],[-1,1],[-1,1]],resolution:4});
    const canvas=container.querySelector('canvas');
    if(!(canvas instanceof HTMLCanvasElement))throw new Error('Missing fixture canvas');
    const context=canvas.getContext('2d');
    if(!context)throw new Error('Missing fixture context');
    const pixels=canvas.toDataURL();
    const lastPixelAlpha=context.getImageData(canvas.width-1,canvas.height-1,1,1).data[3];
    viewer.seek(500);
    const stable=pixels===canvas.toDataURL();
    viewer.dispose();container.remove();
    return{lastPixelAlpha,stable};
  });
  expect(result).toEqual({lastPixelAlpha:255,stable:true});
});

test('malformed saved camera values cannot silently reset a valid orbital view',async({page})=>{
  await page.goto('/knowledge/newton-to-quantum/#orbital-phase');
  await page.waitForFunction(()=>window.__atlasRelated);
  await page.getByRole('combobox',{name:'표시 방식',exact:true}).selectOption('slice');
  const results=await page.evaluate(()=>{
    const api=window.__atlasRelated,saved=api.getState();
    if(!saved.interaction||!('view'in saved.interaction))throw new Error('Expected orbital snapshot');
    const values=[null,[],42,'invalid',{...saved.interaction.view,futureField:true}];
    return values.map(view=>{
      api.setState(saved);
      let rejected=false;
      try{api.setState({...saved,interaction:{...saved.interaction,view}});}catch{rejected=true;}
      return{rejected,unchanged:JSON.stringify(saved)===JSON.stringify(api.getState())};
    });
  });
  expect(results).toEqual(Array.from({length:5},()=>({rejected:true,unchanged:true})));
});
