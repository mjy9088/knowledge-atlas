export type FigureDimensions={readonly width:number;readonly height:number};

export function svgViewBoxDimensions(svg:string):FigureDimensions{
  const tag=/<svg\b[^>]*>/iu.exec(svg)?.[0];
  const viewBox=tag&&/\bviewBox\s*=\s*["']\s*[-+\d.eE]+\s+[-+\d.eE]+\s+([-+\d.eE]+)\s+([-+\d.eE]+)\s*["']/iu.exec(tag);
  const width=viewBox?Number(viewBox[1]):Number.NaN,height=viewBox?Number(viewBox[2]):Number.NaN;
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)throw new RangeError('SVG needs a positive viewBox');
  return{width,height};
}
