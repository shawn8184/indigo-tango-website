# Indigo Tango - Firebase site recovery

This folder contains a recovery of the public website at https://indigotango.us, collected on November 12, 2026. The deployed HTML, CSS, JavaScript, SVGs, images, and fonts are editable directly in `public/`.

This is recovered static output. The original authoring project and any unpublished sources cannot be reconstructed from Firebase Hosting. The legacy Eleventy files at the repository root are an older design and are not the source of the current live site.

## Verify the snapshot

With Node.js 20 or newer, run from this folder:

```sh
npm run check
```

`download-manifest.json` records each recovered public file and its SHA-256 checksum. No npm dependencies are needed for this check.

## Local preview

From this folder, run:

```sh
python -m http.server 4321 --directory public
```

Open http://127.0.0.1:4321/. Firebase clean URLs and redirects are not emulated by this basic preview; use the Firebase Hosting emulator for full routing verification.

## Firebase configuration

The project and site are `indigo-tango-website`. The checked-in configuration was translated from the authenticated live Firebase release on November 12, 2026, preserving clean URLs, no trailing slash, security headers, asset cache header, and pricing redirects.

After verifying the configuration and reviewing changes, an authorized operator can deploy manually:

```sh
npx firebase-tools login
npx firebase-tools deploy --only hosting --project indigo-tango-website
```

This backup does not configure automatic deployments, add Firebase credentials to GitHub, change DNS, or deploy the site. Keep credentials and `.firebase/` out of version control.

## Forms and external services

Existing contact and assessment flows open Google Forms for final review and submission. Booking, Google Maps, and any other external integrations remain subject to their existing service configuration. No form was submitted during recovery.

## Recovery coverage

The authenticated inventory contains 165 files. This snapshot contains 164 retrieved public files, verified with local SHA-256 checksums. The only unrecovered file is the inactive `/pricing/index.html`: Firebase redirects that path to `/engagements`, so its original stored bytes cannot be downloaded through the public site. The live pricing redirects are preserved in `firebase.json`. No other page was substituted for this legacy file.

`firebase-release-inventory.json` records the original release, configuration, and Firebase storage hashes. Storage/compression hashes are retained separately from the downloaded-content SHA-256 checksums. This backup includes the public output of Firebase reserved initialization endpoints, rather than any secret server credentials.
