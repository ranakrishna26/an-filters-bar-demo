# AN Filters Bar Demo

Standalone Vite + React + TypeScript demo of an observability **global filter bar**. No backend, no private design-system packages — Connect-like styling and hardcoded data.

## Live URL (permanent)

**https://an-filters-bar-demo.vercel.app**

Embed-ready:

- https://an-filters-bar-demo.vercel.app/?embed=1
- https://an-filters-bar-demo.vercel.app/?embed=1&theme=dark

Repo: https://github.com/ranakrishna26/an-filters-bar-demo

## Run locally

```bash
npm install
npm run dev
```

## Framer embed

Use a wide frame (≈1280+ px wide, ~120–160 px tall for the bar alone):

```html
<iframe
  src="https://an-filters-bar-demo.vercel.app/?embed=1"
  title="AN Filters Bar"
  style="border:0;width:100%;height:140px;display:block;background:#f5f5f5;"
  loading="lazy"
></iframe>
```

If you open menus/calendar, give the frame more height (≈400–500px) so popups aren’t clipped.

## What you can try

1. Switch network mode (4G / 5G / 5G SA / 5G NSA)
2. Services / Subscribers multi-select with count / All chip
3. KPI grouped single-select
4. Add filter → Region / Postal code second row
5. Clear filters / Restore defaults
6. Granularity adapts date + hour fields
7. Calendar range picking with in-range highlight
8. Favorites save / update / apply / filled star
9. Narrow viewport reflows actions to second row
10. Light/dark theme toggle
