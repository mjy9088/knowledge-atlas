import {test,expect} from '@playwright/test';

for(const [from,to,last] of [
  ['counting-zero','negative-numbers','transfer'],
  ['negative-numbers','rational-numbers','transfer'],
  ['rational-numbers','rational-representations','transfer'],
  ['rational-numbers','irrational-numbers','transfer'],
  ['rational-representations','rational-density','transfer-result'],
  ['real-completeness','complex-numbers','transfer'],
] as const){
  test(`${from}: related questions offer the optional ${to} reader`,async({page})=>{
    await page.goto(`/knowledge/${from}/#${last}`);
    await page.waitForFunction(()=>window.__atlasRelated);
    await page.locator('#reader-next').click();
    const link=page.locator(`dialog[open] a[href="/knowledge/${to}/"]`);
    await expect(link).toBeVisible();
    await link.click();
    await expect(page.locator('main[data-page]')).toHaveAttribute('data-page',to);
  });
}
