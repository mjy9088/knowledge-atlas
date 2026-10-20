import {parseLane} from './contracts.js';
import {productionWorkflow} from './workflow.js';

const HELP=`Usage:
  pnpm content:workflow prepare <slug> <author-session>
  pnpm content:workflow record <absolute-run-directory> <content|surface> <reviewer-session> <report-file>
  pnpm content:workflow status <absolute-run-directory>

prepare runs the fixed pnpm build before exporting and binding the canonical candidate.`;

function exact(args:readonly string[],count:number):void{if(args.length!==count)throw new TypeError('Invalid argument count');}
function execute(args:readonly string[]):unknown{
  const command=args[0];
  switch(command){
    case'prepare':exact(args,3);return productionWorkflow.prepare(args[1]??'',args[2]??'');
    case'record':exact(args,5);return productionWorkflow.record(args[1]??'',parseLane(args[2]??''),args[3]??'',args[4]??'');
    case'status':exact(args,2);return productionWorkflow.status(args[1]??'');
    case'--help':case'-h':exact(args,1);return {help:HELP};
    default:throw new TypeError('Unknown command');
  }
}

try{
  const result=execute(process.argv.slice(2));
  if(typeof result==='object'&&result!==null&&'help'in result)process.stdout.write(`${HELP}\n`);
  else process.stdout.write(`${JSON.stringify(result,null,2)}\n`);
}catch(error){
  const message=error instanceof Error?error.message:'Unknown workflow error';
  process.stderr.write(`${JSON.stringify({error:message})}\n${HELP}\n`);
  process.exitCode=1;
}
