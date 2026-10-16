// Generic finite-volume sampling and isosurface geometry; no topic-specific physics.
export function createScalarGrid({evaluate,weight=value=>value*value,bounds,resolution=30}){
  if(typeof evaluate!=='function'||typeof weight!=='function'||!Number.isInteger(resolution)||resolution<4||resolution>64||!Array.isArray(bounds)||bounds.length!==3||bounds.some(pair=>!Array.isArray(pair)||pair.length!==2||!pair.every(Number.isFinite)||pair[0]>=pair[1]))throw new TypeError('Invalid scalar grid configuration');
  const size=resolution+1,step=bounds.map(([a,b])=>(b-a)/resolution),values=new Float64Array(size**3),weights=new Float64Array(size**3);
  const index=(x,y,z)=>x+size*(y+size*z),point=(x,y,z)=>[x,y,z].map((v,i)=>bounds[i][0]+v*step[i]);
  let maxWeight=0,totalWeight=0;
  for(let z=0;z<size;z++)for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const i=index(x,y,z),value=evaluate(point(x,y,z)),w=weight(value);
    if(!Number.isFinite(value)||!Number.isFinite(w)||w<0)throw new RangeError('Field values/weights must be finite, weights nonnegative');
    values[i]=value;weights[i]=w;maxWeight=Math.max(maxWeight,w);
    totalWeight+=w*([x,y,z].reduce((v,c)=>v*(c===0||c===resolution ? .5 : 1),1));
  }
  return {size,resolution,step,bounds:bounds.map(p=>[...p]),values,weights,maxWeight,index,point,integral:totalWeight*step.reduce((a,b)=>a*b,1)};
}
export function weightedCloud(grid,{count=6500,seed=17}={}){
  if(!Number.isInteger(count)||count<0||count>30000||!Number.isInteger(seed))throw new RangeError('Invalid cloud sampling state');
  let randomState=seed>>>0;const random=()=>{randomState=(1664525*randomState+1013904223)>>>0;return randomState/4294967296;};
  const cdf=new Float64Array(grid.weights.length);let sum=0;
  for(let i=0;i<cdf.length;i++){
    const x=i%grid.size,y=Math.floor(i/grid.size)%grid.size,z=Math.floor(i/(grid.size**2));
    sum+=grid.weights[i]*[x,y,z].reduce((v,c)=>v*(c===0||c===grid.resolution ? .5 : 1),1);cdf[i]=sum;
  }
  if(sum===0)return [];
  const points=[];
  for(let i=0;i<count;i++){
    const target=random()*sum;let low=0,high=cdf.length-1;
    while(low<high){const middle=(low+high)>>>1;if(cdf[middle]<=target)low=middle+1;else high=middle;}
    const cell=[low%grid.size,Math.floor(low/grid.size)%grid.size,Math.floor(low/(grid.size**2))];
    const point=cell.map((c,axis)=>{
      const a=Math.max(0,c-.5),b=Math.min(grid.resolution,c+.5);
      return grid.bounds[axis][0]+(a+random()*(b-a))*grid.step[axis];
    });
    points.push({point,value:grid.values[low]});
  }
  return points;
}
const corners=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
const tetrahedra=[[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6],[0,5,1,6]];
export function scalarIsosurface(grid,level){
  if(!Number.isFinite(level)||level<=0)throw new RangeError('A positive isovalue is required');
  const triangles=[];
  for(let z=0;z<grid.resolution;z++)for(let y=0;y<grid.resolution;y++)for(let x=0;x<grid.resolution;x++){
    const vertices=corners.map(([a,b,c])=>({point:grid.point(x+a,y+b,z+c),value:grid.values[grid.index(x+a,y+b,z+c)],weight:grid.weights[grid.index(x+a,y+b,z+c)]}));
    for(const tetra of tetrahedra){
      const inside=tetra.filter(i=>vertices[i].weight>=level),outside=tetra.filter(i=>vertices[i].weight<level);
      if(!inside.length||!outside.length)continue;
      const edge=(a,b)=>{const A=vertices[a],B=vertices[b],t=(level-A.weight)/(B.weight-A.weight);return {point:A.point.map((v,i)=>v+t*(B.point[i]-v)),value:A.value+t*(B.value-A.value)};};
      if(inside.length===1||outside.length===1){const one=inside.length===1?inside:outside,others=inside.length===1?outside:inside;triangles.push(others.map(i=>edge(one[0],i)));}
      else {const [a,b]=inside,[c,d]=outside,A=edge(a,c),B=edge(a,d),C=edge(b,c),D=edge(b,d);triangles.push([A,B,C],[B,D,C]);}
    }
  }
  return triangles;
}
