import type {ContentPage} from './types.js';

/** One declared sequence covers every scene once; grouping never removes a scene. */
export function orderScenes<T extends ContentPage>(page:T, ids:readonly string[]):T {
  const scenes = new Map(page.scenes.map(scene => [scene.id, scene]));
  if (ids.length !== page.scenes.length || new Set(ids).size !== ids.length || ids.some(id => !scenes.has(id))) {
    throw new RangeError(`Reading order must cover every scene once: ${page.slug}`);
  }
  return {...page, scenes: ids.map(id => scenes.get(id)!)};
}
