const pages=[...document.querySelectorAll<HTMLElement>('[data-catalog-page]')];
const pagination=document.querySelector<HTMLElement>('.catalog-pagination');

if(pages.length>0&&pagination){
  const candidate=Number(new URL(window.location.href).searchParams.get('catalog')??'1');
  const selected=Number.isInteger(candidate)&&candidate>=1&&candidate<=pages.length?candidate:1;
  document.documentElement.classList.add('catalog-enhanced');
  pages.forEach((page,index)=>{page.hidden=index!==selected-1;page.id=index===selected-1?'connections':`catalog-page-${index+1}`;});
  pagination.hidden=false;
  pagination.dataset.page=String(selected);
  const previous=pagination.querySelector<HTMLAnchorElement>('.catalog-previous');
  const next=pagination.querySelector<HTMLAnchorElement>('.catalog-next');
  if(previous){previous.hidden=selected===1;previous.href=`?catalog=${selected-1}`;}
  if(next){next.hidden=selected===pages.length;next.href=`?catalog=${selected+1}`;}
  const status=pagination.querySelector<HTMLElement>('.catalog-status');
  if(status)status.textContent=`${selected} / ${pages.length}페이지`;
  for(const link of pagination.querySelectorAll<HTMLAnchorElement>('[data-catalog-link]')){
    const current=Number(link.dataset.catalogLink)===selected;
    if(current)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  }
}
