/* RecruitFill — options page: render the profile form from the schema, persist to storage. */

const SCHEMA = window.RECRUIT_SCHEMA;
const GROUPS = window.RECRUIT_GROUPS;
const form = document.getElementById("profileForm");

// Fields a coach's form treats as long text get a wide layout.
const WIDE_KEYS = new Set([
  "address1", "highSchool", "clubTeamName", "highlightVideoUrl", "personalWebsite", "intendedMajor", "bestEvents"
]);

function fieldControl(field) {
  if (field.type === "enum") {
    const sel = document.createElement("select");
    sel.id = `f_${field.key}`;
    sel.innerHTML = `<option value="">— Select —</option>` +
      field.options.map((o) => `<option value="${o}">${o}</option>`).join("");
    return sel;
  }
  const input = document.createElement("input");
  input.id = `f_${field.key}`;
  input.type = field.type === "email" ? "email"
    : field.type === "tel" ? "tel"
      : field.type === "date" ? "date"
        : field.type === "number" ? "text" /* keep loose; "5" feet etc. */
          : "text";
  return input;
}

function render() {
  for (const group of GROUPS) {
    const fields = SCHEMA.filter((f) => f.group === group && f.editable !== false);
    if (!fields.length) continue;
    const section = document.createElement("section");
    section.className = "group";
    const h2 = document.createElement("h2");
    h2.textContent = group;
    section.appendChild(h2);
    const wrap = document.createElement("div");
    wrap.className = "fields";
    for (const f of fields) {
      const cell = document.createElement("div");
      cell.className = "field" + (WIDE_KEYS.has(f.key) ? " wide" : "");
      const label = document.createElement("label");
      label.setAttribute("for", `f_${f.key}`);
      label.textContent = f.label;
      cell.appendChild(label);
      cell.appendChild(fieldControl(f));
      wrap.appendChild(cell);
    }
    section.appendChild(wrap);
    form.appendChild(section);
  }
}

async function load() {
  const { profile } = await chrome.storage.local.get("profile");
  if (!profile) return;
  for (const f of SCHEMA) {
    if (f.editable === false) continue;
    const el = document.getElementById(`f_${f.key}`);
    if (el && profile[f.key] != null) el.value = profile[f.key];
  }
}

function collect() {
  const profile = {};
  for (const f of SCHEMA) {
    if (f.editable === false) continue;
    const el = document.getElementById(`f_${f.key}`);
    if (el && el.value.trim() !== "") profile[f.key] = el.value.trim();
  }
  return profile;
}

function flashStatus(msg) {
  for (const id of ["saveStatus", "saveStatus2"]) {
    const el = document.getElementById(id);
    el.textContent = msg;
    setTimeout(() => { el.textContent = ""; }, 2500);
  }
}

async function save() {
  await chrome.storage.local.set({ profile: collect() });
  flashStatus("✓ Saved");
}

document.getElementById("saveBtn").addEventListener("click", save);
document.getElementById("saveBtn2").addEventListener("click", save);

// Export / Import
document.getElementById("exportBtn").addEventListener("click", () => {
  const data = JSON.stringify(collect(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "recruitfill-profile.json";
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      for (const f of SCHEMA) {
        if (f.editable === false) continue;
        const el = document.getElementById(`f_${f.key}`);
        if (el && data[f.key] != null) el.value = data[f.key];
      }
      flashStatus("✓ Imported — review, then Save");
    } catch (err) {
      flashStatus("Import failed: invalid file");
    }
  };
  reader.readAsText(file);
});

render();
load();
