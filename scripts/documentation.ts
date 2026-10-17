import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import path from 'node:path';

const ADR_SECTIONS=['Context','Project impact','Alternatives','Decision','Consequences'] as const;
const withoutFences=(text:string)=>text.replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gm,'');
const withoutCode=(text:string)=>withoutFences(text).replace(/`[^`\n]*`/g,'');

function headingIds(text:string){
  const counts=new Map<string,number>(),ids=new Set<string>();
  for(const match of withoutFences(text).matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)){
    const base=match[1].toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu,'').trim().replace(/\s/g,'-');
    const count=counts.get(base)??0;counts.set(base,count+1);ids.add(base+(count?`-${count}`:''));
  }
  for(const match of text.matchAll(/\b(?:id|name)=["']([^"']+)["']/g))ids.add(match[1]);
  return ids;
}

// Validate mechanical documentation contracts, not architectural significance or source truth.
export function validateDocumentation(root:string):string[]{
  const errors:string[]=[],files:string[]=[];
  function walk(relative:string){
    const absolute=path.join(root,relative);if(!existsSync(absolute))return;
    for(const entry of readdirSync(absolute,{withFileTypes:true})){
      const child=path.join(relative,entry.name);
      if(entry.isDirectory())walk(child);else if(entry.isFile()&&entry.name.endsWith('.md'))files.push(child);
    }
  }
  for(const directory of ['docs','content','apps','packages','tools'])walk(directory);
  for(const file of ['README.md','AGENTS.md'])if(existsSync(path.join(root,file)))files.push(file);
  const indexPath=path.join(root,'docs/adr/README.md'),index=existsSync(indexPath)?readFileSync(indexPath,'utf8'):'';
  const reserved=new Set([...index.matchAll(/^\| (\d{4}) \|/gm)].map(match=>match[1]));
  const adrIds=new Set<string>();
  for(const file of files){
    const text=readFileSync(path.join(root,file),'utf8'),plain=withoutCode(text),label=file.replaceAll('\\','/');
    if(/^docs\/adr\/\d{4}-[^/]+\.md$/.test(label)){
      const id=path.basename(file).slice(0,4);
      if(reserved.has(id)||adrIds.has(id))errors.push(`${label}: reused ADR identity ${id}`);
      adrIds.add(id);
      if(!new RegExp(`^# ADR ${id}\\b`,'m').test(plain))errors.push(`${label}: ADR heading must match identity ${id}`);
      const sections=new Map(plain.split(/^## /m).slice(1).map(section=>{
        const newline=section.indexOf('\n');return [section.slice(0,newline).trim(),section.slice(newline+1).trim()];
      }));
      for(const section of ADR_SECTIONS){
        if(!sections.get(section))errors.push(`${label}: missing nonempty ADR section ${section}`);
      }
    }
    for(const match of plain.matchAll(/!?\[[^\]\n]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+["'][^\n]*?["'])?\s*\)/g)){
      const url=match[1].replace(/^<|>$/g,'');if(/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url))continue;
      let decoded:string;try{decoded=decodeURIComponent(url);}catch{errors.push(`${label}: invalid link encoding ${url}`);continue;}
      const hash=decoded.indexOf('#'),fragment=hash<0?'':decoded.slice(hash+1),filePart=(hash<0?decoded:decoded.slice(0,hash)).split('?')[0];
      const target=filePart?(filePart.startsWith('/')?path.join(root,filePart):path.resolve(root,path.dirname(file),filePart)):path.join(root,file);
      const relative=path.relative(root,target);
      if(relative.startsWith('..'+path.sep)||relative==='..'||path.isAbsolute(relative)){errors.push(`${label}: link escapes repository ${url}`);continue;}
      if(!existsSync(target)){errors.push(`${label}: missing local link target ${url}`);continue;}
      if(fragment&&target.endsWith('.md')&&statSync(target).isFile()&&!headingIds(readFileSync(target,'utf8')).has(fragment))errors.push(`${label}: missing Markdown anchor ${url}`);
    }
  }
  return errors;
}
