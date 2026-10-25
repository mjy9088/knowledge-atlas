import type {ContentPage} from '../content/types.js';
import {scenePath} from '../content/scene-routing.js';
import {escapeHTML as e} from './html.js';

export function chapterMenu(page:ContentPage):string {
  let previous = '';
  return page.scenes.map(scene => {
    const chapter = page.navigation?.chapters.find(item => item.sceneIds.includes(scene.id));
    const heading = chapter && chapter.id !== previous ? `<strong>${e(chapter.title)}</strong>` : '';
    previous = chapter?.id ?? '';
    return `${heading}<a href="${scenePath(page.slug,scene.id)}">${e(scene.title)}</a>`;
  }).join('');
}

export function staticSceneNavigation(page:ContentPage,index:number):string {
  const scene=page.scenes[index],previous=page.scenes[index-1],next=page.scenes[index+1];
  return `<noscript><nav class="reader-static-navigation" aria-label="설명 이동">${previous?`<a href="${scenePath(page.slug,previous.id)}">← 이전</a>`:''}${scene.skip?`<a href="${scenePath(page.slug,scene.skip.to)}">${e(scene.skip.label)} ↗</a>`:''}${next?`<a href="${scenePath(page.slug,next.id)}">다음 →</a>`:'<a href="/knowledge/">지식 목록 →</a>'}</nav></noscript>`;
}

export function sceneProgress(page:ContentPage,_sceneId:string,index:number){
  return {label:`${page.navigation?'본문 ':''}${index+1} / ${page.scenes.length}`,attribute:''};
}
