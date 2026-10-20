import {browserJavaScript} from './typescript.js';
import {isTestPath} from './public-assets.js';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
import {loadSiteContent,siteDocuments} from './build-site.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT)||4173;
const paths=[
  ['/',path.join(root,'apps/web')],
  ['/content/',path.join(root,'content')],
  ['/knowledge/',path.join(root,'knowledge')],
  ['/sources/',path.join(root,'sources')],
  ['/packages/models/',path.join(root,'packages/models')],
  ['/packages/experiments/',path.join(root,'packages/experiments')],
  ['/packages/projection/',path.join(root,'packages/projection')],
  ['/packages/content/',path.join(root,'packages/content')],
  ['/packages/spatial/',path.join(root,'packages/spatial')],
  ['/tools/media/',path.join(root,'tools/media')],
];
const MIME:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm'};
const server=http.createServer(async(req,res)=>{
 try {
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end('Method not allowed');return;}
  const url=new URL(req.url??'/','http://localhost');
  if(url.pathname==='/knowledge'||/^\/knowledge\/[a-z-]+$/.test(url.pathname)){res.writeHead(308,{Location:url.pathname+'/'+url.search});res.end();return;}
  if(url.pathname==='/'||url.pathname==='/knowledge/'||/^\/knowledge\/[a-z-]+\/$/.test(url.pathname)){
    const html=siteDocuments(await loadSiteContent()).get(url.pathname);
    if(!html){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'"});res.end(req.method==='HEAD'?undefined:html);return;
  }
  let matched=paths.filter(([prefix])=>url.pathname.startsWith(prefix)).sort((a,b)=>b[0].length-a[0].length)[0];
   let rel=decodeURIComponent(url.pathname.slice(matched[0].length));
   if(isTestPath(rel)){res.writeHead(404);res.end('Not found');return;}
  if(!rel||rel.endsWith('/'))rel+='index.html';
  const target=path.resolve(matched[1],rel);
  if(!target.startsWith(matched[1]+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  if(!Object.hasOwn(MIME,path.extname(target))){res.writeHead(404);res.end('Not found');return;}
  const source=target.endsWith('.js')?target.slice(0,-3)+'.ts':target;
  const bytes=await readFile(source);
  const data=target.endsWith('.js')?browserJavaScript(bytes.toString('utf8'),source):bytes;
  res.writeHead(200,{'Content-Type':MIME[path.extname(target)],'Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'"});
  res.end(req.method==='HEAD'?undefined:data);
 }catch(err){res.writeHead(404);res.end('Not found')}
});
server.listen(port,'127.0.0.1',()=>console.log(`Knowledge Atlas prototype: http://127.0.0.1:${port}`));
