import {test,expect} from '@playwright/test';

test.use({launchOptions:{args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']}});

test('orbitals opt into real WebGL2 cloud and depth-tested surface output',async({page})=>{
  await page.goto('/knowledge/atomic-orbitals/#orbit');
  await page.waitForFunction(()=>window.__atlasRelated);
  const initial=await page.evaluate(()=>{
    const inspection=window.__atlasRelated.getInspectionSnapshot().interaction;
    if(!inspection||!('viewer' in inspection))throw new Error('Expected spatial inspection');
    const canvas=document.querySelector('.field-canvas');
    if(!(canvas instanceof HTMLCanvasElement))throw new Error('Missing visible canvas');
    return{backend:inspection.viewer.backend,pixels:canvas.toDataURL(),backing:document.querySelectorAll('.field-webgl-backing').length};
  });
  expect(initial.backend).toEqual({requested:'webgl2',active:'webgl2',status:'ready'});
  expect(initial.backing).toBe(1);
  expect(initial.pixels.length).toBeGreaterThan(1000);
  await page.locator('.field-canvas').focus();
  await page.keyboard.press('ArrowRight');
  const rotated=await page.locator('.field-canvas').evaluate(canvas=>(canvas as HTMLCanvasElement).toDataURL());
  expect(rotated).not.toBe(initial.pixels);
  await page.getByRole('combobox',{name:'표시 방식',exact:true}).selectOption('surface');
  const surface=await page.evaluate(()=>{
    const inspection=window.__atlasRelated.getInspectionSnapshot().interaction;
    if(!inspection||!('viewer' in inspection))throw new Error('Expected spatial inspection');
    const canvas=document.querySelector('.field-canvas');
    if(!(canvas instanceof HTMLCanvasElement))throw new Error('Missing visible canvas');
    return{backend:inspection.viewer.backend,triangles:inspection.viewer.triangleCount,pixels:canvas.toDataURL()};
  });
  expect(surface.backend.active).toBe('webgl2');
  expect(surface.triangles).toBeGreaterThan(0);
  expect(surface.pixels).not.toBe(rotated);
  await page.getByRole('combobox',{name:'표시 방식',exact:true}).selectOption('slice');
  const sliceBackend=await page.evaluate(()=>{const inspection=window.__atlasRelated.getInspectionSnapshot().interaction;if(!inspection||!('viewer' in inspection))throw new Error('Expected spatial inspection');return inspection.viewer.backend;});
  expect(sliceBackend).toEqual({requested:'webgl2',active:'canvas2d',status:'ready'});
});

test('equivalent unit, large, and translated fields keep cloud and surface masks visible',async({page})=>{
  await page.goto('/knowledge/');
  const masks=await page.evaluate(async()=>{
    const {mountFieldViewer}=await import('/components/spatial/field-viewer.js');
    const fixtures=[{bounds:[[-1,1],[-1,1],[-1,1]],center:[0,0,0],half:1},{bounds:[[-64,64],[-64,64],[-64,64]],center:[0,0,0],half:64},{bounds:[[10,12],[-7,-5],[20,22]],center:[11,-6,21],half:1}] as const;
    const results=[];
    for(const fixture of fixtures){
      const container=document.createElement('div');container.style.cssText='width:320px;height:240px';document.body.append(container);
      const viewer=mountFieldViewer(container,{useWebGL:true});
      viewer.setField({evaluate:([x,y,z])=>{const dx=(x-fixture.center[0])/fixture.half,dy=(y-fixture.center[1])/fixture.half,dz=(z-fixture.center[2])/fixture.half;return 1-(dx*dx+dy*dy+dz*dz)/(.45*.45);},weight:value=>Math.max(0,value),bounds:fixture.bounds.map(pair=>[...pair]) as [[number,number],[number,number],[number,number]],resolution:8});
      const modeResults=[];
      for(const mode of ['cloud','surface'] as const){
        viewer.setState({mode,iso:.5});const canvas=container.querySelector('.field-canvas');if(!(canvas instanceof HTMLCanvasElement))throw new Error('Missing visible canvas');const context=canvas.getContext('2d');if(!context)throw new Error('Missing visible context');const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
        let count=0,minX=canvas.width,minY=canvas.height,maxX=0,maxY=0;for(let index=0;index<pixels.length;index+=4){const red=pixels[index]??0,green=pixels[index+1]??0,blue=pixels[index+2]??0;if(red===16&&green===30&&blue===41)continue;const pixel=index/4,x=pixel%canvas.width,y=Math.floor(pixel/canvas.width);count++;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}modeResults.push({mode,count,bounds:[minX,minY,maxX,maxY],backend:viewer.inspect().backend});
      }
      viewer.dispose();container.remove();results.push(modeResults);
    }
    return results;
  });
  for(const fixture of masks)for(const mask of fixture){const evidence=JSON.stringify(mask);expect(mask.backend,evidence).toEqual({requested:'webgl2',active:'webgl2',status:'ready'});expect(mask.count,evidence).toBeGreaterThan(100);expect(mask.bounds[0],evidence).toBeGreaterThan(0);expect(mask.bounds[1],evidence).toBeGreaterThan(0);expect(mask.bounds[2],evidence).toBeLessThan(319);expect(mask.bounds[3],evidence).toBeLessThan(239);}
  for(const modeIndex of [0,1]){const counts=masks.map(fixture=>fixture[modeIndex]?.count??0);expect(Math.max(...counts)-Math.min(...counts)).toBeLessThan(80);}
});

test('translated slice zero evaluates the field center and remains a Canvas frame',async({page})=>{
  await page.goto('/knowledge/');
  const result=await page.evaluate(async()=>{
    const {mountFieldViewer}=await import('/components/spatial/field-viewer.js');const container=document.createElement('div');container.style.cssText='width:320px;height:240px';document.body.append(container);const viewer=mountFieldViewer(container,{useWebGL:true});viewer.setField({evaluate:([,,z])=>Math.abs(z-21)<.01?1:0,weight:value=>value,bounds:[[10,12],[-7,-5],[20,22]],resolution:8});viewer.setState({mode:'slice',plane:'xy',slice:0});const canvas=container.querySelector('.field-canvas');if(!(canvas instanceof HTMLCanvasElement))throw new Error('Missing visible canvas');const context=canvas.getContext('2d');if(!context)throw new Error('Missing visible context');const center=[...context.getImageData(Math.floor(canvas.width/2),Math.floor(canvas.height/2),1,1).data],backend=viewer.inspect().backend;viewer.dispose();container.remove();return{center,backend};
  });
  expect(result.backend).toEqual({requested:'webgl2',active:'canvas2d',status:'ready'});expect(result.center).not.toEqual([16,30,41,255]);
});

test('requested WebGL2 unavailability falls back without emitting a view edit',async({page})=>{
  await page.goto('/knowledge/');
  const result=await page.evaluate(async()=>{
    const {mountFieldViewer}=await import('/components/spatial/field-viewer.js');
    const container=document.createElement('div');container.style.cssText='width:320px;height:240px';document.body.append(container);
    let changes=0,backendChanges=0;
    const viewer=mountFieldViewer(container,{useWebGL:true,onChange:()=>{changes++},onBackendChange:()=>{backendChanges++},createWebGLContext:()=>null});
    viewer.setField({evaluate:([x,y,z])=>1-x*x-y*y-z*z,weight:value=>Math.max(0,value),bounds:[[-1,1],[-1,1],[-1,1]],resolution:8});
    const canvas=container.querySelector('.field-canvas');if(!(canvas instanceof HTMLCanvasElement))throw new Error('Missing canvas');
    const output={backend:viewer.inspect().backend,changes,backendChanges,pixels:canvas.toDataURL().length};
    viewer.dispose();container.remove();return output;
  });
  expect(result.backend).toEqual({requested:'webgl2',active:'canvas2d',status:'unavailable'});
  expect(result.changes).toBe(0);
  expect(result.backendChanges).toBe(1);
  expect(result.pixels).toBeGreaterThan(1000);
});

test('real WebGL setup and draw failures release resources and display Canvas output',async({page})=>{
  await page.goto('/knowledge/');
  const results=await page.evaluate(async()=>{
    const {mountFieldViewer}=await import('/components/spatial/field-viewer.js');
    const run=(failure:'compile'|'attribute'|'draw')=>{
      const container=document.createElement('div');container.style.cssText='width:320px;height:240px';document.body.append(container);let deletedShaders=0,deletedPrograms=0,deletedBuffers=0,changes=0;
      const viewer=mountFieldViewer(container,{useWebGL:true,onChange:()=>{changes++},createWebGLContext:target=>{const gl=target.getContext('webgl2');if(!gl)throw new Error('WebGL2 required');const getShaderParameter=gl.getShaderParameter.bind(gl),deleteShader=gl.deleteShader.bind(gl),deleteProgram=gl.deleteProgram.bind(gl),deleteBuffer=gl.deleteBuffer.bind(gl),getAttribLocation=gl.getAttribLocation.bind(gl),getError=gl.getError.bind(gl);gl.deleteShader=shader=>{deletedShaders++;deleteShader(shader);};gl.deleteProgram=program=>{deletedPrograms++;deleteProgram(program);};gl.deleteBuffer=buffer=>{deletedBuffers++;deleteBuffer(buffer);};if(failure==='compile')gl.getShaderParameter=(shader,pname)=>pname===gl.COMPILE_STATUS&&getShaderParameter(shader,gl.SHADER_TYPE)===gl.FRAGMENT_SHADER?false:getShaderParameter(shader,pname);if(failure==='attribute')gl.getAttribLocation=(program,name)=>name==='a_normal'?-1:getAttribLocation(program,name);if(failure==='draw'){let failed=false;gl.getError=()=>{if(!failed){failed=true;return gl.INVALID_OPERATION;}return getError();};}return gl;}});
      viewer.setField({evaluate:([x,y,z])=>1-x*x-y*y-z*z,weight:value=>Math.max(0,value),bounds:[[-1,1],[-1,1],[-1,1]],resolution:8});const canvas=container.querySelector('.field-canvas');if(!(canvas instanceof HTMLCanvasElement))throw new Error('Missing canvas');const context=canvas.getContext('2d');if(!context)throw new Error('Missing context');const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;let painted=0;for(let index=0;index<pixels.length;index+=4)if(pixels[index]!==16||pixels[index+1]!==30||pixels[index+2]!==41)painted++;const result={failure,backend:viewer.inspect().backend,deletedShaders,deletedPrograms,deletedBuffers,changes,painted};viewer.dispose();container.remove();return result;
    };
    return[run('compile'),run('attribute'),run('draw')];
  });
  for(const result of results){expect(result.backend).toEqual({requested:'webgl2',active:'canvas2d',status:'failed'});expect(result.changes).toBe(0);expect(result.painted).toBeGreaterThan(100);}
  expect(results[0]?.deletedShaders).toBe(2);
  expect(results[1]?.deletedPrograms).toBeGreaterThan(0);expect(results[1]?.deletedBuffers).toBeGreaterThan(0);
  expect(results[2]?.deletedPrograms).toBeGreaterThan(0);expect(results[2]?.deletedBuffers).toBeGreaterThan(0);
});

test('real WebGL context loss falls back, restores resources, and disposal makes later restore harmless',async({page})=>{
  await page.goto('/knowledge/');
  const result=await page.evaluate(async()=>{
    const {mountFieldViewer}=await import('/components/spatial/field-viewer.js');
    const container=document.createElement('div');container.style.cssText='width:320px;height:240px';document.body.append(container);
    let changes=0;const backendChanges:string[]=[];
    const viewer=mountFieldViewer(container,{useWebGL:true,onChange:()=>{changes++},onBackendChange:backend=>{backendChanges.push(JSON.stringify(backend));}});
    viewer.setField({evaluate:([x,y,z])=>1-x*x-y*y-z*z,weight:value=>Math.max(0,value),bounds:[[-1,1],[-1,1],[-1,1]],resolution:8});
    const saved=JSON.stringify(viewer.getState()),backing=container.querySelector('.field-webgl-backing');backendChanges.length=0;
    if(!(backing instanceof HTMLCanvasElement))throw new Error('Missing WebGL backing canvas');
    const gl=backing.getContext('webgl2'),extension=gl?.getExtension('WEBGL_lose_context');
    if(!gl||!extension)throw new Error('SwiftShader WebGL2 context-loss extension required');
    const loss=new Promise<void>(resolve=>backing.addEventListener('webglcontextlost',()=>resolve(),{once:true}));extension.loseContext();await loss;
    const lost=viewer.inspect().backend;
    await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
    const restoration=new Promise<void>(resolve=>backing.addEventListener('webglcontextrestored',()=>resolve(),{once:true}));extension.restoreContext();await restoration;
    const restored=viewer.inspect().backend,stateStable=saved===JSON.stringify(viewer.getState());
    const secondLoss=new Promise<void>(resolve=>backing.addEventListener('webglcontextlost',()=>resolve(),{once:true}));extension.loseContext();await secondLoss;viewer.dispose();extension.restoreContext();await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));const children=container.children.length;container.remove();
    return{lost,restored,stateStable,changes,children,backendChanges};
  });
  expect(result.lost).toEqual({requested:'webgl2',active:'canvas2d',status:'context-lost'});
  expect(result.restored).toEqual({requested:'webgl2',active:'webgl2',status:'ready'});
  expect(result.stateStable).toBe(true);
  expect(result.changes).toBe(0);
  expect(result.children).toBe(0);
  expect(result.backendChanges.slice(0,2)).toEqual([JSON.stringify({requested:'webgl2',active:'canvas2d',status:'context-lost'}),JSON.stringify({requested:'webgl2',active:'webgl2',status:'ready'})]);
});

test('slice context restoration becomes ready on Canvas before the next cloud GPU frame',async({page})=>{
  await page.goto('/knowledge/');
  const result=await page.evaluate(async()=>{
    const {mountFieldViewer}=await import('/components/spatial/field-viewer.js');const container=document.createElement('div');container.style.cssText='width:320px;height:240px';document.body.append(container);let changes=0;const backendChanges:string[]=[];const viewer=mountFieldViewer(container,{useWebGL:true,onChange:()=>{changes++;},onBackendChange:backend=>{backendChanges.push(JSON.stringify(backend));}});viewer.setField({evaluate:([x,y,z])=>1-x*x-y*y-z*z,weight:value=>Math.max(0,value),bounds:[[-1,1],[-1,1],[-1,1]],resolution:8});viewer.setState({mode:'slice'});changes=0;backendChanges.length=0;const saved=JSON.stringify(viewer.getState()),backing=container.querySelector('.field-webgl-backing');if(!(backing instanceof HTMLCanvasElement))throw new Error('Missing WebGL backing');const gl=backing.getContext('webgl2'),extension=gl?.getExtension('WEBGL_lose_context');if(!gl||!extension)throw new Error('SwiftShader context loss required');const loss=new Promise<void>(resolve=>backing.addEventListener('webglcontextlost',()=>resolve(),{once:true}));extension.loseContext();await loss;const lost=viewer.inspect().backend;await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));const restoration=new Promise<void>(resolve=>backing.addEventListener('webglcontextrestored',()=>resolve(),{once:true}));extension.restoreContext();await restoration;const restored=viewer.inspect().backend,stateStable=saved===JSON.stringify(viewer.getState()),automaticChanges=changes;viewer.setState({mode:'cloud'});const cloud=viewer.inspect().backend,cloudChanges=changes;viewer.dispose();container.remove();return{lost,restored,cloud,stateStable,automaticChanges,cloudChanges,backendChanges};
  });
  expect(result.lost).toEqual({requested:'webgl2',active:'canvas2d',status:'context-lost'});expect(result.restored).toEqual({requested:'webgl2',active:'canvas2d',status:'ready'});expect(result.cloud).toEqual({requested:'webgl2',active:'webgl2',status:'ready'});expect(result.stateStable).toBe(true);expect(result.automaticChanges).toBe(0);expect(result.cloudChanges).toBe(1);expect(result.backendChanges).toEqual([JSON.stringify(result.lost),JSON.stringify(result.restored),JSON.stringify(result.cloud)]);
});

test('orbital slice hides WebGL fallback notice when WebGL2 is unavailable',async({page})=>{
  await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;Object.defineProperty(HTMLCanvasElement.prototype,'getContext',{configurable:true,value:function(this:HTMLCanvasElement,contextId:string,...args:unknown[]){if(contextId==='webgl2')return null;return Reflect.apply(original,this,[contextId,...args]);}});});
  await page.goto('/knowledge/atomic-orbitals/#nodes');await page.waitForFunction(()=>window.__atlasRelated);await expect(page.getByRole('combobox',{name:'표시 방식',exact:true})).toHaveValue('slice');await expect(page.locator('.orbital-renderer-status')).toBeHidden();const backend=await page.evaluate(()=>{const inspection=window.__atlasRelated.getInspectionSnapshot().interaction;if(!inspection||!('viewer' in inspection))throw new Error('Expected spatial inspection');return inspection.viewer.backend;});expect(backend).toEqual({requested:'webgl2',active:'canvas2d',status:'unavailable'});
});

test('orbital slice hides context-loss notice, restores ready Canvas, then resumes cloud WebGL',async({page})=>{
  await page.goto('/knowledge/atomic-orbitals/#nodes');await page.waitForFunction(()=>window.__atlasRelated);const saved=await page.evaluate(()=>window.__atlasRelated.getState()),backing=page.locator('.field-webgl-backing');await expect(page.getByRole('combobox',{name:'표시 방식',exact:true})).toHaveValue('slice');await backing.evaluate(canvas=>{if(!(canvas instanceof HTMLCanvasElement))throw new Error('Missing backing canvas');const extension=canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context');if(!extension)throw new Error('SwiftShader context loss required');canvas.addEventListener('restore-slice-webgl',()=>requestAnimationFrame(()=>extension.restoreContext()),{once:true});extension.loseContext();});await expect.poll(()=>page.evaluate(()=>{const interaction=window.__atlasRelated.getInspectionSnapshot().interaction;if(!interaction||!('viewer' in interaction))throw new Error('Expected inspection');return interaction.viewer.backend.status;})).toBe('context-lost');await expect(page.locator('.orbital-renderer-status')).toBeHidden();expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);await backing.evaluate(canvas=>canvas.dispatchEvent(new Event('restore-slice-webgl')));await expect.poll(()=>page.evaluate(()=>{const interaction=window.__atlasRelated.getInspectionSnapshot().interaction;if(!interaction||!('viewer' in interaction))throw new Error('Expected inspection');return interaction.viewer.backend;})).toEqual({requested:'webgl2',active:'canvas2d',status:'ready'});await expect(page.locator('.orbital-renderer-status')).toBeHidden();expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);await page.getByRole('combobox',{name:'표시 방식',exact:true}).selectOption('cloud');await expect.poll(()=>page.evaluate(()=>{const interaction=window.__atlasRelated.getInspectionSnapshot().interaction;if(!interaction||!('viewer' in interaction))throw new Error('Expected inspection');return interaction.viewer.backend;})).toEqual({requested:'webgl2',active:'webgl2',status:'ready'});
});

test('orbital surface legend and status follow the effective backend without changing state',async({page})=>{
  await page.goto('/knowledge/atomic-orbitals/#phase');await page.waitForFunction(()=>window.__atlasRelated);const saved=await page.evaluate(()=>window.__atlasRelated.getState()),legend=page.locator('.field-legend'),status=page.locator('.orbital-renderer-status');
  await expect(legend).toContainText('표면 방향 조명');await expect(legend).toContainText('밀도가 아님');
  const backing=page.locator('.field-webgl-backing');const available=await backing.evaluate(canvas=>{if(!(canvas instanceof HTMLCanvasElement))throw new Error('Missing backing canvas');const extension=canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context');if(!extension)return false;canvas.addEventListener('restore-test-webgl',()=>requestAnimationFrame(()=>extension.restoreContext()),{once:true});extension.loseContext();return true;});expect(available).toBe(true);
  await expect(status).toBeVisible();await expect(status).toContainText('Canvas 2D');await expect(legend).toContainText('Canvas 2D 삼각형');await expect(legend).toContainText('밀도 명암 아님');await expect(legend).not.toContainText('표면 방향 조명');
  await backing.evaluate(canvas=>canvas.dispatchEvent(new Event('restore-test-webgl')));
  await expect(status).toBeHidden();await expect(legend).toContainText('표면 방향 조명');expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  await backing.evaluate(canvas=>{if(!(canvas instanceof HTMLCanvasElement))throw new Error('Missing backing canvas');const gl=canvas.getContext('webgl2');if(!gl)throw new Error('Missing restored WebGL2 context');gl.getError=()=>gl.INVALID_OPERATION;});await page.evaluate(()=>window.__atlasRelated.seek(0));
  await expect(status).toBeVisible();await expect(status).toContainText('GPU 렌더링에 실패');await expect(status).not.toContainText('초기화');await expect(legend).toContainText('Canvas 2D 삼각형');expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
});

test('disabled backend inspection returns detached immutable snapshots',async({page})=>{
  await page.goto('/knowledge/');
  const result=await page.evaluate(async()=>{
    const {mountFieldViewer}=await import('/components/spatial/field-viewer.js');const container=document.createElement('div');container.style.cssText='width:100px;height:100px';document.body.append(container);const viewer=mountFieldViewer(container);const first=viewer.inspect().backend;Object.assign(first,{active:'webgl2',status:'ready'});const second=viewer.inspect().backend;viewer.dispose();container.remove();return{first,second,same:first===second};
  });
  expect(result.first).toEqual({requested:'canvas2d',active:'webgl2',status:'ready'});
  expect(result.second).toEqual({requested:'canvas2d',active:'canvas2d',status:'disabled'});
  expect(result.same).toBe(false);
});
