import { expect, test } from "@playwright/test";

test("possibility lab rejects extra saved fields without mutating its snapshot", async ({ page }) => {
	// Given a mounted model interaction.
	await page.goto("/knowledge/monty-hall/");
	await page.waitForFunction(() => window.__atlasRelated);
	const before = await page.evaluate(() => window.__atlasRelated.getState());

	// When its LabState contains an undeclared field.
	const rejected = await page.evaluate((snapshot) => {
		try {
			window.__atlasRelated.setState({ ...snapshot, interaction: { ...snapshot.interaction, unexpected: true } } as never);
			return false;
		} catch {
			return true;
		}
	}, before);

	// Then the complete reader and interaction snapshot is unchanged.
	expect(rejected).toBe(true);
	expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(before);
});
