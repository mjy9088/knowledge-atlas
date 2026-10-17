/** Finite teaching models; these are declared experiments, not population statistics. */
export function familyObservation(mode:'filter'|'child'){
  if(mode!=='filter'&&mode!=='child')throw Error('Unknown family observation');
  const rows=['BB','BG','GB','GG'].map(family=>{const boys=[...family].filter(x=>x==='B').length,likelihood=mode==='filter'?Number(boys>0):boys/2;return{family,prior:1/4,likelihood,mass:likelihood/4};});
  const denominator=rows.reduce((n,r)=>n+r.mass,0);return rows.map(r=>({...r,posterior:r.mass/denominator}));
}
export function montyObservation(mode:'informed'|'blind',specificDoor?:2|3,tieProbability=0.5){
  if(!['informed','blind'].includes(mode)||(![undefined,2,3].includes(specificDoor))||!Number.isFinite(tieProbability)||tieProbability<0||tieProbability>1)throw Error('Invalid Monty protocol');
  const rows:{prize:number;opened:number;mass:number;switchWins:boolean}[]=[];
  for(const prize of [1,2,3])for(const opened of [2,3]){
    if(opened===prize||specificDoor!==undefined&&opened!==specificDoor)continue;
    const likelihood=mode==='blind'?0.5:prize===1?(opened===2?tieProbability:1-tieProbability):1;
    if(likelihood>0)rows.push({prize,opened,mass:likelihood/3,switchWins:prize!==1});
  }
  const denominator=rows.reduce((n,r)=>n+r.mass,0),winning=rows.filter(r=>r.switchWins).reduce((n,r)=>n+r.mass,0);
  return{rows,denominator,switchProbability:denominator?winning/denominator:null};
}
