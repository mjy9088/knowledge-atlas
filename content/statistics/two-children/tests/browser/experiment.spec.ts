import { expect, test } from "@playwright/test";

test("two-children: exact reasoning is visible before sampling and after reset", async ({ page }) => {
	await page.goto("/knowledge/two-children/#filter");
	await page.waitForFunction(() => window.__atlasRelated);
	await expect(page.locator(".lab-tree circle")).toHaveCount(4);
	await expect(page.locator(".lab-tree text").filter({ hasText: "사전" })).toHaveCount(4);
	expect(await page.locator(".lab-count").inputValue()).toBe("0");
	await page.getByRole("button", { name: "10회", exact: true }).click();
	await page.getByRole("button", { name: "실험 초기화", exact: true }).click();
	await expect(page.locator(".lab-tree circle")).toHaveCount(4);
	expect(await page.locator(".lab-count").inputValue()).toBe("0");
	const state = await page.evaluate(() => window.__atlasRelated.getState());
	await page.locator("#reader-prev").click();
	await page.evaluate((saved) => window.__atlasRelated.setState(saved), state);
	expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(state);
});
