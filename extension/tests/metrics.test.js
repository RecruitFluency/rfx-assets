const fs = require("fs");
const { JSDOM } = require("jsdom");
const EXT = require("path").join(__dirname, "..");

const html = `<!DOCTYPE html><html><body><form>
  <label for="d40">40-Yard Dash</label><input id="d40" name="forty">
  <label for="vj">Vertical Jump</label><input id="vj" name="vert">
  <label for="bj">Broad Jump</label><input id="bj" name="broad">
  <label for="pa">Pro Agility (5-10-5)</label><input id="pa" name="shuttle">
  <label for="bp">Bench Press Max</label><input id="bp" name="bench">
  <label for="ev">Exit Velocity (mph)</label><input id="ev" name="exitv">
  <label for="tv">Throwing Velocity (mph)</label><input id="tv" name="throwv">
  <label for="pv">Pitching Velocity (mph)</label><input id="pv" name="pitchv">
  <label for="ws">Wingspan</label><input id="ws" name="wing">
  <label for="sr">Standing Reach</label><input id="sr" name="reach">
  <label for="at">Approach Touch</label><input id="at" name="approach">
</form></body></html>`;

const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true });
const { window } = dom;
Object.defineProperty(window.HTMLElement.prototype, "offsetParent", { get() { return this.parentNode; } });
window.HTMLElement.prototype.getBoundingClientRect = () => ({ width: 120, height: 22, top: 0, left: 0, right: 120, bottom: 22 });

const PROFILE = {
  fortyYardDash: "4.62", verticalJump: "32", broadJump: "9'4\"", proAgility: "4.30",
  benchPress: "12 reps", exitVelocity: "94", throwingVelocity: "82", pitchingVelocity: "88",
  wingspan: "74", standingReach: "7'9\"", approachTouch: "10'2\""
};
window.chrome = {
  storage: { local: { get: async () => ({ profile: PROFILE, settings: { overwrite: false, highlight: false } }) } },
  runtime: { onMessage: { addListener: () => {} } }
};
for (const f of ["src/schema.js", "src/matcher.js", "src/content.js"]) window.eval(fs.readFileSync(`${EXT}/${f}`, "utf8"));

(async () => {
  await window.__recruitFillRun();
  const v = (id) => window.document.querySelector(id).value;
  const checks = [
    ["40-yard dash", v("#d40"), "4.62"],
    ["Vertical jump", v("#vj"), "32"],
    ["Broad jump", v("#bj"), "9'4\""],
    ["Pro agility", v("#pa"), "4.30"],
    ["Bench press", v("#bp"), "12 reps"],
    ["Exit velocity (not throwing/pitching)", v("#ev"), "94"],
    ["Throwing velocity (not exit/pitching)", v("#tv"), "82"],
    ["Pitching velocity (not exit/throwing)", v("#pv"), "88"],
    ["Wingspan", v("#ws"), "74"],
    ["Standing reach (not approach)", v("#sr"), "7'9\""],
    ["Approach touch", v("#at"), "10'2\""]
  ];
  let pass = 0, fail = 0;
  for (const [n, g, w] of checks) {
    if (g === w) { pass++; console.log("  ✓ " + n); }
    else { fail++; console.log(`  ✗ ${n}: got "${g}" want "${w}"`); }
  }
  console.log(`\nRESULT: ${pass}/${pass + fail} passed${fail ? " — FAILURES" : ""}`);
  process.exit(fail ? 1 : 0);
})();
