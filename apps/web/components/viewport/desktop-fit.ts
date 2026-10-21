const BASE_WIDTH=960;
const BASE_HEIGHT=540;
const VIEWPORT_CONDITION=/\((min|max)-(width|height)\s*:\s*(\d+(?:\.\d+)?)px\)/g;
const VIEWPORT_UNIT=/(-?\d+(?:\.\d+)?)(d?v[hw])/g;

type MediaRecord=Readonly<{rule:CSSMediaRule;query:string}>;
type DeclarationRecord=Readonly<{style:CSSStyleDeclaration;property:string;value:string;priority:string}>;

const mediaRecords:MediaRecord[]=[];
const declarationRecords:DeclarationRecord[]=[];
let fitted=false;

function logicalMediaQuery(query:string):string{
  return query.replace(VIEWPORT_CONDITION,(_condition,limit:string,dimension:string,value:string)=>{
    const size=dimension==='width'?BASE_WIDTH:BASE_HEIGHT;
    const matches=limit==='min'?size>=Number(value):size<=Number(value);
    return matches?'(min-width:0px)':'(max-width:0px)';
  });
}

function logicalViewportValue(value:string):string{
  return value.replace(VIEWPORT_UNIT,(_unit,amount:string,kind:string)=>{
    const basis=kind.endsWith('w')?BASE_WIDTH:BASE_HEIGHT;
    return `${Number(amount)*basis/100}px`;
  });
}

function rewriteRules(rules:CSSRuleList):void{
  for(const rule of rules){
    if(rule instanceof CSSStyleRule){
      for(const property of rule.style){
        const value=rule.style.getPropertyValue(property);
        if(!VIEWPORT_UNIT.test(value)){VIEWPORT_UNIT.lastIndex=0;continue;}
        VIEWPORT_UNIT.lastIndex=0;
        declarationRecords.push({style:rule.style,property,value,priority:rule.style.getPropertyPriority(property)});
        rule.style.setProperty(property,logicalViewportValue(value),rule.style.getPropertyPriority(property));
      }
      continue;
    }
    if(rule instanceof CSSMediaRule){
      const query=rule.conditionText;
      const hasViewportCondition=VIEWPORT_CONDITION.test(query);
      VIEWPORT_CONDITION.lastIndex=0;
      if(hasViewportCondition){
        mediaRecords.push({rule,query});
        rule.media.mediaText=logicalMediaQuery(query);
        rewriteRules(rule.cssRules);
      }else rewriteRules(rule.cssRules);
    }
  }
}

function applyLogicalViewport():void{
  for(const sheet of document.styleSheets)rewriteRules(sheet.cssRules);
}

function restoreViewportStyles():void{
  for(const record of declarationRecords)record.style.setProperty(record.property,record.value,record.priority);
  for(const record of mediaRecords)record.rule.media.mediaText=record.query;
  declarationRecords.length=0;
  mediaRecords.length=0;
}

function updateDesktopFit():void{
  const scale=Math.min(innerWidth/BASE_WIDTH,innerHeight/BASE_HEIGHT);
  const shouldFit=innerWidth>=BASE_WIDTH&&innerHeight>=BASE_HEIGHT&&(innerWidth>BASE_WIDTH||innerHeight>BASE_HEIGHT);
  if(shouldFit&&!fitted){
    fitted=true;
    applyLogicalViewport();
    document.documentElement.classList.add('atlas-desktop-fit');
  }else if(!shouldFit&&fitted){
    fitted=false;
    document.documentElement.classList.remove('atlas-desktop-fit');
    restoreViewportStyles();
  }
  if(fitted){
    document.documentElement.style.setProperty('--atlas-desktop-scale',String(scale));
    document.documentElement.style.setProperty('--atlas-top-layer-shift-y',`${(BASE_HEIGHT-innerHeight/scale)/2}px`);
    document.documentElement.dataset.desktopScale=String(scale);
  }else{
    document.documentElement.style.removeProperty('--atlas-desktop-scale');
    document.documentElement.style.removeProperty('--atlas-top-layer-shift-y');
    delete document.documentElement.dataset.desktopScale;
  }
}

updateDesktopFit();
addEventListener('resize',updateDesktopFit);
