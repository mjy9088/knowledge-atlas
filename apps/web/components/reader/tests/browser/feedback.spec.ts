import { expect, test } from "@playwright/test";

test('availability feedback supports non-logic content and deterministic restoration',async({page})=>{
  await page.goto('/knowledge/');
  const results=await page.evaluate(async()=>{
    const {mountEvaluationFeedback}=await import('/components/reader/evaluation-feedback.js');
    const content=document.createElement('section'),message=document.createElement('p');
    content.textContent='Measurement details';document.body.append(content,message);
    const component=mountEvaluationFeedback({content,message});
    const unavailable={available:false,summary:'Calibration unavailable',detail:'Choose a calibrated sample.'};
    component.setState(unavailable);
    const blocked={hidden:content.hidden,disabled:content.getAttribute('aria-disabled'),text:message.textContent};
    const snapshot=component.getState();snapshot.available=true;
    let rejected=false;try{component.setState({available:true,summary:42 as never,detail:''});}catch{rejected=true;}
    const unchanged=component.getState();component.reset();
    const reset={hidden:content.hidden,messageHidden:message.hidden};component.setState(unavailable);
    return {blocked,rejected,unchanged,reset,restored:component.getState()};
  });
  expect(results.blocked).toEqual({hidden:true,disabled:'true',text:'Calibration unavailableChoose a calibrated sample.'});
  expect(results.rejected).toBe(true);expect(results.unchanged).toEqual(results.restored);
  expect(results.reset).toEqual({hidden:false,messageHidden:true});
});
