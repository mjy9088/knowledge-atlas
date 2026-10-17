export interface WorldCard {title:string;context:string;cells:{label:string;value:string;linked?:boolean}[]}
export interface WorldComparison {worlds:WorldCard[];relation:string;note:string}
// Domain-neutral presentation only. The caller owns evaluation and context assignment.
export function mountWorldComparison(container:HTMLElement){
  const doc=container.ownerDocument;
  container.className='world-comparison';container.setAttribute('role','group');container.setAttribute('aria-label','세계와 기준 비교');
  function element(tag:string,text:string,cls:string){const node=doc.createElement(tag);node.textContent=text;node.className=cls;return node;}
  return {render(view:WorldComparison){
    container.replaceChildren();container.dataset.worldCount=String(view.worlds.length);
    view.worlds.forEach((world,index)=>{
      if(index&&view.relation)container.append(element('p',view.relation,'world-relation'));
      const card=element('section','','world-card');card.setAttribute('aria-label',world.title);
      const heading=element('div','','world-heading');heading.append(element('h3',world.title,'world-title'),element('p',world.context,'world-context'));card.append(heading);
      const cells=element('div','','world-cells');
      for(const cell of world.cells){const box=element('div','','world-cell');if(cell.linked){box.dataset.linked='true';box.setAttribute('aria-label',`${cell.label} ${cell.value} · 같게 놓은 항`);}box.append(element('span',cell.label,'world-label'),element('strong',cell.value,'world-value'));cells.append(box);}
      card.append(cells);container.append(card);
    });
    container.append(element('p',view.note,'world-note'));
  }};
}
