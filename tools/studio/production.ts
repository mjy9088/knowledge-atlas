import {spawn} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import {existsSync,mkdirSync,readFileSync,writeFileSync,renameSync,readdirSync,lstatSync,cpSync,realpathSync} from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import type {Plan,Topic} from './contracts.js';
import {validateWorkResult} from './handoff.js';
import {planVisualInstallation} from './install-visuals.js';
import {planInteractionInstallation} from './install-interactions.js';

export interface Work {id:string;directory:string;branch:string;seedRevision:string;route:string;tasks:WorkTask[];build?:{id:string;revision:string;createdAt:string;sourceHash:string;url?:string}}
export interface WorkTask {id:string;kind:'prepare'|'implement'|'visuals'|'interactions'|'build';revision:string;status:'running'|'completed'|'failed'|'interrupted';createdAt:string;log:string;sourceHash?:string}
type ProductionAction=Exclude<WorkTask['kind'],'implement'>;
type Runner=(command:string,args:string[],cwd:string,input:string,signal:AbortSignal,onOutput:(text:string,stream?:'stdout'|'stderr')=>void)=>Promise<void>;
export const run:Runner=(command,args,cwd,input,signal,onOutput)=>new Promise((resolve,reject)=>{
  const child=spawn(command,args,{cwd,windowsHide:true,stdio:['pipe','pipe','pipe'],signal});
  child.stdout.on('data',(chunk:Buffer)=>onOutput(chunk.toString(),'stdout'));child.stderr.on('data',(chunk:Buffer)=>onOutput(chunk.toString(),'stderr'));
  child.stdin.on('error',()=>{});child.stdin.end(input);child.once('error',reject);child.once('close',code=>code===0?resolve():reject(Error(`${command}: exit ${code}`)));
});
function plainTree(dir:string){for(const item of readdirSync(dir)){const file=path.join(dir,item),stat=lstatSync(file);if(stat.isSymbolicLink())throw Error('Linked build files are not supported');if(stat.isDirectory())plainTree(file);}}
function json(file:string,value:unknown){mkdirSync(path.dirname(file),{recursive:true});writeFileSync(file,JSON.stringify(value,null,2));}
function scaffold(directory:string,plan:Plan){
  const domain=plan.domain,topic=`${domain}/${plan.id}`,base=path.join(directory,'content',topic),prefix=`${domain}.${plan.id}`;
  if(existsSync(base)){
    const articleFile=path.join(base,'article.ko.json'),pageFile=path.join(base,'page.ts');
    const article=existsSync(articleFile)?JSON.parse(readFileSync(articleFile,'utf8')) as {id?:unknown}:null;
    const registered=new RegExp(`directory\\s*:\\s*['"]${topic}['"]`).test(readFileSync(path.join(directory,'content/catalog.ts'),'utf8'));
    if(article?.id!==`article:${prefix}.ko`||!existsSync(pageFile)||!registered)throw Error('Existing topic identity/registration does not match; preserve sources and resolve explicitly');
    return 'existing' as const;
  }
  const claim=(id:string)=>`claim:${prefix}.${id}`,conceptId=`concept:${prefix}`,sourceFile=path.join(directory,'sources/registry.json');
  const sources=JSON.parse(readFileSync(sourceFile,'utf8')) as {id:string;canonicalUrl:string}[];
  const sourceIds=new Map<string,string>();
  for(const source of plan.sources){const existing=sources.find(s=>s.canonicalUrl===source.url),id=existing?.id??`source:studio-${plan.id}-${source.id}`;sourceIds.set(source.id,id);if(!existing)sources.push(Object.assign({id,canonicalUrl:source.url},{title:source.title,author:'Authorship verification pending; see canonical source',retrievedAt:source.consultedOn,providerRevision:'unfrozen; inherited manuscript consultation date, not verified by scaffold',contentHash:null,license:'Unverified; reference-only, no third-party material copied',rightsReview:'pending-publication-audit'}));}
  json(sourceFile,sources);
  const conceptsFile=path.join(directory,'knowledge/concepts.json'),concepts=JSON.parse(readFileSync(conceptsFile,'utf8')) as {id:string}[];
  if(concepts.some(c=>c.id===conceptId))throw Error('Concept ID collision');
  concepts.push(Object.assign({id:conceptId},{title:plan.title,summary:plan.goal,reviewStatus:'proposed',externalIds:[]}));json(conceptsFile,concepts);
  json(path.join(base,'article.ko.json'),{id:`article:${prefix}.ko`,conceptId,title:plan.title,reviewStatus:'needs-content-review',scope:plan.metadata.inScope.join(' / ')||plan.goal,blocks:plan.slides.map(s=>({id:`block:${prefix}.${s.id}`,text:s.narration,claimRefs:s.claimRefs.map(claim)})),relatedConcepts:[]});
  json(path.join(base,'claims.json'),plan.claims.map(c=>({id:claim(c.id),kind:'draft-teaching-model',statement:c.text,scope:plan.goal,assumptions:['Inherited manuscript scope; scientific and rights review pending'],sourceRefs:c.sourceRefs.map(id=>({sourceId:sourceIds.get(id),locator:plan.sources.find(s=>s.id===id)!.locator})),reviewStatus:'needs-content-review'})));
  const page={slug:plan.id,articleId:`article:${prefix}.ko`,label:plan.title,category:domain,model:null,experiment:false,claimRefs:plan.claims.map(c=>claim(c.id)),scenes:plan.slides.map((s,i)=>({id:s.id,title:s.title,block:i,from:0,cards:[],known:s.observation}))};
  writeFileSync(path.join(base,'page.ts'),`import type {ContentPage} from '../../../packages/content/types.js';\nexport default ${JSON.stringify(page,null,2)} satisfies ContentPage;\n`);
  const catalog=path.join(directory,'content/catalog.ts'),original=readFileSync(catalog,'utf8'),binding=`studioDraft_${domain.replaceAll('-','_')}_${plan.id.replaceAll('-','_')}`;
  if(!original.includes('export const CONTENT_ENTRIES: ContentEntry[]=['))throw Error('Catalog registration contract changed');
  writeFileSync(catalog,`import ${binding} from './${topic}/page.js';\n`+original.replace('export const CONTENT_ENTRIES: ContentEntry[]=[',`export const CONTENT_ENTRIES: ContentEntry[]=[\n  {directory:'${topic}',article:'article.ko.json',claims:'claims.json',page:${binding}},`));
  writeFileSync(path.join(base,'README.md'),'# Draft manuscript projection\n\nGenerated once from the private Studio plan. This is a prose-only shared-reader draft; designed diagrams, audio, timing and independent source/rights review remain pending. Preserve edited sources; request explicit implementation changes instead of regenerating.\n');
  return 'created' as const;
}

/** One owner per directory. Jobs are explicit, isolated from the primary checkout and never publish. */
export class Production {
  private works:Work[]=[];private controllers=new Map<string,AbortController>();private previews=new Map<string,http.Server>();private disposed=false;
  constructor(private root:string,private data:string,private runner:Runner=run){
    mkdirSync(data,{recursive:true});
    if(existsSync(this.file())){
      const rows:unknown=JSON.parse(readFileSync(this.file(),'utf8'));if(!Array.isArray(rows))throw Error('Invalid production state');
      for(const raw of rows){const w=raw as Work;if(!w||!/^[-a-z0-9]+$/.test(w.id)||typeof w.directory!=='string'||path.dirname(w.directory)!==this.workspaceRoot()||!(/^(?:codex\/studio|studio)\/[-a-z0-9]+$/.test(w.branch))||typeof w.seedRevision!=='string'||w.route!==`/knowledge/${w.id}/`||!Array.isArray(w.tasks))throw Error('Invalid workspace state');
        for(const task of w.tasks){if(!task||typeof task.id!=='string'||typeof task.revision!=='string'||typeof task.log!=='string'||typeof task.createdAt!=='string'||(task.sourceHash!==undefined&&!/^[a-f0-9]{64}$/.test(task.sourceHash))||!['prepare','implement','visuals','interactions','build'].includes(task.kind)||!['running','completed','failed','interrupted'].includes(task.status))throw Error('Invalid production task');if(task.status==='running'){task.status='interrupted';task.log+='\nServer restarted; explicit retry required.';}}
        if(w.build){if(!/^[a-f0-9-]{36}$/.test(w.build.id)||typeof w.build.sourceHash!=='string'||typeof w.build.revision!=='string'||typeof w.build.createdAt!=='string')throw Error('Invalid build');delete w.build.url;}
        this.works.push(w);
      }
    }
    this.persist();
  }
  private workspaceRoot(){return path.join(this.root,'artifacts/studio-workspaces');}
  private file(){return path.join(this.data,'production.json');}
  private persist(works:Work[]=this.works){json(this.file()+'.tmp',works);renameSync(this.file()+'.tmp',this.file());}
  list(){return structuredClone(this.works);}
  private find(id:string){const work=this.works.find(w=>w.id===id);if(!work)throw Error('Prepare workspace first');return work;}
  private snapshot(id:string){return path.join(this.data,'builds',id,'site');}
  async restore(){for(const work of this.works)if(work.build&&existsSync(this.snapshot(work.build.id)))await this.preview(work);}
  start(plan:Plan,revision:string,kind:ProductionAction){
    if(this.disposed)throw Error('Production service closed');
    if(this.works.some(w=>w.id===plan.id&&w.tasks.some(t=>t.status==='running')))throw Error('A writer/build is already running for this content');
    if(this.controllers.size>=3)throw Error('Three content tasks already running');
    let work=this.works.find(w=>w.id===plan.id);
    if(kind==='prepare'){if(work)throw Error('Workspace already exists; preserve edits and request a change');const token=randomUUID();work={id:plan.id,directory:path.join(this.workspaceRoot(),`${plan.id}-${token}`),branch:`studio/${plan.id}-${token}`,seedRevision:revision,route:`/knowledge/${plan.id}/`,tasks:[]};this.works.push(work);}
    if(!work)throw Error('Prepare workspace first');
    if(kind!=='prepare'&&!existsSync(path.join(work.directory,'.git')))throw Error('Workspace preparation incomplete; inspect logs');
    const task:WorkTask={id:randomUUID(),kind,revision,status:'running',createdAt:new Date().toISOString(),log:''};work.tasks.push(task);
    const controller=new AbortController();this.controllers.set(task.id,controller);this.persist();const target=work;
    const output=(text:string)=>{task.log=(task.log+text).slice(-100_000);this.persist();};
    const command=(cmd:string,args:string[],cwd=target.directory,input='')=>this.runner(cmd,args,cwd,input,controller.signal,output);
    const timeout=setTimeout(()=>controller.abort(),30*60_000);
    void(async()=>{
      if(kind==='prepare'){
        mkdirSync(this.workspaceRoot(),{recursive:true});await command('git',['worktree','add','-b',target.branch,target.directory,'HEAD'],this.root);
        const source=scaffold(target.directory,plan);output(source==='existing'?'\nExisting registered topic sources retained in the isolated worktree. No regeneration or content approval.\n':'\nCreated a prose-only draft through the shared reader. Designed visuals and independent content review remain pending.\n');
      }else if(kind==='interactions'){
        const installation=planInteractionInstallation(target.directory,plan);
        if(!readFileSync(path.join(target.directory,'apps/web/topics/registry.ts'),'utf8').includes('mountPossibilityLab')){const patch=path.join(this.root,'tools/studio/possibility-lab.patch');await command('git',['apply','--check',patch]);await command('git',['apply',patch]);}
        installation.apply();output('\nReplayable interaction installed; build to inspect. Prose and original figures preserved.\n');
      }else if(kind==='visuals'){
        const installation=planVisualInstallation(target.directory,plan);
        const support=readFileSync(path.join(target.directory,'packages/content/types.ts'),'utf8').includes('figure?:')&&readFileSync(path.join(target.directory,'packages/site/related-site.ts'),'utf8').includes('scene.figure')&&readFileSync(path.join(target.directory,'apps/web/components/reader/frame.css'),'utf8').includes('.scene-figure');
        if(!support){const patch=path.join(this.root,'tools/studio/scene-figures.patch');await command('git',['apply','--check',patch]);await command('git',['apply',patch]);}
        if(!readFileSync(path.join(target.directory,'apps/web/pages/article/controller.ts'),'utf8').includes('current.scene.figure')){const patch=path.join(this.root,'tools/studio/scene-figures-runtime.patch');await command('git',['apply','--check',patch]);await command('git',['apply',patch]);}
        installation.apply();output(`\n${installation.count} topic-specific SVG figures added. Existing prose and human-edited assets preserved. Build to inspect actual results.\n`);
      }else{
        const sourceBefore=await this.fingerprint(target.directory,controller.signal);
        await command(process.execPath,[path.join(this.root,'node_modules/typescript/bin/tsc'),'--noEmit']);
        await command(process.execPath,['--import','tsx','scripts/validate.ts']);
        await command(process.execPath,['--import','tsx','scripts/build-site.ts']);
        const sourceHash=await this.fingerprint(target.directory,controller.signal);if(sourceBefore!==sourceHash)throw Error('Sources changed during build; build again from stable sources');
        const dist=path.join(target.directory,'dist');plainTree(dist);
        if(!existsSync(path.join(dist,target.route,'index.html')))throw Error('Build succeeded but content route is missing');
        const buildId=randomUUID(),destination=this.snapshot(buildId);mkdirSync(path.dirname(destination),{recursive:true});cpSync(dist,destination,{recursive:true});
        const sourceRevision=target.tasks.filter(t=>['prepare','implement','visuals','interactions'].includes(t.kind)&&t.status==='completed'&&t.sourceHash===sourceHash).at(-1)?.revision??'unacknowledged';
        const old=target.build;target.build={id:buildId,revision:sourceRevision,createdAt:new Date().toISOString(),sourceHash};
        try{await this.preview(target);}catch(error){target.build=old;throw error;}
        output('\nStatic build snapshot ready. No publication or content approval.\n');
      }
      if(kind!=='build')task.sourceHash=await this.fingerprint(target.directory,controller.signal);
      task.status='completed';
    })().catch(error=>{task.status=controller.signal.aborted?'interrupted':'failed';output('\n'+(error instanceof Error?error.message:String(error)));}).finally(()=>{clearTimeout(timeout);this.controllers.delete(task.id);this.persist();});
    return structuredClone(task);
  }
  async acknowledge(topic:Topic,raw:unknown){
    if(this.disposed)throw Error('Production service closed');const work=this.find(topic.plan.id);
    if(work.tasks.some(task=>task.status==='running'))throw Error('A writer/build is already running for this content');
    if(this.controllers.size>=3)throw Error('Three content tasks already running');
    if(!existsSync(path.join(work.directory,'.git')))throw Error('Workspace preparation incomplete; inspect logs');
    const result=validateWorkResult(raw,topic,{directory:work.directory,branch:work.branch,route:work.route}),task:WorkTask={id:randomUUID(),kind:'implement',revision:result.revision,status:'running',createdAt:new Date().toISOString(),log:`External completion acknowledgement requested by user.\nSummary: ${result.summary}\nChecks: ${result.checks.join('; ')||'none reported'}\nThis acknowledgement is not review, approval or proof that reported checks ran.`},controller=new AbortController();
    work.tasks.push(task);this.controllers.set(task.id,controller);try{this.persist();}catch(error){work.tasks.pop();this.controllers.delete(task.id);throw error;}const timeout=setTimeout(()=>controller.abort(),30*60_000);
    try{
      const sourceHash=await this.fingerprint(work.directory,controller.signal);
      if(controller.signal.aborted)throw Error('Source fingerprint interrupted');
      const completed:WorkTask={...task,status:'completed',sourceHash,log:task.log+`\nSource fingerprint: ${sourceHash}\nExternal completion linked to this exact source fingerprint.`};
      this.persist(this.works.map(row=>row===work?{...row,tasks:row.tasks.map(item=>item===task?completed:item)}:row));Object.assign(task,completed);return structuredClone(task);
    }catch(error){
      const terminal:WorkTask={...task,status:controller.signal.aborted?'interrupted':'failed',log:task.log+'\n'+(error instanceof Error?error.message:String(error))};
      try{this.persist(this.works.map(row=>row===work?{...row,tasks:row.tasks.map(item=>item===task?terminal:item)}:row));Object.assign(task,terminal);}catch(persistError){const index=work.tasks.indexOf(task);if(index>=0)work.tasks.splice(index,1);throw persistError;}throw error;
    }finally{clearTimeout(timeout);this.controllers.delete(task.id);}
  }
  private async fingerprint(directory:string,signal:AbortSignal){const hash=createHash('sha256');for(const args of [['rev-parse','HEAD'],['diff','--binary','HEAD','--']])await this.runner('git',args,directory,'',signal,(s,stream)=>{if(stream!=='stderr')hash.update(s);});hash.update(await this.untrackedHash(directory,signal));return hash.digest('hex');}
  private async untrackedHash(directory:string,signal:AbortSignal){let names='';await this.runner('git',['ls-files','--others','--exclude-standard','-z'],directory,'',signal,(s,stream)=>{if(stream!=='stderr')names+=s;});const hash=createHash('sha256');for(const name of names.split('\0').filter(Boolean).sort()){if(signal.aborted)throw Error('Source fingerprint interrupted');const file=path.join(directory,name);if(lstatSync(file).isSymbolicLink())throw Error('Linked source not supported');hash.update(name).update(readFileSync(file));}return hash.digest('hex');}
  async changes(id:string){const work=this.find(id);let output='';await this.runner('git',['status','--short'],work.directory,'',new AbortController().signal,s=>{output=(output+s).slice(-100_000);});let diff='';await this.runner('git',['diff','--stat','HEAD'],work.directory,'',new AbortController().signal,s=>{diff=(diff+s).slice(-100_000);});return {status:output,diff};}
  cancel(id:string){const controller=this.controllers.get(id);if(!controller)throw Error('No running task');controller.abort();}
  private async preview(work:Work){
    const build=work.build!;if(this.previews.has(build.id))return;const root=this.snapshot(build.id);plainTree(root);
    const server=http.createServer((req,res)=>{try{
      if(!/^127\.0\.0\.1:\d+$/.test(req.headers.host??'')||!['GET','HEAD'].includes(req.method??'')){res.writeHead(403);res.end();return;}
      const pathname=decodeURIComponent(new URL(req.url??'/',`http://${req.headers.host}`).pathname),candidate=path.resolve(root,'.'+pathname),relative=path.relative(root,candidate);
      if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('Outside build');let file=candidate;
      if(existsSync(file)&&lstatSync(file).isDirectory()){if(!pathname.endsWith('/')){res.writeHead(302,{Location:pathname+'/'});res.end();return;}file=path.join(file,'index.html');}
      if(!existsSync(file)||!realpathSync(file).startsWith(realpathSync(root)+path.sep)||!lstatSync(file).isFile())throw Error('Missing file');
      const mime:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
      res.writeHead(200,{'Content-Type':mime[path.extname(file)]??'application/octet-stream','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'"});res.end(req.method==='HEAD'?undefined:readFileSync(file));
    }catch{res.writeHead(404);res.end('Not found');}});
    await new Promise<void>((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});this.previews.set(build.id,server);build.url=`http://127.0.0.1:${(server.address() as {port:number}).port}${work.route}`;
  }
  dispose(){this.disposed=true;for(const controller of this.controllers.values())controller.abort();for(const server of this.previews.values())server.close();}
}
