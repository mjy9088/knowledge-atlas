import {expect,type Page} from '@playwright/test';

export interface FrameTargets{
  readonly content:readonly string[];
  readonly controls:readonly string[];
  readonly scrollableContainers?:readonly string[];
}

// Measure content, not just CSS overflow:hidden: clipped scroll containers fail too.
export async function expectFrame(page:Page,{content,controls,scrollableContainers=[]}:FrameTargets):Promise<void>{
  const problems=await page.evaluate(({content,controls,scrollableContainers})=>{
    const issues:string[]=[];
    const root=document.documentElement;
    if(root.scrollHeight>innerHeight||root.scrollWidth>innerWidth)issues.push(`document ${root.scrollWidth}×${root.scrollHeight} exceeds ${innerWidth}×${innerHeight}`);
    for(const selector of [...content,...controls])if(!document.querySelector(selector))issues.push(`missing layout target: ${selector}`);
    for(const selector of content)for(const node of document.querySelectorAll<HTMLElement>(selector)){
      if(!node.checkVisibility())continue;
      const scrollable=scrollableContainers.some(container=>node.matches(container));
      if(!scrollable&&scrollableContainers.some(container=>node.closest(container)))continue;
      if(node.scrollWidth>node.clientWidth||!scrollable&&node.scrollHeight>node.clientHeight)issues.push(`${selector}: content ${node.scrollWidth}×${node.scrollHeight}, space ${node.clientWidth}×${node.clientHeight}`);
      const r=node.getBoundingClientRect();
      if(r.top<0||r.left<0||r.bottom>innerHeight||r.right>innerWidth)issues.push(`${selector}: content outside viewport`);
    }
    for(const selector of controls)for(const node of document.querySelectorAll(selector)){
      if(!node.checkVisibility())continue;
      if(scrollableContainers.some(container=>node.closest(container)))continue;
      const r=node.getBoundingClientRect();
      if(r.top<0||r.left<0||r.bottom>innerHeight||r.right>innerWidth)issues.push(`${selector}: outside viewport (${r.x}, ${r.y}, ${r.width}, ${r.height})`);
      const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
      if(!hit||(!node.contains(hit)&&!hit.contains(node)))issues.push(`${selector}: obscured`);
    }
    return issues;
  },{content,controls,scrollableContainers});
  expect(problems).toEqual([]);
}
