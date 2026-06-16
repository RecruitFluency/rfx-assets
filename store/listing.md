# Chrome Web Store — Listing Package (RFX RecruitRush)

Everything you need to paste into the Chrome Web Store **Developer Dashboard**
when submitting. Build artifact: `store/build/rfx-recruitrush-v1.0.0.zip`.

---

## Product details

**Name** (max 75 chars)
```
RFX RecruitRush — College Recruiting Form Autofiller
```

**Summary / short description** (max 132 chars)
```
Save your athlete profile once and autofill any college coach's recruiting questionnaire in one click. Built for recruits.
```

**Category:** Productivity
**Language:** English (United States)

---

## Detailed description (paste into "Description")

```
Stop filling out the same recruiting questionnaire over and over.

Every college program has its own recruiting questionnaire, and serious recruits
fill out dozens of them. RFX RecruitRush saves your athlete profile ONCE, then
fills out any coach's questionnaire for you with a single click.

HOW IT WORKS
1. Save your info once — name, contact, academics (GPA, SAT/ACT, NCAA ID),
   athletics (sport, position, height, measurables), club & high school teams and
   coaches, parent/guardian contacts, and your highlight video link.
2. Open any college's recruiting questionnaire.
3. Click "Fill this form" (or press Alt+Shift+F). Review the highlighted fields
   and submit. Repeat for the next school in seconds.

BUILT FOR RECRUITING
Unlike generic autofillers, RecruitRush understands recruiting forms:
• Knows the difference between YOUR email and your parent's or coach's email.
• Picks the right dropdown option (including state names) and radio buttons.
• Handles split height fields, club vs. high-school coach fields, and forms
  embedded inside other pages.
• Works across the many different questionnaire systems schools use.

SPORT-SPECIFIC MEASURABLES
40-yard dash, vertical and broad jump, pro agility, bench, exit/throwing/pitching
velocity, wingspan, standing reach, approach touch, best events & times — fill in
only what applies to your sport.

SAFE BY DEFAULT
• Never touches passwords, payment, or file-upload fields.
• Never auto-checks consent or "I agree" boxes — those are always yours to click.
• Skips fields you've already filled (unless you choose to overwrite).
• Filled fields flash green so you can review before submitting.

YOUR DATA STAYS YOURS
Your profile is stored only in your browser. There is no account and no server —
nothing is uploaded anywhere. Export it to a file anytime to back it up.

GET RECRUITED FASTER
RecruitRush is part of the RFX recruiting platform. Build your full recruiting
profile on the RFX app (iOS & Android) so college coaches can find YOU — then use
RecruitRush to breeze through every questionnaire.
```

---

## Privacy & permissions (Privacy tab)

**Single purpose**
```
RFX RecruitRush autofills college athletic recruiting questionnaires using a
recruiting profile that the user saves locally in their browser.
```

**Permission justifications**

| Permission | Justification |
|---|---|
| `storage` | Store the athlete's recruiting profile and preferences locally in the browser so they can be reused across forms. |
| `activeTab` + `scripting` | Run the autofill logic on the page the user is on, only when they explicitly click "Fill this form," the keyboard shortcut, or the menu item. |
| `contextMenus` | Add a right-click "Autofill recruiting form" menu item. |
| Host permission `<all_urls>` | College recruiting questionnaires are hosted on thousands of different university and vendor domains. The extension must be able to read field labels and fill inputs on whichever site the user is on when they click Fill. It does not read or collect browsing data, and acts only on user request. |

**Data usage disclosures** (Data safety form — select these)
- Does the extension collect or use user data? **The profile is stored locally; it is not collected by us or sent to any server.**
- Personally identifiable info (name, address, email, phone): **Stored locally on the user's device only. Not transmitted.**
- No data is sold or shared with third parties.
- No analytics or tracking SDKs.
- Outbound links to the Apple App Store / Google Play are standard navigation when the user clicks them.

**Privacy policy URL:** host `store/PRIVACY.md` (rendered) at a public URL — e.g.
`https://recruitfluency.com/recruitrush-privacy` — and paste that URL here.
(A privacy policy is required because the extension requests broad host access.)

---

## Assets (in `store/assets/`)

| Asset | File | Required |
|---|---|---|
| Store icon 128×128 | `store-icon-128.png` | Yes |
| Screenshots 1280×800 (×5) | `screenshot-1..5.png` | At least 1 |
| Small promo tile 440×280 | `promo-small-440x280.png` | Recommended |
| Marquee promo 1400×560 | `promo-marquee-1400x560.png` | Optional |

---

## Before you submit
- One-time **$5** Chrome Web Store developer registration.
- Confirm the contact email in `PRIVACY.md` is one you monitor.
- Host the privacy policy and paste its URL.
- Upload `rfx-recruitrush-v1.0.0.zip`, fill the fields above, add screenshots, submit for review (typically a few days).
```
