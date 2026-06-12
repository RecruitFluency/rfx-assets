# RecruitFill — College Recruiting Form Autofiller

Fill out your athlete recruiting profile **once**, then autofill every college
coach's recruiting questionnaire with a single click (or `Alt+Shift+F`).

Every college sports program has its own questionnaire, and recruits fill these
out by the dozen. The field *names* differ from school to school, but the
visible *labels* ("First Name", "Graduation Year", "Club Coach Email", "Highlight
Video") are fairly standard. RecruitFill reads those labels and maps them to your
saved profile — no copy/paste, no retyping.

> **Why this exists:** general autofillers (Magical, JunkFill) don't understand
> recruiting-specific fields, and the recruiting platforms (NCSA, FieldLevel,
> Front Rush) help you *manage* the process but don't autofill the hundreds of
> individual school questionnaires. As of this writing there was no browser
> extension purpose-built for athletic recruiting questionnaires — so here's one.

---

## What it fills

Personal • contact • address • academics (GPA, SAT/ACT, NCAA Eligibility Center
ID, intended major) • athletics (sport, position, height, weight, dominant
foot/hand, jersey #) • club & high-school teams and coaches • parent/guardian
contacts • recruiting media (Hudl/YouTube highlight link, social handles).

It is smart about the things that trip up generic autofillers:

- **Athlete vs. parent vs. coach** — "Parent Email" won't get your email, and
  "High School Coach Email" won't get the club coach's.
- **Dropdowns** — picks the right `<select>` option, including converting state
  abbreviations to full names (`OH` → "Ohio") and back.
- **Radio groups** — Gender, dominant foot, etc.
- **Split height fields** — separate "feet"/"inches" boxes, or a single `5'9"`.
- **Messy layouts** — `<label for>`, wrapping labels, placeholder-only inputs,
  ARIA labels, and old-school table layouts.
- **Forms inside iframes** — runs in every frame (Front Rush / ARMS embeds).

### Safety defaults

- **Never** touches passwords, SSN, credit-card, CAPTCHA, or file-upload fields.
- **Never** auto-checks consent / "I agree" checkboxes — those are yours to click.
- By default it **skips fields you've already filled** (toggle "Overwrite" in the
  popup to change that).
- Filled fields flash a green outline so you can review before submitting.

---

## Privacy

Your profile is stored **only in your browser** via the extension's local
storage. Nothing is sent to any server — there is no backend. Use **Export** on
the options page to back it up to a JSON file, and **Import** to restore it.

---

## Install in Chrome / Edge / Brave (developer mode)

1. Download or clone this repo.
2. Go to `chrome://extensions` (or `edge://extensions`).
3. Turn on **Developer mode** (top-right).
4. Click **Load unpacked** and select the `extension/` folder.
5. Pin the RecruitFill icon, click it, and choose **Edit profile** to fill in
   your info once. Then open any recruiting questionnaire and click **Fill this
   form**.

Keyboard shortcut: **`Alt+Shift+F`**. Right-click a page → *Autofill recruiting
form with RecruitFill*.

## Install in Safari (macOS, requires Xcode)

The extension is built on the standard Web Extension APIs, so the same code runs
in Safari after a one-time conversion (Apple requires extensions to ship inside a
native app wrapper):

```bash
# On a Mac with Xcode installed:
xcrun safari-web-extension-converter /path/to/rfx-assets/extension
```

This opens an Xcode project. Build & run it, then enable **RecruitFill** in
Safari → Settings → Extensions. (For iOS Safari, the same converter can target an
iOS app; allow it under Settings → Safari → Extensions.) See Apple's
["Converting a web extension for Safari"](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari)
guide for distribution details.

---

## How it works

```
manifest.json          Manifest V3 config (Chrome + Safari compatible)
src/schema.js          Field definitions: labels, types, and match synonyms/anti-words
src/matcher.js         Builds a text "signature" per form field and scores it vs. the schema
src/content.js         The fill engine (runs in every frame), React/Vue-safe value setting
src/background.js      Keyboard command, context menu, multi-frame fill + toolbar badge
options/               "My Recruiting Profile" editor (save / export / import)
popup/                 One-click "Fill this form" + settings
tests/                 jsdom tests for the matching engine (see below)
```

The matcher prefers reliable, field-specific text (explicit `<label>`, ARIA,
placeholder) and only falls back to structural hints it can tie to a single
control — so a flat form doesn't leak every label into every field. `anti`
keywords disqualify wrong matches (e.g. the athlete `email` field rejects any
signature containing "parent" or "coach").

### Running the tests

```bash
cd extension/tests
npm install        # installs jsdom
npm test
```

The suite fills a deliberately messy, realistic questionnaire and asserts every
field lands correctly, plus the skip/overwrite/consent behaviors.

---

## Adding or tuning fields

Almost everything lives in `src/schema.js`. To add a field, append an entry with
its `label`, `type`, `group`, `synonyms` (phrases that may appear in a form's
label), and optional `anti` words. It automatically appears on the options page
and in the matcher — no other files to touch.
