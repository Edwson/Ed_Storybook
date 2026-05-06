# Push to GitHub — v0.5.1 Theme fix + 11 new components

## What this push includes

**Theme switching fix (the key bug you reported)**
- `.storybook/preview.js` — new `forceRootDataTheme` decorator that sets `data-theme` on `<html>` for **both canvas and docs iframes**. Storybook's built-in theme decorator only applied it to canvas — docs pages never flipped before.
- `.storybook/storybook-brand.css` — comprehensive override block for Storybook autodocs internals: `.sbdocs h1-h6 / p / li / strong / a / code / pre / table / th / td`, the right-rail TOC (`.toc-link`), all docblock variants (`.docblock-source / -argstable / -arginfo`), and the `.sb-errordisplay` fallback that was rendering black-on-dark when stories failed.

**11 new components (v0.4 + v0.5 work that never reached origin)**
- Components: Card, Alert, Tooltip
- Primitives: Avatar
- Compliance: KYC Step, FIX State Chip, Threshold Band
- Financial: Order Row, Position Row, VIX Chip
- Patterns: Dashboard Grid (the showpiece — composes 10 components into a Bloomberg-class trading-desk surface)

**All existing component CSS migrated to theme-aware semantic tokens** so colour values flip automatically per `data-theme`.

---

## Run these commands from your terminal

```bash
cd ~/Desktop/Ed_portfolio_May_01/storybook-next

# 1. Quick safety backup (optional — skip if you're confident)
cp -r . ../storybook-next.bak

# 2. Sync references with origin (no working-tree changes)
git fetch origin

# 3. Move HEAD to origin/main but KEEP working tree intact.
#    --soft means: pointer moves, files stay. Your local v0.4 + v0.5
#    work all stays in the working dir; the divergent local f8006f7
#    commit is dropped (its content is preserved in the working tree).
git reset --soft origin/main

# 4. Stage everything (modified + new files + new dirs)
git add -A

# 5. Commit with a clean v0.5.1 message
git commit -m "v0.5.1 — Theme fix on docs + 11 new components

Theme switching now works on autodocs pages too:
- forceRootDataTheme decorator sets data-theme on iframe root
  (covers both canvas + docs views)
- Comprehensive .sbdocs override block in storybook-brand.css
  covers TOC, error display, tables, links, code, docblocks

11 new components shipped (v0.4 + v0.5 work):
- Components: Card, Alert, Tooltip
- Primitives: Avatar
- Compliance: KYC Step, FIX State Chip, Threshold Band
- Financial: Order Row, Position Row, VIX Chip
- Patterns: Dashboard Grid (showpiece composition)
- Editorial: Stance.mdx + Welcome.mdx polish

All component CSS migrated to theme-aware semantic tokens.
See CHANGELOG.md for full v0.5.0 + v0.5.1 details."

# 6. Push
git push origin main
```

That's it. The GitHub Actions workflow (`Build & Deploy Storybook`) will fire automatically on push and rebuild `edwson.github.io/Ed_Storybook/` in about 50 seconds.

---

## What to verify after the deploy completes

Open these URLs (give the GitHub Action ~1 minute to finish first):

1. **`https://edwson.github.io/Ed_Storybook/?path=/docs/welcome--docs`** — text in dark theme should be visible. Toggle to Salt Light, text should still be visible.
2. **`https://edwson.github.io/Ed_Storybook/?path=/docs/patterns-dashboard-grid--docs`** — the showpiece. This was the "60-second hire test" page, doesn't exist on the live site yet.
3. **`https://edwson.github.io/Ed_Storybook/?path=/story/components-alert--docs`** — Alert component (new, wasn't on origin).
4. Toggle theme on any story → both themes should render every text element legibly.

---

## If something goes wrong

If the rebase/reset confuses the local repo, the backup at `../storybook-next.bak/` has everything pre-action. To restore:

```bash
cd ~/Desktop/Ed_portfolio_May_01
rm -rf storybook-next
mv storybook-next.bak storybook-next
```

Then we can debug from there.
