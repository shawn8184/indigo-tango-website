# Indigo Tango website

The current Firebase website recovery is in **[firebase-site/](firebase-site/)**. Start with [its README](firebase-site/README.md) for verification, preview, deployment, and recovery limitations.

Open Graph / Twitter Card overlays for the **live** 24 Nov 2026 tree are in **[hosting-patches/](hosting-patches/)**. Shawn must overlay those files onto the last-deployed public folder — see **[FIREBASE-DEPLOY.md](FIREBASE-DEPLOY.md)**. Do not deploy `hosting-patches/` or the Nov 12 `firebase-site/public/` snapshot as the entire site.

The other files at the repository root belong to an older Eleventy website. They are retained for history and are not the source of the current indigotango.us deployment.

The recovery branch is for review and backup. It does not deploy Firebase or change DNS automatically.
