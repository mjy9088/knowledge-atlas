// Minimal single-track VP8 WebM writer. No external code or assets.
// Container reference: https://www.webmproject.org/docs/container/
const join=parts=>{const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let offset=0;for(const part of parts){out.set(part,offset);offset+=part.length;}return out;};
const bytes=(value,width)=>{const out=new Uint8Array(width);for(let i=width-1;i>=0;i--){out[i]=value%256;value=Math.floor(value/256);}return out;};
export function ebmlSize(value){
  if(!Number.isSafeInteger(value)||value<0)throw new RangeError('Invalid EBML size');
  for(let width=1;width<=8;width++)if(value<2**(7*width)-1){const out=bytes(value,width);out[0]|=2**(8-width);return out;}
  throw new RangeError('EBML size too large');
}
const idBytes=id=>bytes(id,Math.ceil(Math.log2(id+1)/8));
const element=(id,payload)=>join([idBytes(id),ebmlSize(payload.length),payload]);
const uint=(id,value)=>element(id,bytes(value,Math.max(1,Math.ceil(Math.log2(value+1)/8))));
const str=(id,value)=>element(id,new TextEncoder().encode(value));
const float=(id,value)=>{const data=new Uint8Array(8);new DataView(data.buffer).setFloat64(0,value);return element(id,data);};
export function muxWebM({packets,width,height,fps,durationMs}){
  if(!Number.isInteger(width)||width<=0||!Number.isInteger(height)||height<=0||!Number.isFinite(fps)||fps<=0||!Number.isFinite(durationMs)||durationMs<=0)throw new RangeError('Invalid video geometry or duration');
  if(!packets?.length||!packets[0].key)throw new TypeError('Video must start with a key frame');
  let previous=-1;
  for(const packet of packets){if(!(packet.data instanceof Uint8Array)||!packet.data.length||!Number.isFinite(packet.timestamp)||packet.timestamp<0||packet.timestamp<previous)throw new TypeError('Invalid or out-of-order packet');previous=packet.timestamp;}
  const header=element(0x1a45dfa3,join([uint(0x4286,1),uint(0x42f7,1),uint(0x42f2,4),uint(0x42f3,8),str(0x4282,'webm'),uint(0x4287,4),uint(0x4285,2)]));
  const info=element(0x1549a966,join([uint(0x2ad7b1,1000000),float(0x4489,durationMs),str(0x4d80,'Knowledge Atlas'),str(0x5741,'Knowledge Atlas local renderer')]));
  const track=element(0xae,join([uint(0xd7,1),uint(0x73c5,1),uint(0x83,1),uint(0x9c,0),str(0x86,'V_VP8'),uint(0x23e383,Math.round(1e9/fps)),element(0xe0,join([uint(0xb0,width),uint(0xba,height)]))]));
  const tracks=element(0x1654ae6b,track),clusters=[],cues=[];
  let group=[],base=0,position=info.length+tracks.length;
  function flush(){if(!group.length)return;const cluster=element(0x1f43b675,join([uint(0xe7,base),...group]));clusters.push(cluster);cues.push(element(0xbb,join([uint(0xb3,base),element(0xb7,join([uint(0xf7,1),uint(0xf1,position)]))])));position+=cluster.length;group=[];}
  for(const packet of packets){
    const ms=Math.round(packet.timestamp/1000);
    if(group.length&&(packet.key||ms-base>30000))flush();
    if(!group.length)base=ms;
    const block=new Uint8Array(4+packet.data.length);block[0]=0x81;new DataView(block.buffer).setInt16(1,ms-base);block[3]=packet.key?0x80:0;block.set(packet.data,4);group.push(element(0xa3,block));
  }
  flush();
  return join([header,element(0x18538067,join([info,tracks,...clusters,element(0x1c53bb6b,join(cues))]))]);
}
