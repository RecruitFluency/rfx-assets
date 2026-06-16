# Publishing RFX RecruitRush — exact steps

Everything is prepared. These are the parts only you can do (they need your
Google login + a one-time $5 fee). Budget ~15 minutes.

## Step 1 — Host the privacy policy (2 clicks, free)

A ready-made page lives at `docs/privacy.html` in this repo. Turn on GitHub Pages
to serve it:

1. On GitHub: **Settings → Pages**.
2. Under **Build and deployment → Source**, pick **Deploy from a branch**.
   Set branch to **`main`**, folder to **`/docs`**, click **Save**.
3. After a minute your policy is live at:
   ```
   https://recruitfluency.github.io/rfx-assets/privacy.html
   ```
   (This URL goes in the store listing's "Privacy policy" field. Or, if you'd
   rather host it on recruitfluency.com, just publish the same file there.)

> Note: this works after the PR is merged to `main` (or set the branch to the
> feature branch temporarily).

## Step 2 — Create a developer account ($5, one-time)

1. Go to **https://chrome.google.com/webstore/devconsole**.
2. Sign in with the Google account you want to own the listing.
3. Pay the one-time **$5** registration fee.

## Step 3 — Create the item & upload

1. Click **Add new item**.
2. Upload **`store/build/rfx-recruitrush-v1.0.0.zip`**.

## Step 4 — Fill the listing (copy from `store/listing.md`)

- **Name, Summary, Description** — paste from `store/listing.md`.
- **Category:** Productivity. **Language:** English (US).
- **Store icon:** upload `store/assets/store-icon-128.png`.
- **Screenshots:** upload `store/assets/screenshot-1.png` … `screenshot-5.png`.
- **Promo tile (optional):** `store/assets/promo-small-440x280.png`.
- **Marquee (optional):** `store/assets/promo-marquee-1400x560.png`.

## Step 5 — Privacy tab

- **Single purpose** + **permission justifications:** paste from `store/listing.md`.
- **Data usage:** select "does not collect/transmit user data" (see listing.md).
- **Privacy policy URL:** paste the URL from Step 1.

## Step 6 — Submit

Click **Submit for review**. Review typically takes a few business days. You'll
get an email when it's approved (or if they ask for changes — the `<all_urls>`
permission is the usual question, and its justification is already written).

---

### After approval
Share the store link everywhere athletes are (team chats, recruiting nights,
your socials). Every install is a warm lead the extension funnels back to the
RFX app via the welcome page, post-fill toast, and CTAs.
