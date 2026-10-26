export {};
// Keep the source document inert until its route, interactions and layout are ready.
// Appending and mounting share one task, so the source fallback is never a reader frame.
const template=document.querySelector<HTMLTemplateElement>('#reader-document');
if(!template)throw new Error('Missing article document');
try{
  const {mountArticle}=await import('./controller.js');
  document.body.append(template.content.cloneNode(true));
  mountArticle();
  template.remove();
}catch(error){
  // Module failures still leave a readable document with real directory links.
  document.documentElement.classList.remove('reader-enhanced');
  document.body.replaceChildren(template.content.cloneNode(true));
  for(const fallback of document.querySelectorAll('noscript')){
    const parsed=new DOMParser().parseFromString(fallback.textContent??'','text/html');
    fallback.replaceWith(...parsed.body.childNodes);
  }
  const notice=document.createElement('p');notice.setAttribute('role','alert');
  notice.textContent='실험을 불러오지 못했습니다. 설명과 목차를 읽거나 새로고침해 다시 시도할 수 있습니다.';
  document.querySelector('main')?.prepend(notice);
  console.error('Article initialization failed',error);
}
