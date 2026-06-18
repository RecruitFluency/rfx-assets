/* RFX RecruitRush — welcome page logic */
const CFG = window.RFX_CONFIG;

document.getElementById("iosBtn").href = CFG.storeLink("ios", "welcome");
document.getElementById("playBtn").href = CFG.storeLink("android", "welcome");

document.getElementById("setupBtn").addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
  else window.open(chrome.runtime.getURL("options/options.html"));
});

document.getElementById("fillHelp").addEventListener("click", () => {
  document.getElementById("how").scrollIntoView({ behavior: "smooth" });
});
