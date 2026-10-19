import {test,expect} from '@playwright/test';

test('ZFC scene examples match the explained relation without overwriting reader edits',async({page})=>{
  await page.goto('/knowledge/zfc/#extensionality');
  await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.getByRole('textbox',{name:'목표 명제식',exact:true})).toHaveValue('A = B');
  await expect(page.getByRole('textbox',{name:'전제 1 명제식',exact:true})).toHaveValue('A ⊆ B');
  await expect(page.getByRole('textbox',{name:'전제 2 명제식',exact:true})).toHaveValue('B ⊆ A');
  await page.locator('#reader-prev').click();
  await expect(page.getByRole('textbox',{name:'목표 명제식',exact:true})).toHaveValue('X ∈ B');
  await page.getByRole('textbox',{name:'목표 명제식',exact:true}).fill('A = C');
  await page.locator('#reader-next').click();
  await expect(page.getByRole('textbox',{name:'목표 명제식',exact:true})).toHaveValue('A = C');
  await page.getByRole('button',{name:'장면 예시로',exact:true}).click();
  await expect(page.getByRole('textbox',{name:'목표 명제식',exact:true})).toHaveValue('A = B');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>window.__atlasRelated.reset());
  await page.evaluate(state=>window.__atlasRelated.setState(state),saved);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
});

test('normal CH target and shared navigation remain inspectable at narrow width',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/knowledge/continuum-hypothesis/#metaproof');
  await page.waitForFunction(()=>window.__atlasRelated);
  const goal=page.getByRole('textbox',{name:'목표 명제식',exact:true});
  await expect(goal).toHaveValue('Ind(CH,ZFC)');
  expect(await goal.evaluate(input=>input.scrollWidth<=input.clientWidth)).toBe(true);
  for(const selector of ['.reader-menu summary','#reader-prev','#reader-next']){
    const bounds=await page.locator(selector).boundingBox();
    expect(bounds?.height).toBeGreaterThanOrEqual(44);
    expect(bounds?.width).toBeGreaterThanOrEqual(44);
  }
});

test('ZFC restoration validates the final scene proof before changing any reader state',async({page})=>{
  // Given an untouched extensionality example whose proof has more rows than membership.
  await page.goto('/knowledge/zfc/#extensionality');
  await page.waitForFunction(()=>window.__atlasRelated);
  const before=await page.evaluate(()=>window.__atlasRelated.getState());

  // When a saved snapshot requests membership with an out-of-range final proof row.
  const rejected=await page.evaluate(()=>{
    try{window.__atlasRelated.setState({sceneId:'membership',visual:{step:5}});return false;}catch{return true;}
  });

  // Then rejection is atomic across reader, experiment, and visual state.
  expect(rejected).toBe(true);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(before);
});

test('ZFC restoration preserves an explicit customized experiment after selecting its scene',async({page})=>{
  // Given customized input saved on the membership scene.
  await page.goto('/knowledge/zfc/#membership');
  await page.waitForFunction(()=>window.__atlasRelated);
  await page.getByRole('textbox',{name:'목표 명제식',exact:true}).fill('A = C');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>window.__atlasRelated.reset());

  // When the complete snapshot is restored.
  await page.evaluate(state=>window.__atlasRelated.setState(state),saved);

  // Then both the declared scene and explicit user input survive scene presets.
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  await expect(page).toHaveURL(/#membership$/);
  await expect(page.getByRole('textbox',{name:'목표 명제식',exact:true})).toHaveValue('A = C');
});

test('related saved-state boundary rejects wrong shapes and model-page interactions atomically',async({page})=>{
  // Given a model-backed reader snapshot.
  await page.goto('/knowledge/zfc/#membership');
  await page.waitForFunction(()=>window.__atlasRelated);
  const before=await page.evaluate(()=>window.__atlasRelated.getState());

  // When malformed top-level shapes, typo keys, or an inapplicable interaction are restored.
  const rejected=await page.evaluate(snapshot=>[
    [],
    {...snapshot,interation:{}},
    {...snapshot,interaction:false},
    {...snapshot,experiment:undefined},
  ].every(candidate=>{
    try{window.__atlasRelated.setState(candidate as never);return false;}catch{return JSON.stringify(window.__atlasRelated.getState())===JSON.stringify(snapshot);}
  }),before);

  // Then every candidate is rejected without changing the complete snapshot.
  expect(rejected).toBe(true);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(before);
});

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

test('every orbital adapter exposes mutation-free preflight before reader restoration',async({page})=>{
  await page.goto('/knowledge/atomic-orbitals/');
  const result=await page.evaluate(async()=>{
    const {mountTopicInteraction}=await import('/topics/registry.js');
    const container=document.createElement('div');document.body.append(container);
    let changes=0;
    const adapter=mountTopicInteraction('hydrogenic-orbitals',container,{onChange(){changes++;}});
    const before=adapter.getState();
    if(!adapter.validateState)return{preflight:false,changes,unchanged:false};
    adapter.validateState(before);
    try{adapter.validateState({customized:false,orbital:{n:99,basis:'s',Z:1},view:{}});}catch{return{preflight:true,changes,unchanged:JSON.stringify(before)===JSON.stringify(adapter.getState())};}
    return{preflight:true,changes,unchanged:false};
  });
  expect(result).toEqual({preflight:true,changes:0,unchanged:true});
});
