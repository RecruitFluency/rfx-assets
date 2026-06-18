# Chrome Web Store package — RFX RecruitRush

Everything needed to publish the extension.

- **`build/rfx-recruitrush-v1.0.0.zip`** — the packaged extension to upload.
- **`listing.md`** — name, descriptions, category, permission justifications, and
  the data-safety answers to paste into the Developer Dashboard.
- **`PRIVACY.md`** — privacy policy to host publicly; paste its URL in the listing.
- **`assets/`** — store images:
  - `store-icon-128.png` (required)
  - `screenshot-1..5.png` — 1280×800 (at least 1 required)
  - `promo-small-440x280.png` (recommended)
  - `promo-marquee-1400x560.png` (optional)

## Publish in ~30 minutes
1. Register a Chrome Web Store developer account (one-time **$5**).
2. Host `PRIVACY.md` at a public URL (e.g. on recruitfluency.com).
3. New item → upload the zip → paste copy from `listing.md` → upload assets →
   add the privacy policy URL → submit for review.

To re-build the zip after code changes:
```bash
cd extension && zip -rq ../store/build/rfx-recruitrush-vX.Y.Z.zip . -x "tests/*" -x "*/.gitignore"
```
