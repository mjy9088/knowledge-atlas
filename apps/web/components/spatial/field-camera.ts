import type {FieldSample} from '/packages/spatial/scalar-field.js';
import type {FieldView} from './field-viewer.js';

type Bounds=readonly (readonly number[])[];
type Vector3=readonly [number,number,number];
export type FieldFrame={readonly center:Vector3;readonly half:Vector3;readonly halfExtent:number;readonly depthRadius:number};
type Projection={readonly frame:FieldFrame;readonly view:Pick<FieldView,'yaw'|'pitch'|'zoom'>;readonly width:number;readonly height:number};

export function createFieldFrame(bounds:Bounds):FieldFrame{
  const axis=(index:number):readonly [number,number]=>{const pair=bounds[index],low=pair?.[0],high=pair?.[1];if(!Number.isFinite(low)||!Number.isFinite(high)||low===undefined||high===undefined||low>=high)throw new RangeError('Invalid field frame bounds');return[low,high];};
  const x=axis(0),y=axis(1),z=axis(2),center:Vector3=[(x[0]+x[1])/2,(y[0]+y[1])/2,(z[0]+z[1])/2],half:Vector3=[(x[1]-x[0])/2,(y[1]-y[0])/2,(z[1]-z[0])/2];
  return{center,half,halfExtent:Math.max(...half),depthRadius:Math.hypot(...half)};
}

export function cameraCoordinates(point:readonly number[],frame:FieldFrame,view:Pick<FieldView,'yaw'|'pitch'>):[number,number,number]{
  const x=point[0]-frame.center[0],y=point[1]-frame.center[1],z=point[2]-frame.center[2],cy=Math.cos(view.yaw),sy=Math.sin(view.yaw),cp=Math.cos(view.pitch),sp=Math.sin(view.pitch);
  const rotatedX=cy*x+sy*z,rotatedZ=-sy*x+cy*z;
  return[rotatedX,cp*y-sp*rotatedZ,sp*y+cp*rotatedZ];
}

export function normalizedCameraDepth(point:readonly number[],frame:FieldFrame,view:Pick<FieldView,'yaw'|'pitch'>):number{return cameraCoordinates(point,frame,view)[2]/frame.depthRadius;}

export function projectFieldPoint(point:readonly number[],{frame,view,width,height}:Projection):[number,number,number]{
  const [x,y,depth]=cameraCoordinates(point,frame,view),scale=Math.min(width,height)*view.zoom/(2*frame.halfExtent);
  return[width/2+x*scale,height/2-y*scale,depth/frame.depthRadius];
}

export function sortCloudBackToFront(samples:readonly FieldSample[],frame:FieldFrame,view:Pick<FieldView,'yaw'|'pitch'>):FieldSample[]{return[...samples].sort((a,b)=>normalizedCameraDepth(a.point,frame,view)-normalizedCameraDepth(b.point,frame,view));}
