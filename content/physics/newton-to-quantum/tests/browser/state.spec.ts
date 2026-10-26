import { expect, test } from "@playwright/test";

test("the physics-history orbital adapter exposes mutation-free preflight before reader restoration", async ({ page }) => {
	await page.goto("/knowledge/newton-to-quantum/orbital-density/");
	const result = await page.evaluate(async () => {
		const { mountTopicInteraction } = await import("/topics/registry.js");
		const container = document.createElement("div");
		document.body.append(container);
		let changes = 0;
		const adapter = mountTopicInteraction("physics-history", container, {
			onChange() {
				changes++;
			},
		});
		const before = adapter.getState();
		if (!adapter.validateState) return { preflight: false, changes, unchanged: false };
		adapter.validateState(before);
		try {
			adapter.validateState({ customized: false, orbital: { n: 99, basis: "s", Z: 1 }, view: {} });
		} catch {
			return { preflight: true, changes, unchanged: JSON.stringify(before) === JSON.stringify(adapter.getState()) };
		}
		return { preflight: true, changes, unchanged: false };
	});
	expect(result).toEqual({ preflight: true, changes: 0, unchanged: true });
});
