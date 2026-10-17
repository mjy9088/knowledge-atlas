import {readFileSync,writeFileSync,existsSync,lstatSync} from 'node:fs';
import path from 'node:path';
import type {Plan} from './contracts.js';

/** Preserve prose and artwork; opt in to a registered adapter without evaluating page code. */
export function planInteractionInstallation(directory:string,plan:Plan){
 if(!['binary-relations','monty-hall','two-children'].includes(plan.id))throw Error('이 콘텐츠의 상호작용은 별도 설계가 필요합니다.');
 const relative=path.join('content',plan.domain,plan.id,'page.ts');let part=directory;for(const item of relative.split(path.sep)){part=path.join(part,item);if(existsSync(part)&&lstatSync(part).isSymbolicLink())throw Error('Linked interaction source');}
 const file=path.join(directory,relative),source=readFileSync(file,'utf8'),match=/export default (\{[\s\S]*\}) satisfies ContentPage;\s*$/.exec(source);
 if(!match)throw Error('직접 편집된 page.ts를 보존했습니다. 구현 요청으로 상호작용을 연결하세요.');
 const page:unknown=JSON.parse(match[1]);if(!page||typeof page!=='object'||!('scenes'in page)||!Array.isArray(page.scenes))throw Error('Invalid page');
 const p=page as {interactive?:unknown;styles?:unknown;scenes:{id:string;suggestion?:unknown}[]};
 if(p.interactive&&p.interactive!==plan.id)throw Error('기존 상호작용을 보존했습니다. 구현 요청을 이용하세요.');
 if(p.styles!==undefined&&(!Array.isArray(p.styles)||p.styles.some(s=>typeof s!=='string')))throw Error('Invalid styles');
 for(const scene of p.scenes){if(!scene||typeof scene.id!=='string')throw Error('Invalid scene');if(scene.suggestion&&JSON.stringify(scene.suggestion)!==JSON.stringify({example:scene.id}))throw Error('기존 장면 상태 제안을 보존했습니다. 구현 요청을 이용하세요.');}
 p.interactive=plan.id;p.styles=[...new Set([...(p.styles as string[]??[]),'/topics/statistics/possibility-lab.css'])];for(const scene of p.scenes)scene.suggestion={example:scene.id};
 return{apply(){writeFileSync(file,source.slice(0,match.index)+'export default '+JSON.stringify(page,null,2)+' satisfies ContentPage;\n');}};
}
