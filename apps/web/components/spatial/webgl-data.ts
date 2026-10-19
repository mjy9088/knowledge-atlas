import type {FieldSample,Point3} from '/packages/spatial/scalar-field.js';

export function packCloudVertices(samples:readonly FieldSample[]):Float32Array{
  const packed=new Float32Array(samples.length*4);
  samples.forEach(({point,value},index)=>packed.set([point[0],point[1],point[2],value],index*4));
  return packed;
}

function triangleNormal(a:Point3,b:Point3,c:Point3):Point3{
  const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];
  const x=uy*vz-uz*vy,y=uz*vx-ux*vz,z=ux*vy-uy*vx,length=Math.hypot(x,y,z)||1;
  return [x/length,y/length,z/length];
}

export function packSurfaceVertices(triangles:readonly (readonly FieldSample[])[]):Float32Array{
  const packed=new Float32Array(triangles.length*21);
  triangles.forEach((triangle,index)=>{
    const first=triangle[0],second=triangle[1],third=triangle[2];
    if(!first||!second||!third)return;
    const normal=triangleNormal(first.point,second.point,third.point),faceValue=triangle.reduce((sum,vertex)=>sum+vertex.value,0);
    triangle.forEach((vertex,vertexIndex)=>packed.set([...vertex.point,faceValue,...normal],index*21+vertexIndex*7));
  });
  return packed;
}
