import { expect, test } from "@playwright/test";

test('local media tool loads its moved dependencies and draws the selected projection',async({page})=>{
  const errors: string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4191/tools/media/');
  await expect(page.locator('#render-plan')).toContainText('134.0초 · 1080×1440 · 4020프레임');
  await expect(page.locator('#render-caption')).toContainText('0.0초');
  await page.locator('#render-format').selectOption('landscape');
  await expect(page.locator('#render-canvas')).toHaveAttribute('width','1920');
  await expect(page.locator('#render-canvas')).toHaveAttribute('height','1080');
  await page.locator('#render-seek').evaluate(input=>{(input as HTMLInputElement).value='64000';input.dispatchEvent(new Event('input',{bubbles:true}));});
  await expect(page.locator('#render-caption')).toContainText('64.0초');
  expect(errors).toEqual([]);
});
