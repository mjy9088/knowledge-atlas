import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile,stat} from 'node:fs/promises';
import {mkdir,writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {encodeMP4} from './encode-mp4.mjs';
import {loadSiteContent,siteDocuments} from './build-site.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT)||4173;
let converting=false;
const paths=[
  ['/',path.join(root,'apps/web')],
  ['/content/',path.join(root,'content')],
  ['/knowledge/',path.join(root,'knowledge')],
  ['/sources/',path.join(root,'sources')],
  ['/packages/models/',path.join(root,'packages/models')],
  ['/renders/',path.join(root,'artifacts/video-renders')],
];
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm'};
const server=http.createServer(async(req,res)=>{
 try {
  if(req.method==='POST'&&req.url==='/api/render/mp4'){
    if(![`http://127.0.0.1:${port}`,`http://localhost:${port}`].includes(req.headers.origin)||req.headers['content-type']!=='video/webm'){res.writeHead(403);res.end('Same-origin WebM requests only');return;}
    if(converting){res.writeHead(409);res.end('Another conversion is running');return;}
    converting=true;
    try{
      const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>100*1024*1024)throw new Error('Video exceeds 100 MiB limit');chunks.push(chunk);}
      const data=Buffer.concat(chunks);if(data.length<4||data.readUInt32BE(0)!==0x1a45dfa3)throw new Error('Expected WebM input');
      const id=randomUUID(),dir=path.join(root,'artifacts/video-renders',id);await mkdir(dir,{recursive:true});
      const input=path.join(dir,'source.webm'),output=path.join(dir,'video.mp4');await writeFile(input,data,{flag:'wx'});
      const diagnostics=await encodeMP4(input,output);res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({url:`/renders/${id}/video.mp4`,diagnosticsUrl:`/renders/${id}/video.mp4.json`,diagnostics}));
    }catch(error){res.writeHead(422,{'Content-Type':'application/json'});res.end(JSON.stringify({error:error.message}));}
    finally{converting=false;}return;
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end('Method not allowed');return;}
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/knowledge'||/^\/knowledge\/[a-z-]+$/.test(url.pathname)){res.writeHead(308,{Location:url.pathname+'/'+url.search});res.end();return;}
  if(url.pathname==='/knowledge/'||/^\/knowledge\/[a-z-]+\/$/.test(url.pathname)){
    const html=siteDocuments(await loadSiteContent()).get(url.pathname);
    if(!html){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'"});res.end(req.method==='HEAD'?undefined:html);return;
  }
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
