import type {ScalarGrid,Point3,FieldSample} from '/packages/spatial/scalar-field.js';
export interface FieldView {yaw:number;pitch:number;zoom:number;mode:'cloud'|'slice'|'surface';plane:'xy'|'xz'|'yz';slice:number;iso:number}
export interface FieldDefinition {evaluate:(point:Point3)=>number;weight:(value:number)=>number;bounds:[[number,number],[number,number],[number,number]];resolution?:number}
export interface RenderBackend {readonly requested:'webgl2';readonly active:'none'|'canvas2d'|'webgl2';readonly status:'ready'|'unavailable'|'context-lost'|'failed'}
import {createScalarGrid,weightedCloud,scalarIsosurface} from '/packages/spatial/scalar-field.js';
import {createFieldFrame,projectFieldPoint} from './field-camera.js';
import {createWebGLRenderer,resolveCssColor} from './webgl-renderer.js';

export const DEFAULT_FIELD_VIEW:Readonly<FieldView>=Object.freeze({yaw:-.65,pitch:.45,zoom:1.65,mode:'cloud',plane:'xz',slice:0,iso:.035});
export function validateFieldView(input:unknown):FieldView{
  if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(key=>!['yaw','pitch','zoom','mode','plane','slice','iso'].includes(key)))throw new RangeError('Invalid field view state');
  const state={...DEFAULT_FIELD_VIEW,...input};
  if(!['cloud','slice','surface'].includes(state.mode)||!['xy','xz','yz'].includes(state.plane)||!['yaw','pitch','zoom','slice','iso'].every(key=>Number.isFinite(state[key as 'yaw'|'pitch'|'zoom'|'slice'|'iso']))||Math.abs(state.yaw)>100||Math.abs(state.pitch)>1.5||state.zoom<.5||state.zoom>4||Math.abs(state.slice)>1||state.iso<.005||state.iso>1)throw new RangeError('Invalid field view state');
  return {yaw:state.yaw,pitch:state.pitch,zoom:state.zoom,mode:state.mode,plane:state.plane,slice:state.slice,iso:state.iso};
}
export function mountFieldViewer(container:HTMLElement,{label='Spatial scalar field',onChange=()=>{},colors=['#65e2d5','#ffa86b'],background='#101e29',onBackendChange=()=>{},createWebGLContext}:{label?:string;onChange?:(state:FieldView)=>void;colors?:[string,string];background?:string;onBackendChange?:(backend:RenderBackend)=>void;createWebGLContext?:(canvas:HTMLCanvasElement)=>WebGL2RenderingContext|null}={}){
  const doc=container.ownerDocument,canvas=doc.createElement('canvas');canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',label);canvas.className='field-canvas';container.append(canvas);
  const ctx=(()=>{const context=canvas.getContext('2d');if(!context)throw new Error('Canvas 2D is unavailable');return context;})();
  const backing=doc.createElement('canvas');backing.className='field-webgl-backing';backing.hidden=true;container.append(backing);
  let state:FieldView={...DEFAULT_FIELD_VIEW},field:FieldDefinition|undefined,grid:ScalarGrid|undefined,cloud:FieldSample[]=[],surface:FieldSample[][]=[],surfaceLevel:number|null=null,drag:{x:number;y:number}|null=null,disposed=false,displayedWithWebGL=false,drawingGpu=false;
  let rendererBackend:RenderBackend={requested:'webgl2',active:'none',status:'unavailable'},reportedBackend='';
  const backendSnapshot=():RenderBackend=>({requested:'webgl2',active:state.mode==='slice'?'canvas2d':displayedWithWebGL&&rendererBackend.status==='ready'?'webgl2':'none',status:rendererBackend.status});
  const publishBackend=()=>{const next=backendSnapshot(),key=JSON.stringify(next);if(key===reportedBackend)return;reportedBackend=key;onBackendChange({...next});};
  const gpu=createWebGLRenderer({canvas:backing,colors:[resolveCssColor(container,colors[0]),resolveCssColor(container,colors[1])],background:resolveCssColor(container,background),createContext:createWebGLContext,onStatusChange(next){rendererBackend={...next};if(next.status!=='ready')displayedWithWebGL=false;if(!drawingGpu)publishBackend();},onRedraw:draw});
  function pointProjection([x,y,z]:readonly number[],w:number,h:number):[number,number,number]{
    if(!grid)throw new Error('Field grid unavailable');
    return projectFieldPoint([x,y,z],{frame:createFieldFrame(grid.bounds),view:state,width:w,height:h});
  }
  const color=(value:number)=>value<0?colors[1]:colors[0];
  function draw(){
    if(disposed||!field||!grid)return;
    const rect=canvas.getBoundingClientRect(),w=Math.max(1,rect.width),h=Math.max(1,rect.height),dpr=Math.min(2,globalThis.devicePixelRatio||1);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalAlpha=1;ctx.fillStyle=background;ctx.fillRect(0,0,canvas.width/dpr,canvas.height/dpr);
    if(state.mode==='slice'){
      displayedWithWebGL=false;
      const frame=createFieldFrame(grid.bounds),axes=state.plane.split('').map(c=>'xyz'.indexOf(c)),fixed=[0,1,2].find(i=>!axes.includes(i))??0,pixels=110,span=Math.min(w-34,h-24),left=(w-span)/2,top=(h-span)/2;
      for(let j=0;j<pixels;j++)for(let i=0;i<pixels;i++){
        const point:Point3=[...frame.center];point[fixed]=frame.center[fixed]+state.slice*frame.half[fixed];
        point[axes[0]]=grid.bounds[axes[0]][0]+(i+.5)/pixels*(grid.bounds[axes[0]][1]-grid.bounds[axes[0]][0]);
        point[axes[1]]=grid.bounds[axes[1]][1]-(j+.5)/pixels*(grid.bounds[axes[1]][1]-grid.bounds[axes[1]][0]);
        const value=field.evaluate(point),weight=field.weight(value);ctx.globalAlpha=Math.min(1,Math.pow(weight/(grid.maxWeight||1),.3));
        ctx.fillStyle=color(value);ctx.fillRect(left+i*span/pixels,top+j*span/pixels,span/pixels+1,span/pixels+1);
      }
      ctx.globalAlpha=1;ctx.fillStyle='#c7d9dc';ctx.font='11px system-ui';ctx.fillText(state.plane[0],left+span-10,top+span/2-8);ctx.fillText(state.plane[1],left+span/2+8,top+14);
      ctx.strokeStyle='#a6c1c444';ctx.beginPath();ctx.moveTo(left,top+span/2);ctx.lineTo(left+span,top+span/2);ctx.moveTo(left+span/2,top);ctx.lineTo(left+span/2,top+span);ctx.stroke();
    }else{
      const level=state.iso*grid.maxWeight;if(state.mode==='surface'&&surfaceLevel!==level){surface=level?scalarIsosurface(grid,level):[];surfaceLevel=level;}
      const frame=createFieldFrame(grid.bounds);drawingGpu=true;const rendered=gpu.draw({width:w,height:h,dpr,frame,view:state,mode:state.mode,cloud,surface});drawingGpu=false;displayedWithWebGL=rendered;
      if(rendered){ctx.drawImage(backing,0,0,backing.width,backing.height,0,0,w,h);ctx.globalAlpha=1;ctx.lineWidth=1;ctx.font='11px system-ui';const origin=pointProjection(frame.center,w,h);for(let axis=0;axis<3;axis++){const p:Point3=[...frame.center];p[axis]+=frame.half[axis]*.45;const end=pointProjection(p,w,h);ctx.strokeStyle='#c7e1e26b';ctx.beginPath();ctx.moveTo(origin[0],origin[1]);ctx.lineTo(end[0],end[1]);ctx.stroke();ctx.fillStyle='#d1e0e2';ctx.fillText('xyz'[axis],end[0]+4,end[1]);}}
    }
    ctx.globalAlpha=1;publishBackend();
  }
  function setState(next:Partial<FieldView>){state=validateFieldView(next);draw();onChange(getState());}
  const getState=()=>({...state});
  canvas.addEventListener('pointerdown',event=>{if(state.mode==='slice')return;drag={x:event.clientX,y:event.clientY};canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointermove',event=>{if(!drag)return;setState({...state,yaw:Math.max(-100,Math.min(100,state.yaw+(event.clientX-drag.x)*.01)),pitch:Math.max(-1.5,Math.min(1.5,state.pitch+(event.clientY-drag.y)*.01))});drag={x:event.clientX,y:event.clientY};});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,()=>{drag=null;});
  canvas.addEventListener('wheel',event=>{if(state.mode==='slice')return;event.preventDefault();setState({...state,zoom:Math.max(.5,Math.min(4,state.zoom*Math.exp(-event.deltaY*.001)))});},{passive:false});
  canvas.addEventListener('keydown',event=>{const actions:Record<string,['yaw'|'pitch'|'zoom',number]>={ArrowLeft:['yaw',-.1],ArrowRight:['yaw',.1],ArrowUp:['pitch',-.1],ArrowDown:['pitch',.1],'+':['zoom',.1],'-':['zoom',-.1]};const action=actions[event.key];if(!action)return;event.preventDefault();event.stopPropagation();const next={...state,[action[0]]:state[action[0]]+action[1]};if(next.zoom>=.5&&next.zoom<=4&&Math.abs(next.pitch)<=1.5&&Math.abs(next.yaw)<=100)setState(next);});
  const observer=new ResizeObserver(draw);observer.observe(container);
  return {
    getState,setState,reset(){setState(DEFAULT_FIELD_VIEW);},seek(timeMs=0){if(!Number.isFinite(timeMs)||timeMs<0)throw new RangeError('Invalid view time');draw();},
    setField(next:FieldDefinition){
      if(typeof next?.evaluate!=='function'||typeof next.weight!=='function')throw new TypeError('Field evaluator and weight required');
      const nextGrid=createScalarGrid(next),nextCloud=weightedCloud(nextGrid,{count:6500,seed:17}).map(item=>({...item,value:next.evaluate(item.point)}));
      field=next;grid=nextGrid;cloud=nextCloud;surfaceLevel=null;surface=[];draw();
    },
    inspect(){return {view:getState(),backend:{...backendSnapshot()},gridResolution:grid?.resolution??0,bounds:grid?.bounds.map(p=>[...p])??null,maxWeight:grid?.maxWeight??0,gridIntegral:grid?.integral??0,pointCount:cloud.length,triangleCount:surface.length};},
    dispose(){disposed=true;observer.disconnect();gpu.dispose();canvas.remove();backing.remove();},
  };
}
