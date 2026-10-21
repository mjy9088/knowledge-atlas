import type {PresentationState} from './presentation-contract.js';

export type PresentationStore={
  readonly getState:()=>PresentationState;
  readonly setState:(value:unknown)=>void;
  readonly reset:()=>void;
  readonly seek:(id:string,timeMs:number)=>void;
};

function record(value:unknown):value is Record<string,unknown>{
  return Boolean(value)&&typeof value==='object'&&!Array.isArray(value);
}

export function createPresentationStore(durations:Readonly<Record<string,number>>):PresentationStore{
  const ids=Object.keys(durations);
  if(ids.some(id=>!id||!Number.isFinite(durations[id])||durations[id]<0))throw new RangeError('Invalid presentation definitions');
  let positions:Record<string,number>=Object.fromEntries(ids.map(id=>[id,0]));
  const parse=(value:unknown):Record<string,number>=>{
    if(!record(value)||value['version']!==1||!record(value['positions'])||Object.keys(value).some(key=>key!=='version'&&key!=='positions'))throw new RangeError('Invalid presentation state');
    const candidate=value['positions'];
    if(Object.keys(candidate).length!==ids.length||ids.some(id=>{
      const position=candidate[id],duration=durations[id];
      return typeof position!=='number'||!Number.isFinite(position)||position<0||duration===undefined||position>duration;
    }))throw new RangeError('Invalid presentation positions');
    const parsed:Record<string,number>={};
    for(const id of ids){const position=candidate[id];if(typeof position!=='number')throw new RangeError('Invalid position');parsed[id]=position;}
    return parsed;
  };
  return{
    getState:()=>({version:1,positions:{...positions}}),
    setState(value:unknown){positions=parse(value);},
    reset(){positions=Object.fromEntries(ids.map(id=>[id,0]));},
    seek(id:string,timeMs:number){
      const duration=durations[id];
      if(duration===undefined||!Number.isFinite(timeMs)||timeMs<0||timeMs>duration)throw new RangeError('Invalid presentation position');
      positions={...positions,[id]:timeMs};
    },
  };
}
