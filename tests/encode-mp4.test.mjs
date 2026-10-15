import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMedia,runMediaTool} from '../scripts/encode-mp4.mjs';
test('MP4 conversion preflight rejects missing streams, unsupported size and excessive duration',()=>{
  const source={streams:[{codec_type:'video',codec_name:'vp8',width:1080,height:1440}],format:{duration:'180'}};
  assert.equal(validateMedia(source).duration,180);
  assert.throws(()=>validateMedia({streams:[],format:{duration:180}}));
  assert.throws(()=>validateMedia({...source,format:{duration:'NaN'}}));
  assert.throws(()=>validateMedia({...source,format:{duration:601}}));
  assert.throws(()=>validateMedia({...source,streams:[{codec_type:'video',width:3,height:4}]}));
  assert.throws(()=>runMediaTool('powershell',[]));
});
