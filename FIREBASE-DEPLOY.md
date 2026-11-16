# Deploy: remove public pricing from indigotango.us

Live host is **Firebase Hosting** (`indigo-tango-website.web.app` / [indigotango.us](https://indigotango.us)). This Eleventy tree is **not** what is currently live. Do **not** point DNS at Webflow.

`hosting-patches/` is an **overlay** of live HTML (22 Oct 2026): rate-card dollars removed, footer Pricing links removed, `/pricing` client-redirects to `/services`.

**Do not** `firebase deploy` with `public: hosting-patches`. That folder is HTML-only and would wipe CSS, images, and the rest of the site.

## Exact steps Shawn should run

From the **same local public folder you last used to deploy indigotango.us** (the full site tree that includes `/style.css`, `/app.js`, `/assets`, etc.):

```bash
PUBLIC=/path/to/your-last-firebase-public-folder
PATCH=/path/to/indigo-tango-website/hosting-patches

# 1. Overlay Home, Services, FAQs, /pricing redirect, sitemap
cp "$PATCH/index.html" "$PUBLIC/index.html"
mkdir -p "$PUBLIC/services" "$PUBLIC/faqs" "$PUBLIC/pricing"
cp "$PATCH/services/index.html" "$PUBLIC/services/index.html"
cp "$PATCH/faqs/index.html" "$PUBLIC/faqs/index.html"
cp "$PATCH/pricing/index.html" "$PUBLIC/pricing/index.html"
cp "$PATCH/sitemap.xml" "$PUBLIC/sitemap.xml"

# 2. Drop footer Pricing on every remaining page (Home/Services/FAQs already clean)
find "$PUBLIC" -name '*.html' -print0 | xargs -0 sed -i 's#<a href="/pricing">Pricing</a>##g'

# 3. Optional but recommended: 301 /pricing in that folder's firebase.json
#    { "source": "/pricing", "destination": "/services", "type": 301 }
#    { "source": "/pricing/**", "destination": "/services", "type": 301 }

# 4. Deploy the full public tree, not hosting-patches alone
cd "$PUBLIC"
firebase deploy --only hosting --site indigo-tango-website
```

If the Firebase project ID is not the default, add `--project <project-id>` (site id observed on live: `indigo-tango-website`).

After deploy, confirm these URLs have **no** `$4,500`, `$12,000`, `$15,000`, `$2,500`, `$4,000`, `$5,500`, or footer **Pricing**:

- https://indigotango.us/
- https://indigotango.us/services
- https://indigotango.us/pricing  (should land on Services)
- https://indigotango.us/faqs
- https://indigotango.us/about  (footer)

Internal commercial numbers stay in the Launch project sales kit, not on public pages.
