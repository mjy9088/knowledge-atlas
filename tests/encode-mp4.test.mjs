import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMedia,runMediaTool} from '../scripts/encode-mp4.mjs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
test('MP4 conversion preflight rejects missing streams, unsupported size and excessive duration',()=>{
  const source={streams:[{codec_type:'video',codec_name:'vp8',width:1080,height:1440}],format:{duration:'180'}};
  assert.equal(validateMedia(source).duration,180);
  assert.throws(()=>validateMedia({streams:[],format:{duration:180}}));
  assert.throws(()=>validateMedia({...source,format:{duration:'NaN'}}));
  assert.throws(()=>validateMedia({...source,format:{duration:601}}));
  assert.throws(()=>validateMedia({...source,streams:[{codec_type:'video',width:3,height:4}]}));
  assert.throws(()=>runMediaTool('powershell',[]));
});

test('MP4 CLI exposes standalone help and rejects unsupported arguments before invoking media tools',()=>{
  const cli=fileURLToPath(new URL('../scripts/encode-mp4.mjs',import.meta.url));
  const help=spawnSync(process.execPath,[cli,'--help'],{encoding:'utf8',windowsHide:true});
  assert.equal(help.status,0,help.stderr);assert.match(help.stdout,/mise exec -- ffmpeg\/ffprobe/);assert.match(help.stdout,/never overwritten/);
  for(const args of [[],['input.webm'],['--unknown','output.mp4'],['a.webm','b.mp4','extra']]){
    const invalid=spawnSync(process.execPath,[cli,...args],{encoding:'utf8',windowsHide:true});
    assert.equal(invalid.status,1);assert.match(invalid.stderr,/Usage:/);assert.ok(!invalid.stderr.includes('ffmpeg failed'));
  }
});
