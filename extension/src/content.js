/*
 * RecruitFill — content script (fill engine)
 *
 * Runs in every frame. Exposes window.__recruitFillRun() which the popup,
 * keyboard command, and context menu invoke via chrome.scripting.executeScript
 * (default ISOLATED world, so it shares globals with this content script).
 */
(function () {
  const { getSignature, bestMatch, normalize, containsPhrase } = window.RecruitMatcher;
  const SCHEMA = window.RECRUIT_SCHEMA;
  const US_STATES = window.RECRUIT_US_STATES;

  // Build the full value map for matching, including derived fields.
  function buildValues(profile) {
    const values = {};
    for (const f of SCHEMA) {
      if (f.editable === false && typeof f.derive === "function") {
        values[f.key] = f.derive(profile) || "";
      } else {
        values[f.key] = profile[f.key] != null ? String(profile[f.key]) : "";
      }
    }
    return values;
  }

  // Is this control something we should consider filling?
  function isFillable(el) {
    if (el.disabled || el.readOnly) return false;
    const type = (el.type || "").toLowerCase();
    if (["hidden", "submit", "button", "reset", "image", "file", "password", "search", "color", "range"].includes(type)) return false;
    // Skip clearly off-limits / security fields.
    const sig = normalize([el.name, el.id, el.getAttribute("autocomplete")].join(" "));
    if (/captcha|password|ssn|social security|credit card|cvv|routing|account number/.test(sig)) return false;
    // Visibility check.
    if (el.offsetParent === null && el.type !== "radio" && el.type !== "checkbox") {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return false;
    }
    return true;
  }

  // React/Vue-safe value setter, then fire the events frameworks listen for.
  function setNativeValue(el, value) {
    const proto = el.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype
      : el.tagName === "SELECT" ? window.HTMLSelectElement.prototype
        : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value");
    if (setter && setter.set) setter.set.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function highlight(el) {
    try {
      const prev = el.style.outline;
      el.style.outline = "2px solid #18a957";
      el.style.outlineOffset = "1px";
      setTimeout(() => { el.style.outline = prev; }, 2500);
    } catch (e) { /* ignore */ }
  }

  // Format a date value (yyyy-mm-dd or mm/dd/yyyy) for the target control.
  function formatDate(value, el) {
    const m = value.match(/(\d{1,4})\D(\d{1,2})\D(\d{1,4})/);
    if (!m) return value;
    let y, mo, d;
    if (m[1].length === 4) { y = m[1]; mo = m[2]; d = m[3]; }       // yyyy-mm-dd
    else { mo = m[1]; d = m[2]; y = m[3]; }                          // mm/dd/yyyy
    const pad = (n) => String(n).padStart(2, "0");
    if ((el.type || "").toLowerCase() === "date") return `${y}-${pad(mo)}-${pad(d)}`;
    return `${pad(mo)}/${pad(d)}/${y}`;
  }

  // Try to select the option in a <select> that best matches `value`.
  function fillSelect(el, value, field) {
    const target = normalize(value);
    if (!target) return false;
    // For states, also accept abbreviation/full-name equivalents.
    const aliases = new Set([target]);
    if (field && (field.key === "state" || field.key === "highSchoolState")) {
      for (const [ab, full] of US_STATES) {
        if (normalize(ab) === target || normalize(full) === target) {
          aliases.add(normalize(ab));
          aliases.add(normalize(full));
        }
      }
    }
    let exact = null, partial = null;
    for (const opt of el.options) {
      const ot = normalize(opt.textContent);
      const ov = normalize(opt.value);
      for (const a of aliases) {
        if (ot === a || ov === a) { exact = opt; break; }
        if (!partial && a && (containsPhrase(ot, a) || containsPhrase(ov, a))) partial = opt;
      }
      if (exact) break;
    }
    const chosen = exact || partial;
    if (chosen) {
      el.value = chosen.value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
    return false;
  }

  // Check the radio in a group whose label/value matches `value`.
  function fillRadioGroup(radios, value) {
    const target = normalize(value);
    if (!target) return false;
    for (const r of radios) {
      const sig = getSignature(r);
      const ownText = normalize([r.value, sig.strong].join(" "));
      if (containsPhrase(ownText, target) || ownText === target) {
        if (!r.checked) {
          r.checked = true;
          r.dispatchEvent(new Event("input", { bubbles: true }));
          r.dispatchEvent(new Event("change", { bubbles: true }));
          r.dispatchEvent(new Event("click", { bubbles: true }));
        }
        highlight(r.closest("label") || r);
        return true;
      }
    }
    return false;
  }

  function hasValue(el) {
    const type = (el.type || "").toLowerCase();
    if (type === "radio" || type === "checkbox") return el.checked;
    return el.value != null && String(el.value).trim() !== "";
  }

  async function runFill(opts) {
    opts = opts || {};
    const store = await chrome.storage.local.get(["profile", "settings"]);
    const profile = store.profile || {};
    const settings = Object.assign({ overwrite: false, highlight: true }, store.settings, opts);
    const values = buildValues(profile);

    const all = Array.from(document.querySelectorAll("input, select, textarea"));
    const result = { filled: 0, skipped: 0, total: 0, matched: 0, details: [] };

    // Handle radio groups once, keyed by name.
    const radioGroups = {};
    for (const el of all) {
      if ((el.type || "").toLowerCase() === "radio" && el.name) {
        (radioGroups[el.name] = radioGroups[el.name] || []).push(el);
      }
    }
    const handledRadioNames = new Set();

    for (const el of all) {
      const type = (el.type || "").toLowerCase();
      if (!isFillable(el)) continue;

      // Radio group: match on the group as a whole.
      if (type === "radio") {
        if (!el.name || handledRadioNames.has(el.name)) continue;
        handledRadioNames.add(el.name);
        const group = radioGroups[el.name];
        const sig = getSignature(group[0]);
        const match = bestMatch(sig, SCHEMA);
        if (!match) continue;
        result.matched++;
        const value = values[match.field.key];
        if (!value) continue;
        if (!settings.overwrite && group.some((r) => r.checked)) { result.skipped++; continue; }
        if (fillRadioGroup(group, value)) {
          result.filled++;
          result.details.push({ key: match.field.key, value });
        }
        continue;
      }

      if (type === "checkbox") continue; // never auto-toggle consent/agreement boxes

      result.total++;
      const sig = getSignature(el);
      const match = bestMatch(sig, SCHEMA);
      if (!match) continue;
      result.matched++;
      const field = match.field;
      const value = values[field.key];
      if (!value) continue;

      if (hasValue(el) && !settings.overwrite) { result.skipped++; continue; }

      let ok = false;
      if (el.tagName === "SELECT") {
        ok = fillSelect(el, value, field);
      } else if (field.type === "date" || type === "date") {
        setNativeValue(el, formatDate(value, el));
        ok = true;
      } else {
        setNativeValue(el, value);
        ok = true;
      }

      if (ok) {
        result.filled++;
        result.details.push({ key: field.key, value });
        if (settings.highlight) highlight(el);
      }
    }

    return result;
  }

  // Expose for executeScript-based invocation and message-based fallback.
  window.__recruitFillRun = runFill;

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.type === "RECRUIT_FILL") {
      runFill(msg.options).then(sendResponse);
      return true; // async
    }
    if (msg && msg.type === "RECRUIT_PING") {
      sendResponse({ ok: true });
      return true;
    }
  });
})();
