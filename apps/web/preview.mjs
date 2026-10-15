const cards=[...document.querySelectorAll('.preview-card')];
function fit(card){
  const shell=card.querySelector('.frame-window'),frame=shell.querySelector('iframe');
  const scale=Math.min(shell.clientWidth/Number(card.dataset.width),Math.max(280,innerHeight-300)/Number(frame.height),Number(card.dataset.maxScale));
  frame.style.transform=`scale(${scale})`;frame.style.left=`${(shell.clientWidth-Number(frame.width)*scale)/2}px`;
  shell.style.height=`${Number(frame.height)*scale}px`;card.querySelector('.preview-scale').textContent=`${Math.round(scale*100)}%`;
}
const observer=new ResizeObserver(()=>cards.forEach(fit));cards.forEach(card=>observer.observe(card));
window.addEventListener('resize',()=>cards.forEach(fit));
function reset(){
  const preset=document.getElementById('preview-preset').value;
  for(const card of cards){const frame=card.querySelector('iframe'),url=`${frame.dataset.path}?preset=${encodeURIComponent(preset)}${frame.dataset.path==='./'?'#slide-lab':''}`;frame.src=url;card.querySelector('[data-open]').href=url;}
}
document.getElementById('preview-preset').addEventListener('change',reset);
document.getElementById('preview-reset').addEventListener('click',reset);
