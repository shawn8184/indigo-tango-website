# Firebase deploy — Keep People In Control graphic

Live host is **Firebase Hosting** (`indigo-tango-website`), not Webflow. This PR cannot deploy apex.

## Cause

Home “Keep people in control” is a stroke SVG (`.wire-art`), not a missing raster. The figure used ellipses that grow to `rx="171"` and rotate to `84°`, which overflow the `440×280` viewBox. The SVG clips, so the live graphic is cut off at the top and bottom.

## Overlay (do not replace the whole `public/` tree)

Git `firebase-site/public` is still behind the **24 Nov 2026** live tree (`/how-work-moves`, core header mark, home move-section). Copy only these two files over the **currently deployed** public folder:

```
hosting-patches/index.html   →  public/index.html
hosting-patches/home-teal.css →  public/home-teal.css
```

`hosting-patches/index.html` is the live 24 Nov home page with the contained SVG. `hosting-patches/home-teal.css` is the live stylesheet (`?v=20261128a`) plus `overflow: hidden` on the feature card and wire art.

Then:

```bash
firebase deploy --only hosting --site indigo-tango-website
```

Do **not** deploy `firebase-site/public` as a full replace. That tree does not contain every live route.

## What changed

- Contained person-shaped wire figure (same ellipse language as the other two cards, padded inside the viewBox).
- Cache-bust `home-teal.css?v=20261128a`.
- No public pricing edits.
