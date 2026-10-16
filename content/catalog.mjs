import chPage from './computing/curry-howard/page.mjs';
import lambdaPage from './computing/lambda-calculus/page.mjs';
import fieldPage from './particle-physics/field-quanta/page.mjs';
import interactionsPage from './particle-physics/particle-interactions/page.mjs';
import qcdPage from './particle-physics/quark-confinement/page.mjs';
import orbitalPage from './quantum-physics/atomic-orbitals/page.mjs';
import page0 from './formal-logic/consistency/page.mjs';
import page1 from './formal-logic/paraconsistent-logic/page.mjs';
import page2 from './set-theory/zfc/page.mjs';
import page3 from './set-theory/continuum-hypothesis/page.mjs';

export const CONTENT_ENTRIES=[
  {directory:'computing/curry-howard',article:'article.ko.json',claims:'claims.json',page:chPage},
  {directory:'computing/lambda-calculus',article:'article.ko.json',claims:'claims.json',page:lambdaPage},
  {directory:'particle-physics/field-quanta',article:'article.ko.json',claims:'claims.json',page:fieldPage},
  {directory:'particle-physics/particle-interactions',article:'article.ko.json',claims:'claims.json',page:interactionsPage},
  {directory:'particle-physics/quark-confinement',article:'article.ko.json',claims:'claims.json',page:qcdPage},
  {directory:'quantum-physics/atomic-orbitals',article:'article.ko.json',claims:'claims.json',page:orbitalPage},
  {directory:'formal-logic/consistency',article:'article.ko.json',claims:'claims.json',page:page0},
  {directory:'formal-logic/paraconsistent-logic',article:'article.ko.json',claims:'claims.json',page:page1},
  {directory:'set-theory/zfc',article:'article.ko.json',claims:'claims.json',page:page2},
  {directory:'set-theory/continuum-hypothesis',article:'article.ko.json',claims:'claims.json',page:page3}
];
export const CONTENT_PAGES=CONTENT_ENTRIES.map(entry=>entry.page);
export const pageURL=page=>'/knowledge/'+page.slug+'/';
export function sceneText(article,scene){
  const sentences=article.blocks[scene.block].text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/gu)??[];
  return sentences.slice(scene.from,scene.to).join('').trim();
}

export const COLLECTION_FILE='content/collections/explosion-related.json';
export const CLAIM_FILES=['content/formal-logic/explosion/claims.json','content/formal-logic/explosion/inference-claims.json',...CONTENT_ENTRIES.map(entry=>'content/'+entry.directory+'/'+entry.claims)];
