# Indigo Tango Decap CMS Setup

## What this adds

This adds a Decap CMS admin interface at:

https://indigotango.us/admin

The first version lets you edit the existing index.html file from a browser-based CMS editor.

## Files to add to GitHub

Copy these folders into the root of your GitHub repository:

admin/
assets/uploads/

Your repository should look like this:

index.html
admin/index.html
admin/config.yml
assets/uploads/.gitkeep

## Important step

Open:

admin/config.yml

Replace:

YOUR_GITHUB_USERNAME/indigo-tango-website

with your real GitHub owner and repo name.

Example:

shawnwallis/indigo-tango-website

## Commit to GitHub

Commit the files to the main branch.

Cloudflare Pages will redeploy automatically.

## Open the CMS

Go to:

https://indigotango.us/admin

## Note about GitHub login

For Cloudflare Pages, Decap CMS may require a GitHub OAuth provider if the default GitHub login does not complete.

If login fails, the next step is to add a small Cloudflare Worker OAuth proxy.

## Phase 2

After this works, convert the site from direct HTML editing into editable fields:

Hero Headline
Hero Subtitle
CTA Text
Service Cards
Images
FAQs
Blog Posts
Case Studies
