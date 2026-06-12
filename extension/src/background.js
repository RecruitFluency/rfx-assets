/*
 * RecruitFill — background service worker
 *
 * Wires up the keyboard command (Alt+Shift+F) and the right-click context menu,
 * and runs the fill across all frames of the active tab, reporting a count on
 * the toolbar badge.
 */

// The function injected into each frame. It calls the content script's global
// (both live in the ISOLATED world) and returns that frame's result.
function invokeFill() {
  if (typeof window.__recruitFillRun === "function") return window.__recruitFillRun();
  return { filled: 0, total: 0, matched: 0, skipped: 0, details: [], noEngine: true };
}

async function fillActiveTab(tab) {
  if (!tab || !tab.id) return { filled: 0 };
  let totals = { filled: 0, matched: 0, skipped: 0 };
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: invokeFill
    });
    for (const r of results) {
      if (r && r.result) {
        totals.filled += r.result.filled || 0;
        totals.matched += r.result.matched || 0;
        totals.skipped += r.result.skipped || 0;
      }
    }
  } catch (e) {
    await flashBadge("err", "#c0392b", tab.id);
    return { error: String(e), ...totals };
  }
  await flashBadge(String(totals.filled), totals.filled > 0 ? "#18a957" : "#888", tab.id);
  return totals;
}

async function flashBadge(text, color, tabId) {
  try {
    await chrome.action.setBadgeBackgroundColor({ color, tabId });
    await chrome.action.setBadgeText({ text, tabId });
    setTimeout(() => chrome.action.setBadgeText({ text: "", tabId }), 4000);
  } catch (e) { /* tab may be gone */ }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "recruitfill-fill",
    title: "Autofill recruiting form with RecruitFill",
    contexts: ["page", "editable"]
  });
  chrome.contextMenus.create({
    id: "recruitfill-options",
    title: "Edit my recruiting profile…",
    contexts: ["action"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "recruitfill-fill") fillActiveTab(tab);
  else if (info.menuItemId === "recruitfill-options") chrome.runtime.openOptionsPage();
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "fill-form") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  fillActiveTab(tab);
});

// Allow the popup to delegate the multi-frame fill to the worker.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "RECRUIT_FILL_TAB") {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      fillActiveTab(tab).then(sendResponse);
    });
    return true;
  }
});
