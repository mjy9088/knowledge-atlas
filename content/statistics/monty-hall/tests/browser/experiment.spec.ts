import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

async function expectWeights(row: Locator, expected: readonly [string, string, string, string]) {
	await expect(row.locator(".lab-prior")).toHaveText(expected[0]);
	await expect(row.locator(".lab-likelihood")).toHaveText(expected[1]);
	await expect(row.locator(".lab-mass")).toHaveText(expected[2]);
	await expect(row.locator(".lab-posterior")).toHaveText(expected[3]);
}

test("monty-hall: exact reasoning is visible before sampling and after reset", async ({ page }) => {
	await page.goto("/knowledge/monty-hall/#compare");
	await page.waitForFunction(() => window.__atlasRelated);
	const cases = page.locator(".lab-ledger tbody tr");
	await expect(cases).toHaveCount(3);
	await expectWeights(page.locator('[data-case="door-1"]'), ["1/3", "1", "1/3", "1/2"]);
	await expectWeights(page.locator('[data-case="door-2"]'), ["1/3", "1/2", "1/6", "1/4"]);
	await expectWeights(page.locator('[data-case="door-3"]'), ["1/3", "1/2", "1/6", "1/4"]);
	await expect(page.locator(".lab-event")).toContainText("선택하지 않은 문 중 염소 문 하나가 열림");
	await expect(page.locator(".lab-equation")).toContainText("1/3 ÷ 2/3 = 1/2");
	await page.locator(".lab-choice").selectOption("2");
	await expectWeights(page.locator('[data-case="door-2"]'), ["1/3", "1", "1/3", "1/2"]);
	await expectWeights(page.locator('[data-case="door-1"]'), ["1/3", "1/2", "1/6", "1/4"]);
	await page.locator(".lab-mode").selectOption("informed");
	await expectWeights(page.locator('[data-case="door-1"]'), ["1/3", "1", "1/3", "1/3"]);
	await expectWeights(page.locator('[data-case="door-2"]'), ["1/3", "1", "1/3", "1/3"]);
	await expectWeights(page.locator('[data-case="door-3"]'), ["1/3", "1", "1/3", "1/3"]);
	await expect(page.locator(".lab-equation")).toContainText("2/3 ÷ 1 = 2/3");
	await expect(page.locator(".reader-scene:not([hidden]) .scene-prose")).toContainText("본문의 정답을 모르고 미선택 문을 균등하게 여는 절차와 달리");
	expect(await page.locator(".lab-count").inputValue()).toBe("0");
	await page.locator(".lab-sampling summary").click();
	await page.getByRole("button", { name: "10회", exact: true }).click();
	await page.getByRole("button", { name: "실험 초기화", exact: true }).click();
	await expect(cases).toHaveCount(3);
	await expectWeights(page.locator('[data-case="door-1"]'), ["1/3", "1", "1/3", "1/2"]);
	await expect(page.locator(".lab-equation")).toContainText("1/3 ÷ 2/3 = 1/2");
	expect(await page.locator(".lab-count").inputValue()).toBe("0");
	await page.getByRole("button", { name: "10회", exact: true }).click();
	await expect(page.locator(".reader-scene:not([hidden]) .scene-prose")).toContainText("본문과 같은 정답을 모르고 미선택 문을 균등하게 여는 절차");
	await expect(page.locator(".reader-scene:not([hidden]) .scene-prose")).toContainText("표본 실험");
	const state = await page.evaluate(() => window.__atlasRelated.getState());
	await page.locator("#reader-prev").click();
	await page.evaluate((saved) => window.__atlasRelated.setState(saved), state);
	expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(state);
});
