const fs = require("fs");
const { JSDOM } = require("jsdom");
const EXT = require("path").join(__dirname, "..");

const dom = new JSDOM(`<!DOCTYPE html><html><body><form>
  <label for="fn">First Name</label><input id="fn">
</form></body></html>`, { runScripts: "outside-only", pretendToBeVisual: true, url: "https://example.com/form" });
const { window } = dom;
Object.defineProperty(window.HTMLElement.prototype, "offsetParent", { get() { return this.parentNode; } });
window.HTMLElement.prototype.getBoundingClientRect = () => ({ width: 120, height: 22, top: 0, left: 0, right: 120, bottom: 22 });
window.chrome = {
  runtime: { onMessage: { addListener: () => {} }, getURL: (p) => "chrome-extension://abc/" + p },
  storage: { local: { get: async () => ({ profile: { firstName: "Alex" }, settings: { highlight: false } }) } }
};
for (const f of ["src/config.js", "src/schema.js", "src/matcher.js", "src/content.js"]) {
  window.eval(fs.readFileSync(`${EXT}/${f}`, "utf8"));
}

(async () => {
  let pass = 0, fail = 0;
  const check = (n, cond) => { if (cond) { pass++; console.log("  ✓ " + n); } else { fail++; console.log("  ✗ " + n); } };

  // storeLink campaign tagging
  const ios = window.RFX_CONFIG.storeLink("ios", "toast");
  const play = window.RFX_CONFIG.storeLink("android", "toast");
  check("iOS link targets the RFX app id", ios.includes("id6739776891"));
  check("iOS link carries campaign tag", ios.includes("ct=recruitrush_ext_toast"));
  check("Play link targets the RFX package", play.includes("com.recruitfluency.rfx.rfx"));
  check("Play link carries utm referrer", decodeURIComponent(play).includes("utm_source=recruitrush_ext"));

  // Fill triggers the toast
  const res = await window.__recruitFillRun();
  check("fill still succeeds", res.filled === 1);
  const host = Array.from(window.document.body.children).find((el) => el.shadowRoot);
  check("post-fill toast rendered in shadow DOM", !!host);
  if (host) {
    const links = host.shadowRoot.querySelectorAll("a");
    check("toast shows two store links", links.length === 2);
    check("toast iOS link is tracked", host.shadowRoot.querySelector("a.ios").href.includes("id6739776891"));
  }

  console.log(`\nRESULT: ${pass}/${pass + fail} passed${fail ? " — FAILURES" : ""}`);
  process.exit(fail ? 1 : 0);
})();
