# indigotango.us site folder (snapshot)

This folder is a snapshot of the static deploy folder for https://indigotango.us
(plain HTML, CSS, JS and images; no build step).

- Hosting: Firebase Hosting, project `indigo-tango-website`
- Deploy command (run from this folder, with a `firebase.json` present):

      firebase deploy --only hosting --site indigo-tango-website

- `firebase.json` is **not included**: the original was not found on the source machine,
  so none has been added here. Recreate it from the real Firebase config before deploying.
- `__/firebase/init.json` holds only the public Firebase web config that the live site
  already serves at `/__/firebase/init.json`. No secrets are stored in this folder.

## Snapshot details

- Taken Oct 27, 2026 from Shawn's Lenovo Desktop working folder (180 site files).
- Compared with the live site: 59 compared files are byte-identical; 16 differ.
  The working folder is likely slightly ahead of what is currently deployed.
  Files that differ from live:
  - blog/do-you-need-an-ai-agent/index.html
  - blog/what-to-automate-first/index.html
  - pricing/index.html
  - services/ai-second-brain/index.html
  - brain-motion.css, brain-motion.js
  - network-home.css, network-home.js
  - offer-packages.css
  - package-enquiry.js
  - profile-photo-20261026.css
  - second-brain.css
  - seo.css
  - tools.css, tools.js
  - sitemap.xml

Nothing here is deployed automatically; committing or merging this folder does not deploy it.
