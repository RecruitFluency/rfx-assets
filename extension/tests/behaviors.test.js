const fs = require("fs");
const { JSDOM } = require("jsdom");
const EXT = require("path").join(__dirname, "..");

function setup(html, settings) {
  const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true });
  const { window } = dom;
  Object.defineProperty(window.HTMLElement.prototype, "offsetParent", { get() { return this.parentNode; } });
  window.HTMLElement.prototype.getBoundingClientRect = () => ({ width: 120, height: 22, top: 0, left: 0, right: 120, bottom: 22 });
  window.chrome = {
    storage: { local: { get: async () => ({ profile: { firstName: "Alex", lastName: "Rivera", email: "alex@example.com" }, settings }) } },
    runtime: { onMessage: { addListener: () => {} } }
  };
  for (const f of ["src/schema.js", "src/matcher.js", "src/content.js"]) window.eval(fs.readFileSync(`${EXT}/${f}`, "utf8"));
  return window;
}

(async () => {
  let pass = 0, fail = 0;
  const check = (n, g, w) => { if (g === w) { pass++; console.log("  ✓ " + n); } else { fail++; console.log(`  ✗ ${n}: got "${g}" want "${w}"`); } };

  // 1. Single "Name" field -> full name
  let w = setup(`<form><label for="n">Name</label><input id="n"></form>`, { overwrite: false, highlight: false });
  await w.__recruitFillRun();
  check("Single 'Name' -> full name", w.document.querySelector("#n").value, "Alex Rivera");

  // 2. Skip already-filled when overwrite=false
  w = setup(`<form><label for="e">Email</label><input id="e" value="keep@me.com"></form>`, { overwrite: false, highlight: false });
  let r = await w.__recruitFillRun();
  check("Skip already-filled (overwrite off)", w.document.querySelector("#e").value, "keep@me.com");
  check("  reported skipped", String(r.skipped), "1");

  // 3. Overwrite when enabled
  w = setup(`<form><label for="e">Email</label><input id="e" value="old@me.com"></form>`, { overwrite: true, highlight: false });
  await w.__recruitFillRun();
  check("Overwrite when enabled", w.document.querySelector("#e").value, "alex@example.com");

  // 4. Never auto-check consent checkboxes
  w = setup(`<form><label><input type="checkbox" name="agree"> I agree to terms</label></form>`, { overwrite: true, highlight: false });
  await w.__recruitFillRun();
  check("Consent checkbox left untouched", String(w.document.querySelector('[name="agree"]').checked), "false");

  console.log(`\nRESULT: ${pass}/${pass + fail} passed${fail ? " — FAILURES" : ""}`);
  process.exit(fail ? 1 : 0);
})();
