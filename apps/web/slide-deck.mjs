export const SLIDES = Object.freeze([
  Object.freeze({id:'slide-overview',title:'전제에서 결론으로',label:'개요'}),
  Object.freeze({id:'slide-lab',title:'직접 구성하는 추론',label:'추론 실험실'}),
  Object.freeze({id:'slide-video',title:'추론을 재생하기',label:'애니메이션'}),
  Object.freeze({id:'slide-explosion',title:'모순에서 도출하기',label:'모순 폭발'}),
  Object.freeze({id:'slide-sources',title:'해석의 범위와 근거',label:'출처와 범위'})
]);
export function createSlideDeck({onChange} = {}) {
  let index = 0;
  const getState = () => ({slideId:SLIDES[index].id});
  function setState(state) {
    if (!state || typeof state !== 'object' || typeof state.slideId !== 'string') throw new TypeError('Deck state requires slideId');
    const next = SLIDES.findIndex(slide => slide.id === state.slideId);
    if (next < 0) throw new RangeError('Unknown slide');
    index = next; onChange?.(getState());
  }
  return {getState,setState,reset(){setState({slideId:SLIDES[0].id});},next(){setState({slideId:SLIDES[Math.min(index+1,SLIDES.length-1)].id});},previous(){setState({slideId:SLIDES[Math.max(index-1,0)].id});}};
}
export function mountSlideDeck(doc = document) {
  const $ = id => doc.getElementById(id);
  let deck;
  let followingLocation = false;
  function render({slideId}) {
    const index = SLIDES.findIndex(slide => slide.id === slideId);
    for (const slide of SLIDES) {
      const element = $(slide.id); element.hidden = slide.id !== slideId;
      element.inert = slide.id !== slideId;
    }
    $('deck-title').textContent = SLIDES[index].title;
    $('deck-counter').textContent = `${String(index+1).padStart(2,'0')} / 05`;
    $('deck-prev').disabled = index === 0; $('deck-next').disabled = index === SLIDES.length-1;
    for (const button of $('deck-jumps').children) button.setAttribute('aria-current', button.dataset.slideId === slideId ? 'page' : 'false');
    doc.dispatchEvent(new CustomEvent('atlas:slidechange',{detail:{slideId}}));
    if (!followingLocation && location.hash !== `#${slideId}`) history.pushState(null,'',`#${slideId}`);
  }
  deck = createSlideDeck({onChange:render});
  const menu = $('atlas-menu'); const contents = $('atlas-contents');
  const openers = new WeakMap();
  for (const [buttonId, dialog] of [['open-menu',menu],['open-contents',contents]]) {
    $(buttonId).addEventListener('click', () => {openers.set(dialog, doc.activeElement); dialog.showModal();});
    dialog.addEventListener('close', () => {openers.get(dialog)?.focus();});
    dialog.addEventListener('click', event => {if (event.target === dialog) dialog.close();});
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  }
  for (const [index, slide] of SLIDES.entries()) {
    const button = doc.createElement('button');button.type='button';button.dataset.slideId=slide.id;
    const number=doc.createElement('span');number.textContent=String(index+1).padStart(2,'0');
    const text=doc.createElement('strong');text.textContent=slide.label;
    const detail=doc.createElement('small');detail.textContent=slide.title;
    button.append(number,text,detail);
    button.addEventListener('click',()=>{contents.close();deck.setState({slideId:slide.id});$(slide.id).focus();});
    $('deck-jumps').append(button);
  }
  function navigate(method) {
    deck[method]();
    $(deck.getState().slideId).focus();
  }
  $('deck-prev').addEventListener('click',()=>navigate('previous'));
  $('deck-next').addEventListener('click',()=>navigate('next'));
  doc.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
    if (event.target.closest('input,textarea,select,details,[contenteditable="true"],dialog') || doc.querySelector('dialog[open]')) return;
    if (event.key === 'ArrowRight') {event.preventDefault();navigate('next');}
    if (event.key === 'ArrowLeft') {event.preventDefault();navigate('previous');}
  });
  function followHash() {
    const hash = location.hash.slice(1);
    let target;try{target=$(decodeURIComponent(hash || 'slide-overview'));}catch{return;}
    const slide=target?.closest('[data-slide]');
    if (slide) {followingLocation=true;try{deck.setState({slideId:slide.id});}finally{followingLocation=false;}if(menu.open)menu.close();if(contents.open)contents.close();target.scrollIntoView({block:'nearest'});}
  }
  window.addEventListener('hashchange',followHash);
  window.addEventListener('popstate',followHash);
  followingLocation=true;render(deck.getState());followHash();followingLocation=false;
  return deck;
}
