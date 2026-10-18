import http from 'node:http';
import path from 'node:path';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {browserJavaScript} from '../../scripts/typescript.js';
import {Studio} from './engine.js';
import {POLICIES} from './contracts.js';
import {Production} from './production.js';
import {createReviewPacket,createWorkPacket} from './handoff.js';
export function createStudioServer(studio:Studio,production?:Production){
  return http.createServer(async(req,res)=>{
    const json=(value:unknown,status=200)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
    try{
      const host=req.headers.host;if(!host||!/^127\.0\.0\.1:\d+$/.test(host)){json({error:'Localhost only'},403);return;}
      if(req.headers.origin&&req.headers.origin!==`http://${host}`){json({error:'Cross-origin request rejected'},403);return;}
      const url=new URL(req.url??'/',`http://${host}`);
      if(req.method==='GET'){
        if(url.pathname==='/api/topics'){json({topics:studio.list(),policies:POLICIES,videoBudgets:studio.budgets(),budgetRevision:studio.budgetRevision()});return;}
        if(url.pathname==='/api/work'){json(production?.list()??[]);return;}
        if(url.pathname==='/api/changes'){if(!production)throw Error('Production not configured');json(await production.changes(url.searchParams.get('id')??''));return;}
        if(url.pathname.startsWith('/api/export/')){json(studio.topic(url.pathname.slice(12)));return;}
        if(url.pathname.startsWith('/api/handoff/review/')){json(createReviewPacket(studio.topic(url.pathname.slice(20))));return;}
        if(url.pathname.startsWith('/api/handoff/work/')){if(!production)throw Error('Production not configured');const id=url.pathname.slice(18),topic=studio.topic(id),work=production.list().find(work=>work.id===id);if(!work)throw Error('Prepare workspace first');json(createWorkPacket(topic,{directory:work.directory,branch:work.branch,route:work.route}));return;}
        const asset:Record<string,[string,string]>={'/':['index.html','text/html; charset=utf-8'],'/app.js':['app.ts','text/javascript; charset=utf-8'],'/style.css':['style.css','text/css; charset=utf-8']};
        const route=asset[url.pathname];if(!route){json({error:'Not found'},404);return;}
        const file=fileURLToPath(new URL(route[0],import.meta.url)),source=readFileSync(file,'utf8');
        res.writeHead(200,{'Content-Type':route[1],'Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; frame-src http://127.0.0.1:*; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});res.end(file.endsWith('.ts')?browserJavaScript(source,file):source);return;
      }
      if(req.method!=='POST'||!req.headers['content-type']?.startsWith('application/json')){json({error:'JSON POST required'},405);return;}
      let body='';for await(const chunk of req){body+=chunk;if(body.length>500_000){json({error:'Payload too large'},413);return;}}
      const raw:unknown=JSON.parse(body);if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Expected object');const v=raw as Record<string,unknown>;
      const id=typeof v.id==='string'?v.id:'';
      switch(url.pathname){
        case '/api/video-budgets':json(studio.setBudgets(v.budgets,String(v.revision)));break;
        case '/api/create':json(studio.create(v.plan));break;
        case '/api/work':{
          if(!production)throw Error('Production not configured');const topic=studio.topic(id);
          if(topic.revision!==v.revision)throw Error('Conflict: reload before starting work');
          if(v.kind!=='prepare'&&v.kind!=='build'&&v.kind!=='visuals'&&v.kind!=='interactions')throw Error('Invalid production action');
          json(production.start(topic.plan,topic.revision,v.kind));break;
        }
        case '/api/work-acknowledge':if(!production)throw Error('Production not configured');json(await production.acknowledge(studio.topic(id),v.result));break;
        case '/api/work-cancel':if(!production)throw Error('Production not configured');production.cancel(id);json({ok:true});break;
        case '/api/save':{const p=v.plan as Record<string,unknown>|undefined;if(p&&typeof p.id==='string'&&production?.list().some(w=>w.id===p.id)&&p.domain!==studio.topic(p.id).plan.domain)throw Error('Workspace domain cannot change');json(studio.save(v.plan,String(v.revision)));break;}
        case '/api/reset':json(studio.reset(id,String(v.revision)));break;
        case '/api/review-import':json(studio.importReviews(v.result));break;
        case '/api/feedback':json(studio.feedback(id,String(v.slideId),typeof v.text==='string'?v.text:''));break;
        case '/api/resolve':if(typeof v.resolved!=='boolean')throw Error('Invalid resolution');studio.resolve(id,String(v.feedbackId),v.resolved);json({ok:true});break;
        default:json({error:'Not found'},404);
      }
    }catch(error){const message=error instanceof Error?error.message:String(error);json({error:message},message.startsWith('Conflict:')?409:400);}
  });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=fileURLToPath(new URL('../../',import.meta.url)),dir=path.resolve(process.env.STUDIO_DATA_DIR??path.join(root,'artifacts/studio'));
  const studio=new Studio(root,dir);
  const production=new Production(root,dir);await production.restore();
  const server=createStudioServer(studio,production);server.listen(Number(process.env.STUDIO_PORT??4180),'127.0.0.1',()=>console.log(`Private content studio: http://127.0.0.1:${(server.address() as {port:number}).port}`));
  for(const signal of ['SIGTERM','SIGINT'] as const)process.on(signal,()=>{studio.dispose();production.dispose();server.close(()=>process.exit(0));});
}
