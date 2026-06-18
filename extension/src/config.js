/*
 * RFX RecruitRush — central config
 *
 * One place to manage the links/copy that drive athletes back to the RFX
 * platform, plus the (currently disabled) two-way sync adapter.
 *
 * Attached to `window` so content scripts, the popup, and the welcome page can
 * all read it. Campaign params are appended so installs from the extension are
 * measurable in App Store Connect / Google Play console.
 */
(function () {
  const STORE = {
    // RFX Soccer Recruit on the app stores.
    appStoreBase: "https://apps.apple.com/us/app/rfx-soccer-recruit/id6739776891",
    playStoreBase: "https://play.google.com/store/apps/details?id=com.recruitfluency.rfx.rfx"
  };

  // Build a tracked store URL for a given placement (so you can see which
  // in-extension CTA drove the install).
  function storeLink(which, placement) {
    const tag = "recruitrush_ext" + (placement ? "_" + placement : "");
    if (which === "ios") {
      // Apple reads `ct` (campaign text) on App Store links.
      return `${STORE.appStoreBase}?ct=${encodeURIComponent(tag)}`;
    }
    // Google Play reads a `referrer` blob of UTM params.
    const referrer = encodeURIComponent(
      `utm_source=recruitrush_ext&utm_medium=extension&utm_campaign=autofill&utm_content=${tag}`
    );
    return `${STORE.playStoreBase}&referrer=${referrer}`;
  }

  window.RFX_CONFIG = {
    brand: "RFX RecruitRush",
    platformName: "RFX",
    tagline: "Your recruiting profile — built once, seen by every coach.",
    store: STORE,
    storeLink,

    // ---- Two-way sync (Tier 3) ----
    // Disabled until the RFX platform exposes a web API / OAuth endpoint the
    // extension can call. When that exists, set enabled:true and apiBaseUrl,
    // and the "Sign in with RFX" UI + sync.js adapter light up automatically.
    sync: {
      enabled: false,
      apiBaseUrl: "",        // e.g. "https://api.recruitfluency.com"
      authUrl: ""            // e.g. "https://api.recruitfluency.com/oauth/authorize"
    }
  };
})();
