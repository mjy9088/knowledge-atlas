import http from 'node:http';
import path from 'node:path';
import {readFile,lstat,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const port=Number(process.env.PORT)||4174;
const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end('Static hosting: no server APIs');return;}
  try{
    const url=new URL(req.url,'http://localhost'),target=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if(target!==root&&!target.startsWith(root+path.sep))throw new Error('Invalid path');
    const info=await stat(target);
    if(info.isDirectory()&&!url.pathname.endsWith('/')){res.writeHead(308,{Location:url.pathname+'/'+url.search});res.end();return;}
    const file=info.isDirectory()?path.join(target,'index.html'):target;
    let part=root;
    for(const segment of ['',...path.relative(root,file).split(path.sep)]){part=segment?path.join(part,segment):part;if((await lstat(part)).isSymbolicLink())throw new Error('Linked file');}
    if(!file.startsWith(root+path.sep)||!mime[path.extname(file)])throw new Error('Not found');
    const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)],'Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'"});res.end(req.method==='HEAD'?undefined:data);
  }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(req.method==='HEAD'?undefined:await readFile(path.join(root,'404.html')).catch(()=>'Build first: npm run build'));}
});
server.listen(port,'127.0.0.1',()=>console.log(`Static build preview: http://127.0.0.1:${port}`));
