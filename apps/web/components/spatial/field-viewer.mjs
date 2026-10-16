import {createScalarGrid,weightedCloud,scalarIsosurface} from '/packages/spatial/scalar-field.mjs';

export const DEFAULT_FIELD_VIEW=Object.freeze({yaw:-.65,pitch:.45,zoom:1.65,mode:'cloud',plane:'xz',slice:0,iso:.035});
export function validateFieldView(input){
  const state={...DEFAULT_FIELD_VIEW,...input};
  if(!['cloud','slice','surface'].includes(state.mode)||!['xy','xz','yz'].includes(state.plane)||!['yaw','pitch','zoom','slice','iso'].every(key=>Number.isFinite(state[key]))||Math.abs(state.yaw)>100||Math.abs(state.pitch)>1.5||state.zoom<.5||state.zoom>4||Math.abs(state.slice)>1||state.iso<.005||state.iso>1)throw new RangeError('Invalid field view state');
  return Object.fromEntries(Object.keys(DEFAULT_FIELD_VIEW).map(key=>[key,state[key]]));
}
export function mountFieldViewer(container,{label='Spatial scalar field',onChange=()=>{},colors=['#65e2d5','#ffa86b']}={}){
  const doc=container.ownerDocument,canvas=doc.createElement('canvas');canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',label);canvas.className='field-canvas';container.append(canvas);
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas 2D is unavailable');
  let state={...DEFAULT_FIELD_VIEW},field,grid,cloud=[],surface=[],surfaceLevel=null,drag=null,disposed=false;
  function pointProjection([x,y,z],w,h){
    const cy=Math.cos(state.yaw),sy=Math.sin(state.yaw),cp=Math.cos(state.pitch),sp=Math.sin(state.pitch);
    const X=cy*x+sy*z,Z=-sy*x+cy*z,Y=cp*y-sp*Z,depth=sp*y+cp*Z;
    const extent=Math.max(...grid.bounds.map(([a,b])=>Math.max(Math.abs(a),Math.abs(b)))),scale=Math.min(w,h)*state.zoom/(2*extent);
    return [w/2+X*scale,h/2-Y*scale,depth];
  }
  const color=value=>value<0?colors[1]:colors[0];
  function draw(){
    if(disposed||!field)return;
    const rect=canvas.getBoundingClientRect(),w=Math.max(1,rect.width),h=Math.max(1,rect.height),dpr=Math.min(2,globalThis.devicePixelRatio||1);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#101e29';ctx.fillRect(0,0,w,h);
    if(state.mode==='slice'){
      const axes=state.plane.split('').map(c=>'xyz'.indexOf(c)),fixed=[0,1,2].find(i=>!axes.includes(i)),pixels=110,span=Math.min(w-34,h-24),left=(w-span)/2,top=(h-span)/2;
      for(let j=0;j<pixels;j++)for(let i=0;i<pixels;i++){
        const point=[0,0,0];point[fixed]=state.slice*Math.max(...grid.bounds[fixed].map(Math.abs));
        point[axes[0]]=grid.bounds[axes[0]][0]+(i+.5)/pixels*(grid.bounds[axes[0]][1]-grid.bounds[axes[0]][0]);
        point[axes[1]]=grid.bounds[axes[1]][1]-(j+.5)/pixels*(grid.bounds[axes[1]][1]-grid.bounds[axes[1]][0]);
        const value=field.evaluate(point),weight=field.weight(value);ctx.globalAlpha=Math.min(1,Math.pow(weight/(grid.maxWeight||1),.3));
        ctx.fillStyle=color(value);ctx.fillRect(left+i*span/pixels,top+j*span/pixels,span/pixels+1,span/pixels+1);
      }
      ctx.globalAlpha=1;ctx.fillStyle='#c7d9dc';ctx.font='11px system-ui';ctx.fillText(state.plane[0],left+span-10,top+span/2-8);ctx.fillText(state.plane[1],left+span/2+8,top+14);
      ctx.strokeStyle='#a6c1c444';ctx.beginPath();ctx.moveTo(left,top+span/2);ctx.lineTo(left+span,top+span/2);ctx.moveTo(left+span/2,top);ctx.lineTo(left+span/2,top+span);ctx.stroke();
    }else{
      if(state.mode==='cloud'){
        const projected=cloud.map(item=>({p:pointProjection(item.point,w,h),value:item.value})).sort((a,b)=>a.p[2]-b.p[2]);
        ctx.globalAlpha=.5;
        for(const item of projected){ctx.fillStyle=color(item.value);ctx.fillRect(item.p[0],item.p[1],1.55,1.55);}
      }else{
        const level=state.iso*grid.maxWeight;
        if(surfaceLevel!==level){surface=level?scalarIsosurface(grid,level):[];surfaceLevel=level;}
        const projected=surface.map(triangle=>({points:triangle.map(v=>pointProjection(v.point,w,h)),value:triangle.reduce((s,v)=>s+v.value,0)}));
        projected.sort((a,b)=>a.points.reduce((s,v)=>s+v[2],0)-b.points.reduce((s,v)=>s+v[2],0));ctx.globalAlpha=.8;
        for(const face of projected){ctx.fillStyle=color(face.value);ctx.beginPath();face.points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();}
      }
      ctx.globalAlpha=1;ctx.lineWidth=1;ctx.font='11px system-ui';
      const origin=pointProjection([0,0,0],w,h),length=grid.bounds[0][1]*.45;
      for(let axis=0;axis<3;axis++){const p=[0,0,0];p[axis]=length;const end=pointProjection(p,w,h);ctx.strokeStyle='#c7e1e26b';ctx.beginPath();ctx.moveTo(...origin.slice(0,2));ctx.lineTo(...end.slice(0,2));ctx.stroke();ctx.fillStyle='#d1e0e2';ctx.fillText('xyz'[axis],end[0]+4,end[1]);}
    }
    ctx.globalAlpha=1;
  }
  function setState(next){state=validateFieldView(next);draw();onChange(getState());}
  const getState=()=>({...state});
  canvas.addEventListener('pointerdown',event=>{if(state.mode==='slice')return;drag={x:event.clientX,y:event.clientY};canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointermove',event=>{if(!drag)return;setState({...state,yaw:Math.max(-100,Math.min(100,state.yaw+(event.clientX-drag.x)*.01)),pitch:Math.max(-1.5,Math.min(1.5,state.pitch+(event.clientY-drag.y)*.01))});drag={x:event.clientX,y:event.clientY};});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,()=>{drag=null;});
  canvas.addEventListener('wheel',event=>{if(state.mode==='slice')return;event.preventDefault();setState({...state,zoom:Math.max(.5,Math.min(4,state.zoom*Math.exp(-event.deltaY*.001)))});},{passive:false});
  canvas.addEventListener('keydown',event=>{const action={ArrowLeft:['yaw',-.1],ArrowRight:['yaw',.1],ArrowUp:['pitch',-.1],ArrowDown:['pitch',.1],'+':['zoom',.1],'-':['zoom',-.1]}[event.key];if(!action)return;event.preventDefault();event.stopPropagation();const next={...state,[action[0]]:state[action[0]]+action[1]};if(next.zoom>=.5&&next.zoom<=4&&Math.abs(next.pitch)<=1.5&&Math.abs(next.yaw)<=100)setState(next);});
  const observer=new ResizeObserver(draw);observer.observe(container);
  return {
    getState,setState,reset(){setState(DEFAULT_FIELD_VIEW);},seek(timeMs=0){if(!Number.isFinite(timeMs)||timeMs<0)throw new RangeError('Invalid view time');draw();},
    setField(next){
      if(typeof next?.evaluate!=='function'||typeof next.weight!=='function')throw new TypeError('Field evaluator and weight required');
      const nextGrid=createScalarGrid(next),nextCloud=weightedCloud(nextGrid,{count:6500,seed:17}).map(item=>({...item,value:next.evaluate(item.point)}));
      field=next;grid=nextGrid;cloud=nextCloud;surfaceLevel=null;surface=[];draw();
    },
    inspect(){return {view:getState(),gridResolution:grid?.resolution??0,bounds:grid?.bounds.map(p=>[...p])??null,maxWeight:grid?.maxWeight??0,gridIntegral:grid?.integral??0,pointCount:cloud.length,triangleCount:surface.length};},
    dispose(){disposed=true;observer.disconnect();canvas.remove();},
  };
}
