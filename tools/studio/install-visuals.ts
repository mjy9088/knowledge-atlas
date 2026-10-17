import {existsSync,readFileSync,writeFileSync,mkdirSync,lstatSync} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import type {Plan} from './contracts.js';
import {topicVisuals} from './visuals.js';

const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
function unlinked(directory:string,file:string){const relative=path.relative(directory,file);if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('Outside workspace');let part=directory;for(const name of relative.split(path.sep)){part=path.join(part,name);if(existsSync(part)&&lstatSync(part).isSymbolicLink())throw Error('Linked visual sources are not supported');}}
export function planVisualInstallation(directory:string,plan:Plan){
 const library=topicVisuals(plan.id),base=path.join(directory,'content',plan.domain,plan.id),pageFile=path.join(base,'page.ts');
 if(!existsSync(pageFile))throw Error('작업 소스가 없습니다. 먼저 작업 공간을 준비하세요.');
 unlinked(directory,pageFile);const source=readFileSync(pageFile,'utf8'),match=/export default (\{[\s\S]*\}) satisfies ContentPage;\s*$/.exec(source);
 if(!match)throw Error('직접 편집된 page.ts 구조입니다. 기존 편집을 보존하려면 구현 요청으로 그림을 연결하세요.');
 const page:unknown=JSON.parse(match[1]);if(!page||typeof page!=='object'||!('scenes'in page)||!Array.isArray(page.scenes))throw Error('Invalid page scenes');
 const manifestFile=path.join(directory,'artifacts/studio-visuals',plan.id+'.json');
 unlinked(directory,manifestFile);
 const previous=existsSync(manifestFile)?JSON.parse(readFileSync(manifestFile,'utf8')) as Record<string,string>:{};
 const files:{path:string;text:string}[]=[],hashes:Record<string,string>={};
 for(const raw of page.scenes){
  if(!raw||typeof raw!=='object'||typeof raw.id!=='string')throw Error('Invalid scene');const image=library[raw.id];if(!image)continue;
  const file=path.join(base,'figure-'+raw.id+'.svg');
  unlinked(directory,file);
  if(existsSync(file)){const old=readFileSync(file,'utf8');if(old!==image.svg&&digest(old)!==previous[raw.id])throw Error(`사람이 수정한 시각 자료를 보존했습니다: ${raw.id}. 구현 요청으로 변경안을 검토하세요.`);}
  if(raw.figure&&typeof raw.figure==='object'&&'src'in raw.figure&&raw.figure.src!==`/content/${plan.domain}/${plan.id}/figure-${raw.id}.svg`)continue;
  files.push({path:file,text:image.svg});hashes[raw.id]=digest(image.svg);
  if(!raw.figure)raw.figure={src:`/content/${plan.domain}/${plan.id}/figure-${raw.id}.svg`,alt:image.alt,caption:image.caption};
 }
 if(!files.length)throw Error('일치하는 예제 장면이 없습니다. 현재 내용에 맞는 시각 자료를 구현 요청으로 설계하세요.');
 files.push({path:pageFile,text:source.slice(0,match.index)+'export default '+JSON.stringify(page,null,2)+' satisfies ContentPage;\n'});
 return{count:files.length-1,apply(){for(const file of files)writeFileSync(file.path,file.text);mkdirSync(path.dirname(manifestFile),{recursive:true});writeFileSync(manifestFile,JSON.stringify(hashes,null,2));}};
}
