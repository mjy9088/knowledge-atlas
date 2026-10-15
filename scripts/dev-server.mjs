import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile,stat} from 'node:fs/promises';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT)||4173;
const paths=[
  ['/',path.join(root,'apps/web')],
  ['/content/',path.join(root,'content')],
  ['/knowledge/',path.join(root,'knowledge')],
  ['/sources/',path.join(root,'sources')],
  ['/packages/models/',path.join(root,'packages/models')],
];
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 try {
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end('Method not allowed');return;}
  const url=new URL(req.url,'http://localhost');
  let matched=paths.filter(([prefix])=>url.pathname.startsWith(prefix)).sort((a,b)=>b[0].length-a[0].length)[0];
  let rel=decodeURIComponent(url.pathname.slice(matched[0].length));
  if(!rel||rel.endsWith('/'))rel+='index.html';
  const target=path.resolve(matched[1],rel);
  if(!target.startsWith(matched[1]+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  if(!Object.hasOwn(MIME,path.extname(target))){res.writeHead(404);res.end('Not found');return;}
  const data=await readFile(target);
  res.writeHead(200,{'Content-Type':MIME[path.extname(target)],'Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'"});
  res.end(req.method==='HEAD'?undefined:data);
 }catch(err){res.writeHead(404);res.end('Not found')}
});
server.listen(port,'127.0.0.1',()=>console.log(`Knowledge Atlas prototype: http://127.0.0.1:${port}`));
