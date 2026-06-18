const fs = require("fs");
const { JSDOM } = require("jsdom");

const EXT = require("path").join(__dirname, "..");
const html = `<!DOCTYPE html><html><body>
<form>
  <label for="fn">First Name</label><input id="fn" name="applicant_first">
  <label for="ln">Last Name</label><input id="ln" name="applicant_last">
  <input name="contact_email_addr" placeholder="Email Address">
  <label for="cell">Cell Phone</label><input id="cell" name="phone1">

  <label for="pemail">Parent/Guardian Email</label><input id="pemail" name="g_email">
  <label for="pphone">Parent Cell Phone</label><input id="pphone" name="g_phone">
  <label for="pname">Parent/Guardian Name</label><input id="pname" name="g_name">

  <label for="grad">Year of Graduation</label>
  <select id="grad" name="gradyr">
    <option value="">Select</option><option>2025</option><option>2026</option>
    <option>2027</option><option>2028</option>
  </select>

  <label for="st">State</label>
  <select id="st" name="state_dd">
    <option value="">Choose</option><option value="OH">Ohio</option>
    <option value="MI">Michigan</option><option value="PA">Pennsylvania</option>
  </select>
  <label for="city">City</label><input id="city" name="city">

  <fieldset><legend>Gender</legend>
    <label><input type="radio" name="gender" value="M"> Male</label>
    <label><input type="radio" name="gender" value="F"> Female</label>
  </fieldset>

  <fieldset><legend>Dominant Foot</legend>
    <label><input type="radio" name="foot" value="R"> Right</label>
    <label><input type="radio" name="foot" value="L"> Left</label>
    <label><input type="radio" name="foot" value="B"> Both</label>
  </fieldset>

  <label for="hf">Height (feet)</label><input id="hf" name="ht_ft">
  <label for="hi">Height (inches)</label><input id="hi" name="ht_in">
  <label for="wt">Weight (lbs)</label><input id="wt" name="weight">

  <input name="club" placeholder="Club Team Name">
  <label for="hsc">High School Coach Name</label><input id="hsc" name="hs_coach">
  <label for="hsce">High School Coach Email</label><input id="hsce" name="hs_coach_email">

  <table><tr><th>GPA</th><td><input name="gpa_field"></td></tr></table>

  <label for="hs">High School Name</label><input id="hs" name="school">
  <label for="vid">Highlight Video (Hudl/YouTube)</label><input id="vid" name="film">
  <label for="ncaa">NCAA Eligibility Center ID</label><input id="ncaa" name="ncaa_id">
</form></body></html>`;

const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true });
const { window } = dom;

// jsdom has no layout engine — make elements appear "visible" so the engine's
// visibility guard passes (real browsers report real geometry).
Object.defineProperty(window.HTMLElement.prototype, "offsetParent", { get() { return this.parentNode; } });
window.HTMLElement.prototype.getBoundingClientRect = function () { return { width: 120, height: 22, top: 0, left: 0, right: 120, bottom: 22 }; };

// Mock the chrome API the content script uses.
const PROFILE = {
  firstName: "Alex", lastName: "Rivera",
  email: "alex.rivera@example.com", phone: "5551234567",
  gradYear: "2027", gpa: "3.8", sport: "Soccer", primaryPosition: "Center Midfield",
  heightFeet: "5", heightInches: "9", weight: "145",
  gender: "Male", dominantFoot: "Right",
  state: "OH", city: "Columbus", highSchool: "Central High School",
  clubTeamName: "FC United 2009",
  hsCoachName: "John Smith", hsCoachEmail: "coach@centralhs.edu",
  parent1Name: "Maria Rivera", parent1Email: "maria.rivera@example.com", parent1Phone: "5559876543",
  highlightVideoUrl: "https://hudl.com/v/alexrivera", ncaaId: "2401234567"
};
window.chrome = {
  storage: { local: { get: async (keys) => ({ profile: PROFILE, settings: { overwrite: false, highlight: false } }) } },
  runtime: { onMessage: { addListener: () => {} } }
};

// Load extension scripts into the window realm.
for (const f of ["src/schema.js", "src/matcher.js", "src/content.js"]) {
  window.eval(fs.readFileSync(`${EXT}/${f}`, "utf8"));
}

(async () => {
  const res = await window.__recruitFillRun();
  const $ = (sel) => window.document.querySelector(sel);
  const radioVal = (name) => {
    const r = window.document.querySelector(`input[name="${name}"]:checked`);
    return r ? r.value : null;
  };

  const checks = [
    ["First name", $("#fn").value, "Alex"],
    ["Last name", $("#ln").value, "Rivera"],
    ["Athlete email (placeholder only)", $('[name="contact_email_addr"]').value, "alex.rivera@example.com"],
    ["Cell phone", $("#cell").value, "5551234567"],
    ["Parent email (not athlete email)", $("#pemail").value, "maria.rivera@example.com"],
    ["Parent phone", $("#pphone").value, "5559876543"],
    ["Parent name", $("#pname").value, "Maria Rivera"],
    ["Grad year select", $("#grad").value, "2027"],
    ["State select (abbrev->full)", $("#st").value, "OH"],
    ["City", $("#city").value, "Columbus"],
    ["Gender radio", radioVal("gender"), "M"],
    ["Dominant foot radio", radioVal("foot"), "R"],
    ["Height feet", $("#hf").value, "5"],
    ["Height inches", $("#hi").value, "9"],
    ["Weight", $("#wt").value, "145"],
    ["Club team (placeholder)", $('[name="club"]').value, "FC United 2009"],
    ["HS coach name", $("#hsc").value, "John Smith"],
    ["HS coach email", $("#hsce").value, "coach@centralhs.edu"],
    ["GPA (table layout)", $('[name="gpa_field"]').value, "3.8"],
    ["High school name", $("#hs").value, "Central High School"],
    ["Highlight video", $("#vid").value, "https://hudl.com/v/alexrivera"],
    ["NCAA ID", $("#ncaa").value, "2401234567"]
  ];

  let pass = 0, fail = 0;
  for (const [name, got, want] of checks) {
    if (got === want) { pass++; console.log(`  ✓ ${name}`); }
    else { fail++; console.log(`  ✗ ${name}: got "${got}" want "${want}"`); }
  }
  console.log(`\nEngine reported: filled=${res.filled} matched=${res.matched} skipped=${res.skipped}`);
  console.log(`RESULT: ${pass}/${pass + fail} assertions passed${fail ? " — FAILURES PRESENT" : ""}`);
  process.exit(fail ? 1 : 0);
})();
