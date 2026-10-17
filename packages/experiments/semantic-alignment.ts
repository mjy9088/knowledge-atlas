export interface AlignmentNode {id:string;parent?:string;label:string}
export interface AlignmentState {activeId:string|null}

// A declared semantic forest, independent of text spelling, DOM and any domain AST.
export function createAlignmentModel(input:readonly AlignmentNode[]){
  if(!Array.isArray(input)||input.length<1||input.length>256)throw new RangeError('Unsupported alignment forest');
  const nodes=new Map<string,AlignmentNode>();
  for(const node of input){
    if(!node||typeof node.id!=='string'||!/^[-a-zA-Z0-9:.]{1,100}$/.test(node.id)||typeof node.label!=='string'||!node.label.trim()||node.label.length>200||node.parent!==undefined&&typeof node.parent!=='string'||nodes.has(node.id))throw new TypeError('Invalid alignment node');
    nodes.set(node.id,{id:node.id,label:node.label,...(node.parent===undefined?{}:{parent:node.parent})});
  }
  const paths=new Map<string,string[]>();
  for(const id of nodes.keys()){
    const path:string[]=[];let current:string|undefined=id;
    while(current!==undefined){
      if(path.includes(current)||path.length>=32)throw new RangeError('Cyclic or excessive alignment path');
      const node=nodes.get(current);if(!node)throw new RangeError('Unknown alignment parent');path.unshift(current);current=node.parent;
    }
    paths.set(id,path);
  }
  return {
    path(id:string){const path=paths.get(id);if(!path)throw new RangeError('Unknown alignment node');return [...path];},
    label(id:string){const node=nodes.get(id);if(!node)throw new RangeError('Unknown alignment node');return node.label;},
    validate(state:unknown):AlignmentState{if(!state||typeof state!=='object'||!('activeId'in state)||state.activeId!==null&&(typeof state.activeId!=='string'||!nodes.has(state.activeId)))throw new TypeError('Invalid alignment state');return {activeId:state.activeId as string|null};},
  };
}
