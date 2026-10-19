import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {chromium, type Browser, type Page} from '@playwright/test';
import {NUCLEAR_EVIDENCE_STEPS} from '../packages/projection/nuclear-evidence.js';

type Viewport = Readonly<{width: number; height: number; name: string; deviceScaleFactor: number}>;
type CaptureOptions = Readonly<{browser: Browser; viewport: Viewport; evidenceDirectory: string; buildId: string}>;

const route = 'http://127.0.0.1:4174/knowledge/nuclear-constituents/#proton';

async function seek(page: Page, timeMs: number): Promise<void> {
  await page.evaluate(value => {
    const api = Reflect.get(window, '__atlasRelated');
    if (typeof api !== 'object' || api === null) throw new TypeError('Missing reader API');
    const seekTo = Reflect.get(api, 'seek');
    if (typeof seekTo !== 'function') throw new TypeError('Missing reader seek');
    Reflect.apply(seekTo, api, [value]);
  }, timeMs);
}

async function capture(options: CaptureOptions) {
  const context = await options.browser.newContext({
    viewport: options.viewport,
    deviceScaleFactor: options.viewport.deviceScaleFactor,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  await page.goto(route);
  await page.locator('.nuclear-evidence').waitFor();
  const canonicalProse = await page.locator('.reader-scene:not([hidden]) .scene-prose').textContent();
  const stageMeasurements = [];
  for (const timeMs of NUCLEAR_EVIDENCE_STEPS) {
    await seek(page, timeMs);
    stageMeasurements.push(await page.evaluate(() => {
      const elements = [
        document.querySelector<HTMLElement>('.reader-menu summary'),
        document.querySelector<HTMLElement>('.reader-workbench'),
        document.querySelector<HTMLElement>('.nuclear-evidence'),
        document.querySelector<HTMLElement>('.reader-scene:not([hidden]) .reader-dialogue'),
        document.querySelector<HTMLElement>('.nuclear-evidence-history'),
        document.querySelector<HTMLElement>('#reader-controls'),
      ];
      if (elements.some(element => element === null)) throw new TypeError('Missing stage surface');
      const present = elements.filter((element): element is HTMLElement => element !== null);
      return {
        stage: document.querySelector<HTMLElement>('.nuclear-evidence')?.dataset.stage,
        minimumTop: Math.min(...present.map(element => element.getBoundingClientRect().top)),
        maximumRight: Math.max(...present.map(element => element.getBoundingClientRect().right)),
        maximumBottom: Math.max(...present.map(element => element.getBoundingClientRect().bottom)),
        internalOverflow: present.map(element => element.scrollHeight - element.clientHeight),
        documentOverflow: {
          horizontal: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          vertical: document.documentElement.scrollHeight - document.documentElement.clientHeight,
        },
      };
    }));
  }
  assert.deepEqual(stageMeasurements.map(item => item.stage), ['setup', 'contact', 'emission', 'inference']);
  assert.ok(stageMeasurements.every(item => item.minimumTop >= -1 && item.maximumRight <= options.viewport.width + 1 && item.maximumBottom <= options.viewport.height + 1));
  assert.ok(stageMeasurements.every(item => item.internalOverflow.every(overflow => overflow <= 1)));
  assert.ok(stageMeasurements.every(item => item.documentOverflow.horizontal <= 1 && item.documentOverflow.vertical <= 1));
  assert.equal(await page.locator('.reader-scene:not([hidden]) .scene-prose').textContent(), canonicalProse);
  await seek(page, 4_800);
  const screenshot = resolve(options.evidenceDirectory, `nuclear-reflow-${options.buildId}-${options.viewport.name}.png`);
  await page.screenshot({path: screenshot});
  const measurement = await page.evaluate(() => {
    const visibleDiagram = [...document.querySelectorAll<SVGSVGElement>('.nuclear-evidence-diagram')]
      .find(element => getComputedStyle(element).display !== 'none');
    if (!visibleDiagram) throw new TypeError('Missing visible diagram');
    const textHeights = [...visibleDiagram.querySelectorAll('text')]
      .filter(element => getComputedStyle(element).opacity !== '0')
      .map(element => element.getBoundingClientRect().height)
      .filter(height => height > 0);
    const controls = [...document.querySelectorAll<HTMLElement>('.nuclear-evidence-controls button')]
      .map(element => ({label: element.textContent, width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height}));
    const scope = document.querySelector<HTMLElement>('.nuclear-evidence-scope');
    const history = document.querySelector<HTMLElement>('.nuclear-evidence-history');
    const process = document.querySelector<HTMLElement>('.nuclear-evidence');
    const dialogue = document.querySelector<HTMLElement>('.reader-scene:not([hidden]) .reader-dialogue');
    const workbench = document.querySelector<HTMLElement>('.reader-workbench');
    const menu = document.querySelector<HTMLElement>('.reader-menu summary');
    const readerControls = document.querySelector<HTMLElement>('#reader-controls');
    if (!scope || !history || !process || !dialogue || !workbench || !menu || !readerControls) throw new TypeError('Missing measured surface');
    const inspected = [process, dialogue, workbench, menu, readerControls];
    return {
      viewport: {width: innerWidth, height: innerHeight},
      diagram: {width: visibleDiagram.getBoundingClientRect().width, height: visibleDiagram.getBoundingClientRect().height},
      minimumVisibleSvgTextHeight: Math.min(...textHeights),
      scopeFontSize: Number.parseFloat(getComputedStyle(scope).fontSize),
      historyFontSize: Number.parseFloat(getComputedStyle(history).fontSize),
      controls,
      minimumContentTop: Math.min(...inspected.map(element => element.getBoundingClientRect().top)),
      maximumContentBottom: Math.max(...inspected.map(element => element.getBoundingClientRect().bottom)),
      internalOverflow: inspected.map(element => ({className: element.className, overflow: element.scrollHeight - element.clientHeight})),
      stage: process.dataset.stage,
      hydrogenOpacity: getComputedStyle(visibleDiagram.querySelector('.nuclear-hydrogen') ?? visibleDiagram).opacity,
      inferenceOpacity: getComputedStyle(visibleDiagram.querySelector('.nuclear-inference') ?? visibleDiagram).opacity,
    };
  });
  assert.ok(measurement.minimumVisibleSvgTextHeight >= 11.99, `SVG text rendered at ${measurement.minimumVisibleSvgTextHeight}px`);
  assert.ok(measurement.scopeFontSize >= 12 && measurement.historyFontSize >= 12);
  assert.ok(measurement.controls.every(control => control.width >= 44 && control.height >= 44), JSON.stringify(measurement.controls));
  assert.ok(measurement.minimumContentTop >= -1, `${measurement.minimumContentTop}px starts above viewport`);
  assert.ok(measurement.maximumContentBottom <= options.viewport.height + 1, `${measurement.maximumContentBottom}px exceeds viewport`);
  assert.ok(measurement.internalOverflow.every(item => item.overflow <= 1), JSON.stringify(measurement.internalOverflow));
  assert.equal(measurement.stage, 'inference');
  assert.equal(measurement.hydrogenOpacity, '1');
  assert.equal(measurement.inferenceOpacity, '1');
  await seek(page, 1_600);
  const independent = await page.locator('.nuclear-evidence').evaluate(element => ({
    stage: element.getAttribute('data-stage'),
    hydrogenOpacity: getComputedStyle(element.querySelector('.nuclear-evidence-diagram:not([hidden]) .nuclear-hydrogen') ?? element).opacity,
    inferenceOpacity: getComputedStyle(element.querySelector('.nuclear-evidence-diagram:not([hidden]) .nuclear-inference') ?? element).opacity,
  }));
  assert.deepEqual(independent, {stage: 'contact', hydrogenOpacity: '0', inferenceOpacity: '0'});
  await page.getByRole('button', {name: '처음부터'}).click();
  await page.waitForFunction(() => document.querySelector('.nuclear-evidence')?.getAttribute('data-stage') === 'contact');
  await page.getByRole('button', {name: '일시정지'}).click();
  await context.close();
  return {screenshot, measurement, stageMeasurements};
}

const evidenceDirectory = resolve('test-results/content-quality/physics');
await mkdir(evidenceDirectory, {recursive: true});
const manifest = await readFile(resolve('dist/build-manifest.json'));
const buildId = createHash('sha256').update(manifest).digest('hex');
const browser = await chromium.launch();
const captures = [];
for (const viewport of [
  {width: 390, height: 844, name: '390', deviceScaleFactor: 1},
  {width: 960, height: 540, name: '960-dpr2', deviceScaleFactor: 2},
  {width: 1920, height: 1080, name: '1920', deviceScaleFactor: 1},
]) {
  captures.push(await capture({browser, viewport, evidenceDirectory, buildId}));
}
const reduced = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
const reducedPage = await reduced.newPage();
await reducedPage.goto(route);
const play = reducedPage.getByRole('button', {name: '자동 재생 꺼짐'});
assert.equal(await play.isDisabled(), true);
await reducedPage.getByRole('button', {name: '다음 단계 →'}).click();
assert.equal(await reducedPage.locator('.nuclear-evidence').getAttribute('data-stage'), 'contact');
await reducedPage.getByRole('slider', {name: '양성자 증거 과정 위치'}).fill('3200');
assert.equal(await reducedPage.locator('.nuclear-evidence').getAttribute('data-stage'), 'emission');
await reduced.close();
await browser.close();
const report = {buildManifestSha256: buildId, captures, reducedMotion: {automaticPlaybackDisabled: true, manualStep: 'contact', manualSeek: 'emission'}};
const reportPath = resolve(evidenceDirectory, `nuclear-reflow-${buildId}-measurements.json`);
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({...report, reportPath}, null, 2)}\n`);
