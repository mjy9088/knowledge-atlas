import {readFileSync} from 'node:fs';
import {expect,test} from '@playwright/test';

test('light-clock source figure preserves the proper-time and moving-frame geometry',async({page},testInfo)=>{
  // Given the retained owned SVG source independently of its retired public screen.
  await page.setContent(readFileSync(new URL('../../light-clock.svg',import.meta.url),'utf8'));
  // When the four semantic paths are measured by the browser SVG engine.
  const lengths=await page.evaluate(()=>{
    const lengthOf=(id:string):number=>{const geometry=document.getElementById(id);if(!(geometry instanceof SVGGeometryElement))throw new TypeError(`Expected SVG geometry: ${id}`);return geometry.getTotalLength();};
    return{restL:lengthOf('rest-L'),movingL:lengthOf('moving-L'),clockDisplacement:lengthOf('clock-displacement'),lightDistance:lengthOf('light-distance')};
  });
  // Then the original geometric ratios remain unchanged.
  expect(lengths.restL).toBeCloseTo(lengths.movingL,5);
  expect(lengths.clockDisplacement/lengths.lightDistance).toBeCloseTo(0.6,5);
  expect(lengths.lightDistance/lengths.movingL).toBeCloseTo(1.25,5);
  await testInfo.attach('light-clock-geometry',{body:Buffer.from(JSON.stringify(lengths,null,2)),contentType:'application/json'});
});
