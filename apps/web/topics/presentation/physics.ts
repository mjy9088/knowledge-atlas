import {line,point,sequence,text} from './svg.js';

export const physicsSequences=[
  sequence('physics-prediction',t=>text(25,40,'힘이 없다면 같은 시간에 같은 거리')+
    line(50,200,550,200)+[0,1,2,3,4].map(i=>line(70+i*110,190,70+i*110,210)+text(55+i*110,250,`${i}초`)).join('')+
    point(70+440*t,180)+text(30,95,'처음 위치와 속도로 다음 위치를 예측')+text(30,320,'예시 모형: 마찰과 공기 저항은 제외')),
  sequence('physics-scattering',t=>{
    const end=50+500*t;
    const paths=[90,130,170,210].map(y=>line(50,y,Math.min(end,550),y)).join('');
    return text(20,38,'대부분 통과, 일부는 크게 방향을 바꿈')+`<rect x="290" y="65" width="8" height="200" fill="#b36a17"/>`+paths+
      `<path d="M50 250 H260 Q300 250 255 300 L210 320" fill="none" stroke="#087f72" stroke-width="4"/>`+
      [90,130,170,210].map(y=>point(end,y)).join('')+point(t<.45?50+460*t:260-100*(t-.45),t<.45?250:250+100*(t-.45),'#b36a17')+
      text(335,300,'얇은 금속박')+text(20,350,'개념도 · 실제 비율·크기·입자 궤적 자료 아님');
  }),
  sequence('physics-energy',t=>{
    const upper=90,lower=235,y=upper+(lower-upper)*t;
    return text(25,40,'수소의 두 에너지 차이와 빛')+line(70,upper,340,upper)+line(70,lower,340,lower)+
      text(355,upper+10,'3: −1.51 eV')+text(355,lower+10,'2: −3.40 eV')+point(190,y)+
      text(35,295,'차이 약 1.89 eV → 파장 약 656 nm')+text(35,340,'에너지 도식 · 전자의 공간 궤적이 아님');
  }),
] as const;
