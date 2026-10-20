import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

async function expectWeights(row: Locator, expected: readonly [string, string, string, string]) {
	await expect(row.locator(".lab-prior")).toHaveText(expected[0]);
	await expect(row.locator(".lab-likelihood")).toHaveText(expected[1]);
	await expect(row.locator(".lab-mass")).toHaveText(expected[2]);
	await expect(row.locator(".lab-posterior")).toHaveText(expected[3]);
}

test("two-children: exact reasoning is visible before sampling and after reset", async ({ page }) => {
	await page.goto("/knowledge/two-children/#filter");
	await page.waitForFunction(() => window.__atlasRelated);
	const cases = page.locator(".lab-ledger tbody tr");
	await expect(cases).toHaveCount(4);
	await expectWeights(page.locator('[data-case="BB"]'), ["1/4", "1", "1/4", "1/3"]);
	await expectWeights(page.locator('[data-case="BG"]'), ["1/4", "1", "1/4", "1/3"]);
	await expectWeights(page.locator('[data-case="GB"]'), ["1/4", "1", "1/4", "1/3"]);
	await expectWeights(page.locator('[data-case="GG"]'), ["1/4", "0", "0", "0"]);
	await expect(page.locator(".lab-equation")).toContainText("1/4 ÷ 3/4 = 1/3");
	await page.locator(".lab-mode").selectOption("child");
	await expectWeights(page.locator('[data-case="BB"]'), ["1/4", "1", "1/4", "1/2"]);
	await expectWeights(page.locator('[data-case="BG"]'), ["1/4", "1/2", "1/8", "1/4"]);
	await expectWeights(page.locator('[data-case="GB"]'), ["1/4", "1/2", "1/8", "1/4"]);
	await expectWeights(page.locator('[data-case="GG"]'), ["1/4", "0", "0", "0"]);
	await expect(page.locator(".lab-equation")).toContainText("1/4 ÷ 1/2 = 1/2");
	await expect(page.locator(".reader-scene:not([hidden]) .scene-prose")).toContainText("본문의 가족에게 적어도 한 명이 아들인지 묻는 절차와 달리");
	expect(await page.locator(".lab-count").inputValue()).toBe("0");
	await page.locator(".lab-sampling summary").click();
	await page.getByRole("button", { name: "10회", exact: true }).click();
	await page.getByRole("button", { name: "실험 초기화", exact: true }).click();
	await expect(cases).toHaveCount(4);
	await expect(page.locator(".lab-equation")).toContainText("1/4 ÷ 3/4 = 1/3");
	expect(await page.locator(".lab-count").inputValue()).toBe("0");
	await page.getByRole("button", { name: "10회", exact: true }).click();
	await expect(page.locator(".reader-scene:not([hidden]) .scene-prose")).toContainText("본문과 같은 가족에게 적어도 한 명이 아들인지 묻는 절차");
	await expect(page.locator(".reader-scene:not([hidden]) .scene-prose")).toContainText("표본 실험");
	const state = await page.evaluate(() => window.__atlasRelated.getState());
	await page.locator("#reader-prev").click();
	await page.evaluate((saved) => window.__atlasRelated.setState(saved), state);
	expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(state);
	await page.evaluate(() => window.__atlasRelated.setState({sceneId: "model"}));
	await expect(page.locator("#reader-workbench")).toBeHidden();
	await expect(page.locator("#model .scene-figure")).toBeVisible();
	expect(await page.locator("#model .reader-copy").getAttribute("data-status")).toBe("example");
	await page.evaluate((saved) => window.__atlasRelated.setState(saved), state);
	expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(state);
});
