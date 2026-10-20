import newtonToQuantumPage from './physics/newton-to-quantum/page.js';
import numberStructuresPage from './mathematics/number-structures/page.js';
import weekdayPage from './formal-logic/weekday-worlds/page.js';
import montyHallPage from './statistics/monty-hall/page.js';
import twoChildrenPage from './statistics/two-children/page.js';
import type {Article,ContentEntry,ContentPage,Scene} from '../packages/content/types.js';

const source=(directory:string,articleId:string):ContentEntry=>({directory,article:'article.ko.json',claims:'claims.json',articleId});

export const CONTENT_ENTRIES: ContentEntry[]=[
  source('statistics/two-children','article:statistics.two-children.ko'),
  source('statistics/monty-hall','article:statistics.monty-hall.ko'),
  source('mathematics/binary-relations','article:mathematics.binary-relations.ko'),
  source('formal-logic/weekday-worlds','article:logic.weekday-worlds.ko'),
  source('computing/binary-search','article:computing.binary-search.ko'),
  source('geometry/sphere-slices','article:geometry.sphere-slices.ko'),
  source('statistics/base-rates','article:statistics.base-rates.ko'),
  source('computing/curry-howard','article:computing.curry-howard.ko'),
  source('computing/lambda-calculus','article:computing.lambda-calculus.ko'),
  source('particle-physics/field-quanta','article:particle.field-quanta.ko'),
  source('particle-physics/particle-interactions','article:particle.particle-interactions.ko'),
  source('particle-physics/quark-confinement','article:particle.quark-confinement.ko'),
  source('quantum-physics/atomic-orbitals','article:quantum.atomic-orbitals.ko'),
  source('formal-logic/consistency','article:logic.consistency.ko'),
  source('formal-logic/paraconsistent-logic','article:logic.paraconsistent.ko'),
  source('set-theory/zfc','article:set.zfc.ko'),
  source('set-theory/continuum-hypothesis','article:set.ch-independence.ko'),
  source('physics-discovery/inertial-motion','article:physics-discovery.inertial-motion.ko'),
  source('physics-discovery/atom-evidence','article:physics-discovery.atom-evidence.ko'),
  source('physics-discovery/nuclear-scattering','article:physics-discovery.nuclear-scattering.ko'),
  source('physics-discovery/electron-evidence','article:physics-discovery.electron-evidence.ko'),
  source('physics-discovery/nuclear-constituents','article:physics-discovery.nuclear-constituents.ko'),
  source('physics-discovery/quark-evidence','article:physics-discovery.quark-evidence.ko'),
  source('physics-discovery/proton-charge-ledger','article:physics-discovery.proton-charge-ledger.ko'),
  source('physics-discovery/quantum-spectra','article:physics-discovery.quantum-spectra.ko'),
  source('physics-discovery/photoelectric-evidence','article:physics-discovery.photoelectric-evidence.ko'),
  source('physics-discovery/light-clock-time','article:physics-discovery.light-clock-time.ko'),
  source('number-systems/counting-zero','article:number-systems.counting-zero.ko'),
  source('number-systems/negative-numbers','article:number-systems.negative-numbers.ko'),
  source('number-systems/rational-numbers','article:number-systems.rational-numbers.ko'),
  source('number-systems/rational-representations','article:number-systems.rational-representations.ko'),
  source('number-systems/irrational-numbers','article:number-systems.irrational-numbers.ko'),
  source('number-systems/rational-density','article:number-systems.rational-density.ko'),
  source('number-systems/real-completeness','article:number-systems.real-completeness.ko'),
  source('number-systems/complex-numbers','article:number-systems.complex-numbers.ko'),
  {directory:'physics/newton-to-quantum',article:'article.ko.json',claims:'newclaims.json',articleId:'article:physics.newton-to-quantum.ko'},
  {directory:'mathematics/number-structures',article:'article.ko.json',claims:'new-claims.json',articleId:'article:mathematics.number-structures.ko'},
];

export const INDEX_PAGES:readonly ContentPage[]=[newtonToQuantumPage,numberStructuresPage,weekdayPage,montyHallPage,twoChildrenPage];
export const CONTENT_PAGES=INDEX_PAGES;
export const pageURL=(page:ContentPage)=>`/knowledge/${page.slug}/`;
export function sceneText(article:Article,scene:Scene){
  const sentences=article.blocks[scene.block].text.match(/[\s\S]+?[.!?]+(?:\s+|$)|[\s\S]+$/gu)??[];
  return sentences.slice(scene.from,scene.to).join('').trim();
}

export const COLLECTION_FILE='content/collections/explosion-related.json';
export const CLAIM_FILES=['content/formal-logic/explosion/claims.json','content/formal-logic/explosion/inference-claims.json',...CONTENT_ENTRIES.map(entry=>`content/${entry.directory}/${entry.claims}`)];
