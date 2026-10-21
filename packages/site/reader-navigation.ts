import type {ContentPage} from '../content/types.js';
import {scenePath} from '../content/scene-routing.js';
import {escapeHTML as e} from './html.js';

export function chapterMenu(page:ContentPage):string{
  if(!page.navigation)return page.scenes.map(scene=>`<a href="#${scene.id}">${e(scene.title)}</a>`).join('');
  return page.navigation.chapters.map(chapter=>{
    const links=chapter.sceneIds.map(id=>{
      const scene=page.scenes.find(item=>item.id===id);
      return scene?`<a href="${scenePath(page.slug,id)}">${e(scene.title)}</a>`:'';
    }).join('');
    return `<section class="reader-menu-chapter" data-chapter-kind="${chapter.kind}"><strong>${e(chapter.kind==='detour'?`선택 · ${chapter.title}`:chapter.title)}</strong>${links}</section>`;
  }).join('');
}
export function branchLinks(page:ContentPage,sceneId:string):string{
  const current=page.navigation?.chapters.find(chapter=>chapter.sceneIds.includes(sceneId));
  if(current?.kind==='detour')return `<nav class="reader-branch-links" aria-label="선택 설명 이동"><a href="${scenePath(page.slug,current.returnSceneId)}">본문 돌아가기 ↩</a></nav>`;
  const detours=page.navigation?.chapters.filter(chapter=>chapter.kind==='detour'&&chapter.parentSceneId===sceneId)??[];
  return detours.length?`<nav class="reader-branch-links" aria-label="선택 설명"><span>더 살펴보기</span>${detours.map(chapter=>`<a href="${scenePath(page.slug,chapter.sceneIds[0])}">${e(chapter.title)} ↗</a>`).join('')}</nav>`:'';
}
export function sceneProgress(page:ContentPage,sceneId:string,index:number){
  const chapter=page.navigation?.chapters.find(item=>item.sceneIds.includes(sceneId));
  if(!chapter)return{label:`${index+1} / ${page.scenes.length}`,attribute:''};
  const sequence=chapter.kind==='mainline'?page.navigation?.chapters.filter(item=>item.kind==='mainline').flatMap(item=>item.sceneIds)??chapter.sceneIds:chapter.sceneIds;
  return{label:`${chapter.kind==='mainline'?'본문':'선택'} ${sequence.indexOf(sceneId)+1} / ${sequence.length}`,attribute:` data-chapter-kind="${chapter.kind}"`};
}
