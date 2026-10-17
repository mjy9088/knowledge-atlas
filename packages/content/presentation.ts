import type {Article} from './types.js';

export function validateArticleTitles(article:Pick<Article,'title'|'shortTitle'>){
  if(typeof article.title!=='string'||!article.title.trim()||article.title.length>300)throw new TypeError('Invalid article title');
  if(article.shortTitle!==undefined&&(typeof article.shortTitle!=='string'||!article.shortTitle.trim()||article.shortTitle.length>160))throw new TypeError('Invalid short article title');
}
// Full title remains canonical; compact surfaces opt into the optional short form.
export function articleDisplayTitle(article:Pick<Article,'title'|'shortTitle'>){return article.shortTitle??article.title;}
