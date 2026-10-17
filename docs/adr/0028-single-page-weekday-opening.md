# ADR 0028: One opening page for the attempt and reflection

Date: 2026-10-18. Status: implemented locally; content review and publication pending.

The user requested that answering, timeout and skipping lead naturally to “왜 그렇게 생각하셨나요?” without a fixed lower explanation panel, writing field or redundant expiry/problem text. Supersede ADR 0027's separate reflection scene and textarea, retaining its timer and model contracts.

The opening has one canonical scene ID, `question`, and two views derived from the validated challenge phase: ready/running shows the problem; answered/expired/skipped shows the reflection prompt. It counts as one of thirteen pages. The second view hides the original sentence, problem question, timer and choice controls. The common explanation band is hidden in both views and its grid track is removed; the action rail remains accessible without consuming a full-width blank band. Other scenes keep their explanation layout and navigation bounds.

The first Next action is labeled Skip and consumes the move to reflection. The next Next action advances to `conditional`. Choice and timeout show reflection automatically without changing scene ID, progress or hash, and focus its heading. Retry explicitly starts a fresh attempt. Cover navigation, direct entry, back navigation, seek and restored phase must select the same view without visit history. The optional pre-Next hook now returns whether it consumed navigation; adapters without it keep ordinary behavior.

Merge the former `block:logic.weekday-worlds.reason` into the existing question block, retiring its separate scene/block instead of leaving uncovered source text. Other block IDs remain unchanged. Old `#reason` links and saved scene IDs alias to the canonical opening; saved answered/expired/skipped phases restore reflection. An old link without saved phase starts at the problem. Keep legacy `example: reason` and the bounded `challenge.reason` field readable without exposing a writing UI or erasing old saved text.

Verify choice, exact timeout, skip before and after start, keyboard skip, retry, independent frozen seek, restore and reset. Check one menu/progress entry, no lower explanation reserve, no writing field or duplicate opening text, focus and fixed action bounds. Use the static build with standalone Playwright at desktop, narrow and 960×540 CSS/DPR 2 video sizes; inspect both opening views. No scientific fixtures or publication status change.
