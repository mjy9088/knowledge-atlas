export const CATALOG_PAGE_SIZE=12;

export function paginateCatalog<T>(entries:readonly T[]):readonly (readonly T[])[]{
  if(entries.length===0)return [[]];
  return Array.from(
    {length:Math.ceil(entries.length/CATALOG_PAGE_SIZE)},
    (_,index)=>entries.slice(index*CATALOG_PAGE_SIZE,(index+1)*CATALOG_PAGE_SIZE),
  );
}
