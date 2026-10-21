import {line,point,sequence,text} from './svg.js';

export const numberSequences=[
  sequence('numbers-inverse',t=>{
    const x=400-250*t,value=2-5*t;
    return text(30,45,'더한 일을 되돌리는 수: 덧셈 역원')+line(70,190,540,190)+
      [-4,-3,-2,-1,0,1,2,3,4].map(n=>line(300+n*50,180,300+n*50,200)+text(290+n*50,235,String(n))).join('')+
      point(x,170)+text(35,90,'2에서 왼쪽으로 5만큼: 2 + (−5)')+text(35,300,`현재 위치 ${value.toFixed(1)} · 끝에서는 −3`);
  }),
  sequence('numbers-fractions',t=>{
    const split=t<0.5?2:4;
    return text(30,45,'조각을 더 나눠도 같은 양')+Array.from({length:split},(_,i)=>`<rect x="${50+i*500/split}" y="100" width="${500/split}" height="110" fill="${i<split/2?'#087f72':'#e1e7ee'}" stroke="white" stroke-width="4"/>`).join('')+
      text(50,260,split===2?'두 조각 중 하나: 1/2':'네 조각 중 둘: 2/4')+text(50,315,'이름은 둘, 가리키는 양은 하나');
  }),
  sequence('numbers-rotation',t=>{
    const a=t*Math.PI/2,x=2*Math.cos(a)+Math.sin(a),y=2*Math.sin(a)-Math.cos(a);
    return text(25,38,'i를 곱하면 반시계 방향 90°')+line(60,200,530,200)+line(260,65,260,315)+
      `<circle cx="260" cy="200" r="100" fill="none" stroke="#b9c9d1" stroke-dasharray="5 5"/>`+
      line(260,200,260+45*x,200-45*y)+point(260+45*x,200-45*y)+text(350,270,`(${x.toFixed(1)}, ${y.toFixed(1)})`)+
      text(25,345,'(2, −1) → (1, 2) · 길이² = 5');
  }),
] as const;
