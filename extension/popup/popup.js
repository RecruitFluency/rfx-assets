/* RFX RecruitRush — popup logic */

const fillBtn = document.getElementById("fillBtn");
const statusEl = document.getElementById("status");
const overwriteEl = document.getElementById("overwrite");
const highlightEl = document.getElementById("highlight");
const warning = document.getElementById("profileWarning");

function openOptions(e) {
  if (e) e.preventDefault();
  chrome.runtime.openOptionsPage();
}
document.getElementById("editProfile").addEventListener("click", openOptions);
document.getElementById("setupLink").addEventListener("click", openOptions);

// Load saved settings + warn if profile is empty.
(async function init() {
  const { settings, profile } = await chrome.storage.local.get(["settings", "profile"]);
  if (settings) {
    overwriteEl.checked = !!settings.overwrite;
    highlightEl.checked = settings.highlight !== false;
  }
  const hasProfile = profile && Object.values(profile).some((v) => String(v || "").trim() !== "");
  if (!hasProfile) warning.classList.remove("hidden");
})();

async function saveSettings() {
  await chrome.storage.local.set({
    settings: { overwrite: overwriteEl.checked, highlight: highlightEl.checked }
  });
}
overwriteEl.addEventListener("change", saveSettings);
highlightEl.addEventListener("change", saveSettings);

fillBtn.addEventListener("click", async () => {
  await saveSettings();
  fillBtn.disabled = true;
  statusEl.className = "status";
  statusEl.textContent = "Scanning the page…";

  try {
    const res = await chrome.runtime.sendMessage({ type: "RECRUIT_FILL_TAB" });
    if (!res || res.error) {
      statusEl.className = "status error";
      statusEl.textContent = "Couldn't run on this page. Open the actual form tab and try again.";
    } else if (res.filled > 0) {
      statusEl.className = "status success";
      const skip = res.skipped ? `, skipped ${res.skipped} already-filled` : "";
      statusEl.textContent = `Filled ${res.filled} field${res.filled === 1 ? "" : "s"}${skip}.`;
    } else if (res.matched > 0) {
      statusEl.className = "status";
      statusEl.textContent = "Matched fields were already filled. Toggle “Overwrite” to replace them.";
    } else {
      statusEl.className = "status";
      statusEl.textContent = "No recognizable recruiting fields found on this page.";
    }
  } catch (e) {
    statusEl.className = "status error";
    statusEl.textContent = "This page can't be filled (e.g. a browser settings page).";
  } finally {
    fillBtn.disabled = false;
  }
});
