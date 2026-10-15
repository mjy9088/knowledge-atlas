import {test, expect} from '@playwright/test';
import {RELATED_PAGES} from '../../content/formal-logic/explosion/related-pages.mjs';
import {EXPLOSION_EPISODE} from '../../content/formal-logic/explosion/episode.mjs';

// Measure content, not just CSS overflow:hidden: clipped scroll containers fail too.
async function expectFrame(page, {content, controls}) {
  const problems = await page.evaluate(({content, controls}) => {
    const issues = [];
    const root = document.documentElement;
    if (root.scrollHeight > innerHeight || root.scrollWidth > innerWidth)
      issues.push(`document ${root.scrollWidth}×${root.scrollHeight} exceeds ${innerWidth}×${innerHeight}`);
    for (const selector of [...content, ...controls])
      if (!document.querySelector(selector)) issues.push(`missing layout target: ${selector}`);
    for (const selector of content) for (const node of document.querySelectorAll(selector)) {
      if (!node.checkVisibility()) continue;
      if (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth)
        issues.push(`${selector}: content ${node.scrollWidth}×${node.scrollHeight}, space ${node.clientWidth}×${node.clientHeight}`);
      const r = node.getBoundingClientRect();
      if (r.top < 0 || r.left < 0 || r.bottom > innerHeight || r.right > innerWidth)
        issues.push(`${selector}: content outside viewport`);
    }
    for (const selector of controls) for (const node of document.querySelectorAll(selector)) {
      if (!node.checkVisibility()) continue;
      const r = node.getBoundingClientRect();
      if (r.top < 0 || r.left < 0 || r.bottom > innerHeight || r.right > innerWidth)
        issues.push(`${selector}: outside viewport (${r.x}, ${r.y}, ${r.width}, ${r.height})`);
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      if (!hit || (!node.contains(hit) && !hit.contains(node))) issues.push(`${selector}: obscured`);
    }
    return issues;
  }, {content, controls});
  expect(problems).toEqual([]);
}
const relatedFrame = {
  content: ['.reader-copy:not([hidden])', '.explorer-diagram', '.explorer-lines', '.experiment-premises'],
  controls: ['#reader-controls button', '.experiment-goal', '.experiment-heading button', '.reader-menu summary'],
};
const lessonFrame = {
  content: ['#lesson-dialogue-copy', '#lesson-stage', '.experiment-premises'],
  controls: ['.dialogue-actions button', '.experiment-goal', '#lesson-menu-open'],
};

for (const reader of RELATED_PAGES) test(`${reader.slug}: every scene and rule example fits`, async ({page}, testInfo) => {
  await page.goto(`/knowledge/${reader.slug}/`);
  await page.waitForFunction(() => window.__atlasRelated);
  for (let index = 0; index < reader.scenes.length; index++) {
    await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id', reader.scenes[index].id);
    await test.step(reader.scenes[index].id, () => expectFrame(page, relatedFrame));
    if (index + 1 < reader.scenes.length) await page.locator('#reader-next').click();
  }
  await expect(page.locator('#reader-end-links')).toBeVisible();
  if (reader.model === 'ch') await testInfo.attach('final-scene', {body: await page.screenshot(), contentType: 'image/png'});
  for (const preset of await page.locator('#reader-presets button').all()) {
    await preset.click();
    await expectFrame(page, relatedFrame);
  }
  await page.locator('.reader-menu summary').click();
  await page.locator('.reader-menu a[href="#evidence"]').click();
  await expect(page.locator('dialog[open]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await expectFrame(page, relatedFrame);
});

test('direct links restore the requested scene and typing arrows does not navigate', async ({page}) => {
  await page.goto('/lesson.html#explanation-remove-premise');
  await page.waitForFunction(() => window.__atlasLesson);
  await expect.poll(() => page.evaluate(() => window.__atlasLesson.getState().sectionId)).toBe('remove-premise');
  const goal = page.getByRole('textbox', {name: '목표 명제식', exact: true});
  await goal.focus();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.evaluate(() => window.__atlasLesson.getState().sectionId)).toBe('remove-premise');
  await expectFrame(page, lessonFrame);
});

test('desktop knowledge index fits with accessible topic cards', async ({page}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The narrow index is a normal scrolling document.');
  await page.goto('/knowledge/');
  await expect(page.locator('.knowledge-card')).toHaveCount(4);
  await expectFrame(page, {content: ['.knowledge-card'], controls: ['a.knowledge-card']});
});

test('lesson: every explanation fits and keyboard navigation works', async ({page}) => {
  await page.goto('/lesson.html');
  await page.waitForFunction(() => window.__atlasLesson);
  for (let index = 0; index < EXPLOSION_EPISODE.sections.length; index++) {
    await expect.poll(() => page.evaluate(() => window.__atlasLesson.getState().sectionId)).toBe(EXPLOSION_EPISODE.sections[index].id);
    await test.step(EXPLOSION_EPISODE.sections[index].id, () => expectFrame(page, lessonFrame));
    if (index + 1 < EXPLOSION_EPISODE.sections.length) await page.locator('#lesson-next').click();
  }
  await expect(page.locator('.lesson-end-links')).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect.poll(() => page.evaluate(() => window.__atlasLesson.getState().sectionId)).toBe('consistency');
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.evaluate(() => window.__atlasLesson.getState().sectionId)).toBe('summary');
});

test('edited inputs invalidate dialogue and proof, survive navigation, and reset', async ({page}) => {
  await page.goto('/knowledge/zfc/');
  await page.waitForFunction(() => window.__atlasRelated);
  const goal = page.getByRole('textbox', {name: '목표 명제식', exact: true});
  await goal.fill('invalid(');
  await expect(page.locator('.reader-scene:visible .reader-copy')).toHaveAttribute('data-status', 'invalid');
  await expect(page.locator('.explorer-lines button')).toHaveCount(0);
  await page.locator('#reader-next').click();
  await expect(goal).toHaveValue('invalid(');
  await expectFrame(page, relatedFrame);
  await page.getByRole('button', {name: '장면 예시로', exact: true}).click();
  await expect(page.locator('.explorer-lines button').first()).toBeVisible();
  await expectFrame(page, relatedFrame);
});

test('eight premises remain editable without pushing navigation outside the frame', async ({page}) => {
  await page.goto('/knowledge/zfc/');
  await page.waitForFunction(() => window.__atlasRelated);
  const add = page.getByRole('button', {name: '+ 전제', exact: true});
  while (await add.isEnabled()) await add.click();
  const rows = page.locator('.experiment-premises input[type=text]');
  await expect(rows).toHaveCount(8);
  await rows.last().fill('x ∈ A');
  // Long, user-created collections may scroll inside their editor; default scenes may not.
  await expectFrame(page, {...relatedFrame, content: []});
  await page.locator('#reader-next').click();
  await expect(rows.last()).toHaveValue('x ∈ A');
  await page.getByRole('button', {name: '장면 예시로', exact: true}).click();
  await expectFrame(page, relatedFrame);
});

