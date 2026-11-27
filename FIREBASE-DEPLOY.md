# Deploy: Open Graph + Twitter Card tags on indigotango.us

Live host is **Firebase Hosting** (site `indigo-tango-website` / [indigotango.us](https://indigotango.us)). Not Webflow. Do not point DNS at Webflow.

`hosting-patches/` is an **overlay** of live HTML captured **27 Nov 2026** (Last-Modified **Tue, 24 Nov 2026 19:42:02 GMT**) with share meta added. Public copy has **no dollar prices** in `og:*` / `twitter:*` titles or descriptions.

**Do not** `firebase deploy` with `public: hosting-patches`. That folder is patched HTML plus one image. Deploying it as the whole site would wipe CSS, JS, and the rest of the tree.

**Do not** deploy `firebase-site/public/` as a replacement for the live tree. That snapshot is **12 Nov 2026**. The 24 Nov live site added `/how-work-moves`, `/ai-consultant-atlanta`, `/merch`, and later HTML. Replacing live with the snapshot would drop those routes.

This repo does not contain Firebase credentials. This PR does not deploy.

## Exact steps Shawn should run

From the **same local public folder last used to deploy indigotango.us** (the full 24 Nov tree that includes `/style.css`, `/app.js`, `/assets`, `/how-work-moves`, `/merch`, etc.):

```bash
PUBLIC=/path/to/your-last-firebase-public-folder
PATCH=/path/to/indigo-tango-website/hosting-patches

# 1. Share image
mkdir -p "$PUBLIC/assets/og"
cp "$PATCH/assets/og/indigo-tango-share-1200x630.png" \
   "$PUBLIC/assets/og/indigo-tango-share-1200x630.png"

# 2. Overlay HTML (live 24 Nov pages + share tags)
cp "$PATCH/index.html" "$PUBLIC/index.html"
mkdir -p "$PUBLIC/services" "$PUBLIC/about" "$PUBLIC/how-work-moves" \
         "$PUBLIC/ai-consultant-atlanta" "$PUBLIC/contact" "$PUBLIC/faqs" \
         "$PUBLIC/assessment"
cp "$PATCH/services/index.html" "$PUBLIC/services/index.html"
cp "$PATCH/about/index.html" "$PUBLIC/about/index.html"
cp "$PATCH/how-work-moves/index.html" "$PUBLIC/how-work-moves/index.html"
cp "$PATCH/ai-consultant-atlanta/index.html" "$PUBLIC/ai-consultant-atlanta/index.html"
cp "$PATCH/contact/index.html" "$PUBLIC/contact/index.html"
cp "$PATCH/faqs/index.html" "$PUBLIC/faqs/index.html"
cp "$PATCH/assessment/index.html" "$PUBLIC/assessment/index.html"

# 3. Deploy the full public tree, not hosting-patches alone
cd "$PUBLIC"
firebase deploy --only hosting --site indigo-tango-website
```

If the Firebase project ID is not the default, add `--project <project-id>` (site id on live: `indigo-tango-website`).

After deploy, confirm each URL has `og:title`, `og:image`, and `twitter:card`, and that share copy still has **no** `$4,500` / `$12,000` / `$15,000` / `$2,500` / `$4,000` / `$5,500`:

- https://indigotango.us/
- https://indigotango.us/services
- https://indigotango.us/about
- https://indigotango.us/how-work-moves
- https://indigotango.us/ai-consultant-atlanta
- https://indigotango.us/contact
- https://indigotango.us/faqs
- https://indigotango.us/assessment
- https://indigotango.us/assets/og/indigo-tango-share-1200x630.png (1200×630 PNG)

Facebook / LinkedIn / Slack will not refresh old previews until the image URL is fetched (or a cache debugger is used). The image path is new, so first shares should pick it up.

## What this overlay does not change

- Intake still uses the Google Forms second step.
- Existing Atlanta JSON-LD (`ProfessionalService` + FAQ) is left in place. No new Organization/LocalBusiness graph was added on other pages.
- `twitter:site` is omitted — no brand X handle in this repo.
- One share image for all patched pages (unique per-page art was not cheap).
- Stale Eleventy sources at the repository root are not the live site and were not updated.
