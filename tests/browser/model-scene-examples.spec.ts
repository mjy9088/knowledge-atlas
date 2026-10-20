import {test,expect} from '@playwright/test';

test('possibility lab rejects extra saved fields without mutating its snapshot',async({page})=>{
  // Given a mounted model interaction.
  await page.goto('/knowledge/monty-hall/');
  await page.waitForFunction(()=>window.__atlasRelated);
  const before=await page.evaluate(()=>window.__atlasRelated.getState());

  // When its LabState contains an undeclared field.
  const rejected=await page.evaluate(snapshot=>{
    try{window.__atlasRelated.setState({...snapshot,interaction:{...snapshot.interaction,unexpected:true}} as never);return false;}
    catch{return true;}
  },before);

  // Then the complete reader and interaction snapshot is unchanged.
  expect(rejected).toBe(true);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(before);
});

test('the physics-history orbital adapter exposes mutation-free preflight before reader restoration',async({page})=>{
  await page.goto('/knowledge/newton-to-quantum/#orbital-density');
  const result=await page.evaluate(async()=>{
    const {mountTopicInteraction}=await import('/topics/registry.js');
    const container=document.createElement('div');document.body.append(container);
    let changes=0;
    const adapter=mountTopicInteraction('physics-history',container,{onChange(){changes++;}});
    const before=adapter.getState();
    if(!adapter.validateState)return{preflight:false,changes,unchanged:false};
    adapter.validateState(before);
    try{adapter.validateState({customized:false,orbital:{n:99,basis:'s',Z:1},view:{}});}catch{return{preflight:true,changes,unchanged:JSON.stringify(before)===JSON.stringify(adapter.getState())};}
    return{preflight:true,changes,unchanged:false};
  });
  expect(result).toEqual({preflight:true,changes:0,unchanged:true});
});
