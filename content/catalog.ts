import twoChildrenPage from './statistics/two-children/page.js';
import montyHallPage from './statistics/monty-hall/page.js';
import studioDraft from './mathematics/binary-relations/page.js';
import type {ContentEntry,ContentPage,Article,Scene} from '../packages/content/types.js';
import weekdayPage from './formal-logic/weekday-worlds/page.js';
import searchPage from './computing/binary-search/page.js';
import slicesPage from './geometry/sphere-slices/page.js';
import ratesPage from './statistics/base-rates/page.js';
import chPage from './computing/curry-howard/page.js';
import lambdaPage from './computing/lambda-calculus/page.js';
import fieldPage from './particle-physics/field-quanta/page.js';
import interactionsPage from './particle-physics/particle-interactions/page.js';
import qcdPage from './particle-physics/quark-confinement/page.js';
import orbitalPage from './quantum-physics/atomic-orbitals/page.js';
import page0 from './formal-logic/consistency/page.js';
import page1 from './formal-logic/paraconsistent-logic/page.js';
import page2 from './set-theory/zfc/page.js';
import page3 from './set-theory/continuum-hypothesis/page.js';
import {DISCOVERY_ENTRIES} from './physics-discovery/catalog.js';
import {NUMBER_ENTRIES} from './number-systems/catalog.js';

export const CONTENT_ENTRIES: ContentEntry[]=[
  {directory:'statistics/two-children',article:'article.ko.json',claims:'claims.json',page:twoChildrenPage},
  {directory:'statistics/monty-hall',article:'article.ko.json',claims:'claims.json',page:montyHallPage},
  {directory:'mathematics/binary-relations',article:'article.ko.json',claims:'claims.json',page:studioDraft},
  {directory:'formal-logic/weekday-worlds',article:'article.ko.json',claims:'claims.json',page:weekdayPage},
  {directory:'computing/binary-search',article:'article.ko.json',claims:'claims.json',page:searchPage},
  {directory:'geometry/sphere-slices',article:'article.ko.json',claims:'claims.json',page:slicesPage},
  {directory:'statistics/base-rates',article:'article.ko.json',claims:'claims.json',page:ratesPage},
  {directory:'computing/curry-howard',article:'article.ko.json',claims:'claims.json',page:chPage},
  {directory:'computing/lambda-calculus',article:'article.ko.json',claims:'claims.json',page:lambdaPage},
  {directory:'particle-physics/field-quanta',article:'article.ko.json',claims:'claims.json',page:fieldPage},
  {directory:'particle-physics/particle-interactions',article:'article.ko.json',claims:'claims.json',page:interactionsPage},
  {directory:'particle-physics/quark-confinement',article:'article.ko.json',claims:'claims.json',page:qcdPage},
  {directory:'quantum-physics/atomic-orbitals',article:'article.ko.json',claims:'claims.json',page:orbitalPage},
  {directory:'formal-logic/consistency',article:'article.ko.json',claims:'claims.json',page:page0},
  {directory:'formal-logic/paraconsistent-logic',article:'article.ko.json',claims:'claims.json',page:page1},
  {directory:'set-theory/zfc',article:'article.ko.json',claims:'claims.json',page:page2},
  {directory:'set-theory/continuum-hypothesis',article:'article.ko.json',claims:'claims.json',page:page3},
  ...DISCOVERY_ENTRIES,
  ...NUMBER_ENTRIES
];
export const CONTENT_PAGES=CONTENT_ENTRIES.map(entry=>entry.page);
export const pageURL=(page: ContentPage)=>'/knowledge/'+page.slug+'/';
export function sceneText(article: Article,scene: Scene){
  const sentences=article.blocks[scene.block].text.match(/[\s\S]+?[.!?]+(?:\s+|$)|[\s\S]+$/gu)??[];
  return sentences.slice(scene.from,scene.to).join('').trim();
}

export const COLLECTION_FILE='content/collections/explosion-related.json';
export const CLAIM_FILES=['content/formal-logic/explosion/claims.json','content/formal-logic/explosion/inference-claims.json',...CONTENT_ENTRIES.map(entry=>'content/'+entry.directory+'/'+entry.claims)];
