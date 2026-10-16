/** Independent array implementation; one probe compares a target with one array item. */
export interface BinarySearchInput {size:string;target:string}
export interface SearchFrame {low:number;high:number;remaining:number;comparisons:number;status:'searching'|'found'|'absent';probe:number|null;relation:'less'|'equal'|'greater'|null}
export type SearchAnalysis={valid:false;message:string;frames:[]}|{valid:true;size:number;target:number;values:number[];frames:SearchFrame[];maxComparisons:number};
export function worstCaseProbes(size:number):number{
  if(!Number.isInteger(size)||size<1||size>1024)throw new RangeError('Size must be 1–1024');
  return Math.floor(Math.log2(size))+1;
}
export function analyzeBinarySearch(input:BinarySearchInput):SearchAnalysis{
  if(typeof input?.size!=='string'||typeof input?.target!=='string'||input.size.length>16||input.target.length>16||!/^\d+$/.test(input.size)||!/^\d+$/.test(input.target))return {valid:false,message:'개수와 찾을 값에 정수를 입력하세요.',frames:[]};
  const size=Number(input.size),target=Number(input.target);
  if(!Number.isInteger(size)||size<1||size>1024)return {valid:false,message:'개수는 1–1024 사이의 정수로 입력하세요.',frames:[]};
  if(!Number.isInteger(target)||target<1||target>2*size+1)return {valid:false,message:`찾을 값은 1–${2*size+1} 사이의 정수로 입력하세요. 홀수는 목록에 없습니다.`,frames:[]};
  const values=Array.from({length:size},(_,index)=>2*(index+1));
  let low=0,high=size-1,comparisons=0;
  const frames:SearchFrame[]=[{low,high,remaining:size,comparisons,status:'searching',probe:null,relation:null}];
  while(low<=high){
    const probe=low+Math.floor((high-low)/2),value=values[probe];comparisons++;
    const relation=target<value?'less':target>value?'greater':'equal';
    if(relation==='equal'){frames.push({low:probe,high:probe,remaining:1,comparisons,status:'found',probe,relation});break;}
    if(relation==='less')high=probe-1;else low=probe+1;
    frames.push({low,high,remaining:Math.max(0,high-low+1),comparisons,status:low>high?'absent':'searching',probe,relation});
  }
  return {valid:true,size,target,values,frames,maxComparisons:worstCaseProbes(size)};
}
