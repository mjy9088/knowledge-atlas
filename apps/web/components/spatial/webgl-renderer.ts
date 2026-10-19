import type {FieldSample} from '/packages/spatial/scalar-field.js';
import type {FieldView,RenderBackend} from './field-viewer.js';
import type {FieldFrame} from './field-camera.js';
import {sortCloudBackToFront} from './field-camera.js';
import {packCloudVertices,packSurfaceVertices} from './webgl-data.js';

type Color=[number,number,number,number];
type DrawInput={readonly width:number;readonly height:number;readonly dpr:number;readonly frame:FieldFrame;readonly view:FieldView;readonly mode:'cloud'|'surface';readonly cloud:readonly FieldSample[];readonly surface:readonly (readonly FieldSample[])[]};
type Resources={readonly program:WebGLProgram;readonly buffer:WebGLBuffer;readonly position:number;readonly value:number;readonly normal:number;readonly scale:WebGLUniformLocation;readonly center:WebGLUniformLocation;readonly depthRadius:WebGLUniformLocation;readonly yawPitch:WebGLUniformLocation;readonly colors:WebGLUniformLocation;readonly pointMode:WebGLUniformLocation;readonly pointSize:WebGLUniformLocation};
export type WebGLRenderer={readonly canvas:HTMLCanvasElement;draw:(input:DrawInput)=>boolean;inspect:()=>RenderBackend;dispose:()=>void};
type Options={readonly canvas:HTMLCanvasElement;readonly colors:readonly [Color,Color];readonly background:Color;readonly createContext?:(canvas:HTMLCanvasElement)=>WebGL2RenderingContext|null;readonly onStatusChange:(backend:RenderBackend)=>void;readonly onRedraw:()=>void};

const VERTEX=`#version 300 es
in vec3 a_position;in float a_value;in vec3 a_normal;
uniform vec2 u_scale;uniform vec3 u_center;uniform float u_depth_radius;uniform vec2 u_yaw_pitch;uniform bool u_points;uniform float u_point_size;
out float v_value;flat out vec3 v_normal;
void main(){vec3 centered=a_position-u_center;float cy=cos(u_yaw_pitch.x),sy=sin(u_yaw_pitch.x),cp=cos(u_yaw_pitch.y),sp=sin(u_yaw_pitch.y);vec3 p=vec3(cy*centered.x+sy*centered.z,centered.y,-sy*centered.x+cy*centered.z);vec3 n=vec3(cy*a_normal.x+sy*a_normal.z,a_normal.y,-sy*a_normal.x+cy*a_normal.z);p=vec3(p.x,cp*p.y-sp*p.z,sp*p.y+cp*p.z);n=vec3(n.x,cp*n.y-sp*n.z,sp*n.y+cp*n.z);gl_Position=vec4(p.x*u_scale.x,p.y*u_scale.y,-p.z/u_depth_radius,1.0);gl_PointSize=u_point_size;v_value=a_value;v_normal=n;}`;
const FRAGMENT=`#version 300 es
precision mediump float;in float v_value;flat in vec3 v_normal;uniform vec4 u_colors[2];uniform bool u_points;out vec4 outColor;
void main(){vec4 color=v_value<0.0?u_colors[1]:u_colors[0];if(u_points){vec2 p=gl_PointCoord*2.0-1.0;if(dot(p,p)>1.0)discard;outColor=vec4(color.rgb,.58);return;}float light=.34+.66*abs(dot(normalize(v_normal),normalize(vec3(.35,.55,.76))));outColor=vec4(color.rgb*light,1.0);}`;

function shader(gl:WebGL2RenderingContext,type:number,source:string):WebGLShader|null{
  const result=gl.createShader(type);if(!result)return null;gl.shaderSource(result,source);gl.compileShader(result);
  if(gl.getShaderParameter(result,gl.COMPILE_STATUS)===true)return result;gl.deleteShader(result);return null;
}
function resources(gl:WebGL2RenderingContext):Resources|null{
  const vertex=shader(gl,gl.VERTEX_SHADER,VERTEX);if(!vertex)return null;const fragment=shader(gl,gl.FRAGMENT_SHADER,FRAGMENT);if(!fragment){gl.deleteShader(vertex);return null;}
  const program=gl.createProgram();if(!program){gl.deleteShader(vertex);gl.deleteShader(fragment);return null;}
  gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);
  const buffer=gl.createBuffer(),scale=gl.getUniformLocation(program,'u_scale'),center=gl.getUniformLocation(program,'u_center'),depthRadius=gl.getUniformLocation(program,'u_depth_radius'),yawPitch=gl.getUniformLocation(program,'u_yaw_pitch'),colors=gl.getUniformLocation(program,'u_colors'),pointMode=gl.getUniformLocation(program,'u_points'),pointSize=gl.getUniformLocation(program,'u_point_size');
  const position=gl.getAttribLocation(program,'a_position'),value=gl.getAttribLocation(program,'a_value'),normal=gl.getAttribLocation(program,'a_normal');
  if(gl.getProgramParameter(program,gl.LINK_STATUS)!==true||!buffer||!scale||!center||!depthRadius||!yawPitch||!colors||!pointMode||!pointSize||position<0||value<0||normal<0){if(buffer)gl.deleteBuffer(buffer);gl.deleteProgram(program);return null;}
  return{program,buffer,position,value,normal,scale,center,depthRadius,yawPitch,colors,pointMode,pointSize};
}
function deleteResources(gl:WebGL2RenderingContext,current:Resources|null):void{if(!current)return;gl.deleteBuffer(current.buffer);gl.deleteProgram(current.program);}

export function createWebGLRenderer(options:Options):WebGLRenderer{
  const {canvas}=options;let disposed=false,status:RenderBackend={requested:'webgl2',active:'none',status:'unavailable'};
  let gl=(options.createContext??(target=>target.getContext('webgl2',{alpha:false,antialias:true,preserveDrawingBuffer:true})))(canvas);
  let current=gl?resources(gl):null;
  const report=(next:RenderBackend)=>{if(next.requested===status.requested&&next.active===status.active&&next.status===status.status)return;status={...next};options.onStatusChange({...next});};
  if(gl&&current)report({requested:'webgl2',active:'none',status:'ready'});else if(gl)report({requested:'webgl2',active:'none',status:'failed'});else options.onStatusChange({...status});
  const lost=(event:Event)=>{event.preventDefault();if(disposed)return;current=null;report({requested:'webgl2',active:'none',status:'context-lost'});options.onRedraw();};
  const restored=()=>{if(disposed||!gl)return;current=resources(gl);if(!current)report({requested:'webgl2',active:'none',status:'failed'});options.onRedraw();if(current&&status.status==='context-lost')report({requested:'webgl2',active:'none',status:'ready'});};
  canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);
  return{
    canvas,
    draw(input){
      if(disposed||!gl||!current)return false;
      const width=Math.max(1,Math.round(input.width*input.dpr)),height=Math.max(1,Math.round(input.height*input.dpr));if(canvas.width!==width)canvas.width=width;if(canvas.height!==height)canvas.height=height;
      const data=input.mode==='cloud'?packCloudVertices(sortCloudBackToFront(input.cloud,input.frame,input.view)):packSurfaceVertices(input.surface),stride=(input.mode==='cloud'?4:7)*4;
      gl.viewport(0,0,width,height);gl.clearColor(...options.background);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(current.program);gl.bindBuffer(gl.ARRAY_BUFFER,current.buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(current.position);gl.vertexAttribPointer(current.position,3,gl.FLOAT,false,stride,0);gl.enableVertexAttribArray(current.value);gl.vertexAttribPointer(current.value,1,gl.FLOAT,false,stride,12);
      if(input.mode==='surface'){gl.enableVertexAttribArray(current.normal);gl.vertexAttribPointer(current.normal,3,gl.FLOAT,false,stride,16);}else{gl.disableVertexAttribArray(current.normal);gl.vertexAttrib3f(current.normal,0,0,1);}
      const minimum=Math.min(width,height),zoom=input.view.zoom/input.frame.halfExtent;gl.uniform2f(current.scale,minimum*zoom/width,minimum*zoom/height);gl.uniform3f(current.center,...input.frame.center);gl.uniform1f(current.depthRadius,input.frame.depthRadius);gl.uniform2f(current.yawPitch,input.view.yaw,input.view.pitch);gl.uniform4fv(current.colors,new Float32Array([...options.colors[0],...options.colors[1]]));gl.uniform1i(current.pointMode,input.mode==='cloud'?1:0);gl.uniform1f(current.pointSize,3.2*input.dpr);
      if(input.mode==='cloud'){gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.drawArrays(gl.POINTS,0,input.cloud.length);}else{gl.disable(gl.BLEND);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.drawArrays(gl.TRIANGLES,0,input.surface.length*3);}
      gl.finish();const error=gl.getError();if(error===gl.NO_ERROR){report({requested:'webgl2',active:'webgl2',status:'ready'});return true;}if(gl.isContextLost()){current=null;report({requested:'webgl2',active:'none',status:'context-lost'});return false;}deleteResources(gl,current);current=null;report({requested:'webgl2',active:'none',status:'failed'});return false;
    },
    inspect:()=>({...status}),
    dispose(){if(disposed)return;disposed=true;canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);if(gl&&!gl.isContextLost())deleteResources(gl,current);current=null;gl=null;},
  };
}

export function resolveCssColor(container:HTMLElement,value:string):Color{
  const sample=container.ownerDocument.createElement('span');sample.style.color=value;container.append(sample);const computed=container.ownerDocument.defaultView?.getComputedStyle(sample).color??'rgb(0, 0, 0)';sample.remove();
  const values=computed.match(/[\d.]+/g)?.map(Number)??[0,0,0,1];return[(values[0]??0)/255,(values[1]??0)/255,(values[2]??0)/255,values[3]??1];
}
