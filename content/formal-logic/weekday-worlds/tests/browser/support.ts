import { expect, type Page } from "@playwright/test";
import { expectFrame } from "../../../../../tests/browser/support/frame.js";

export const questionFrame = {
	content: ["#reader-workbench>div:last-child", "#reader-workbench p", ".reader-scene:not([hidden]) .reader-copy"],
	controls: ["#reader-controls button", "#reader-workbench button", "#reader-workbench input", "#reader-workbench select", ".reader-menu summary"],
} as const;

export const weekdayFrame = {
	scrollableContainers: [".weekday-settings"],
	content: [
		...questionFrame.content,
		".weekday-bridge,.weekday-rule-table,.weekday-classical-proof,.weekday-frame-systems",
		".weekday-modal-introduction,.weekday-modal-intro-case,.weekday-modal-intro-worlds,.weekday-modal-intro-world",
		".weekday-intro-source",
		".weekday-intro-reasoning",
		".weekday-interpretation-comparison",
		".world-comparison",
		".weekday-sentence",
		".weekday-sentence-line",
		".weekday-sentence-question",
		".weekday-logic-diagram",
		".weekday-logic-premises",
		".weekday-logic-node",
		".weekday-logic-conclusion",
		".weekday-symbolic-summary",
		".weekday-settings",
		".weekday-input-panel",
		".weekday-reasoning-panel",
		".weekday-modal-diagram",
		".world-card",
		".world-cells",
		".world-cell",
		".world-note",
	],
	controls: [...questionFrame.controls.filter((selector) => selector !== "#reader-workbench input"), ".weekday-symbol-header"],
} as const;

export async function weekdayInputs(page: Page): Promise<void> {
	if ((await page.locator(".weekday-experiment").getAttribute("data-lesson-stage")) === "modal-comparison") {
		await expect(page.locator(".weekday-modal-introduction")).toBeVisible();
		await expect(page.locator(".weekday-input-panel")).toBeHidden();
		await expect(page.locator(".weekday-reasoning-panel")).toBeHidden();
		return;
	}
	await expect(page.locator(".weekday-input-panel")).toBeVisible();
	if (
		["question", "reason", "conditional", "notation", "inference", "nonmodal-proof", "modal-rules", "modal-systems"].includes(
			(await page.locator(".weekday-experiment").getAttribute("data-lesson-stage"))!,
		)
	)
		await expect(page.locator(".weekday-reasoning-panel")).toBeHidden();
	else await expect(page.locator(".weekday-reasoning-panel")).toBeVisible();
}

export async function weekdayReasoning(page: Page): Promise<void> {
	await weekdayInputs(page);
}

export async function weekdayView(page: Page, mode: string): Promise<void> {
	await weekdayInputs(page);
	const stage = await page.locator(".weekday-experiment").getAttribute("data-disclosure");
	if (stage !== "formal") return;
	await page.evaluate((modal) => {
		const state = window.__atlasRelated.getState();
		window.__atlasRelated.setState({ ...state, sceneId: modal ? "alethic" : "modal-expansion" });
	}, mode.includes("양상"));
}

export { expectFrame };
