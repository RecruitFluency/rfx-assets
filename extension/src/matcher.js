/*
 * RecruitFill — field matcher
 *
 * Pure DOM/string logic that decides which profile field (if any) a given form
 * control corresponds to. Kept free of storage/UI so it is easy to reason about.
 * Exposed on `window.RecruitMatcher`.
 */
(function () {
  // Normalize any string to lowercase alphanumeric tokens separated by single spaces.
  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .replace(/[_\-]+/g, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Does `haystack` contain `phrase` on whole-token boundaries?
  function containsPhrase(haystack, phrase) {
    if (!phrase) return false;
    const re = new RegExp("(^| )" + phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "( |$)");
    return re.test(haystack);
  }

  const CONTROL_RE = /^(input|select|textarea)$/i;

  // Collect human-meaningful text describing a form control. "strong" sources
  // are field-specific and reliable (explicit <label>, aria, placeholder); these
  // are weighted double. "weak" sources are best-effort structural hints used
  // only when they can be tied to *this* control without pulling in neighbors.
  function getSignature(el) {
    const strong = [];
    const weak = [];
    const id = el.id;
    const doc = el.ownerDocument;
    const type = (el.type || "").toLowerCase();

    // 1. <label for="id">
    if (id) {
      try {
        const lbl = doc.querySelector(`label[for="${CSS.escape(id)}"]`);
        if (lbl) strong.push(lbl.textContent);
      } catch (e) { /* invalid id */ }
    }
    // 2. Wrapping <label>
    const wrapLabel = el.closest("label");
    if (wrapLabel) strong.push(ownLabelText(wrapLabel));

    // 3. aria-label / aria-labelledby / title / placeholder
    if (el.getAttribute("aria-label")) strong.push(el.getAttribute("aria-label"));
    const labelledby = el.getAttribute("aria-labelledby");
    if (labelledby) {
      labelledby.split(/\s+/).forEach((rid) => {
        const r = doc.getElementById(rid);
        if (r) strong.push(r.textContent);
      });
    }
    if (el.placeholder) strong.push(el.placeholder);
    if (el.title) strong.push(el.title);

    // 4. Fieldset legend — only meaningful for radio/checkbox groups (e.g.
    //    "Gender"); for plain inputs a legend is usually the whole form's title.
    if (type === "radio" || type === "checkbox") {
      const fs = el.closest("fieldset");
      const legend = fs && fs.querySelector("legend");
      if (legend) strong.push(legend.textContent);
    }

    // 5. Table-style forms: the row's header cell.
    const cell = el.closest("td, th");
    if (cell) {
      const row = cell.closest("tr");
      const firstCell = row && row.querySelector("th, td");
      if (firstCell && firstCell !== cell) strong.push(firstCell.textContent);
    }

    // 6. Immediately-preceding label text (flat "<label></label><input>" forms),
    //    stopping at the previous control so we never absorb a sibling field.
    const preceding = precedingLabelText(el);
    if (preceding) strong.push(preceding);

    // 7. A wrapper that is dedicated to this single control (e.g. a field <div>).
    const container = containerText(el);
    if (container) weak.push(container);

    // 8. The control's own attributes (least reliable).
    weak.push(el.name, el.id, el.getAttribute("data-field"), el.getAttribute("autocomplete"));

    const strongStr = normalize(strong.join(" "));
    const weakStr = normalize(weak.join(" "));
    return { full: (strongStr + " " + strongStr + " " + weakStr).trim(), strong: strongStr };
  }

  // Text of a wrapping <label> excluding any nested control values.
  function ownLabelText(label) {
    return Array.from(label.childNodes)
      .filter((n) => !(n.nodeType === Node.ELEMENT_NODE && CONTROL_RE.test(n.tagName)))
      .map((n) => n.textContent || "")
      .join(" ");
  }

  // Nearest preceding sibling that is a plain label (not a control and not a
  // wrapper containing a control). Returns "" once we hit another field.
  function precedingLabelText(el) {
    let sib = el.previousElementSibling;
    let hops = 0;
    while (sib && hops < 3) {
      if (CONTROL_RE.test(sib.tagName)) break;
      if (sib.querySelector && sib.querySelector("input, select, textarea")) break;
      const t = (sib.textContent || "").trim();
      if (t) return t;
      sib = sib.previousElementSibling;
      hops++;
    }
    return "";
  }

  // Text of the closest ancestor that wraps exactly this one control (a typical
  // field container). Bails out as soon as an ancestor holds multiple controls,
  // so flat forms don't leak every label into every field.
  function containerText(el) {
    let node = el.parentElement;
    let hops = 0;
    while (node && hops < 3) {
      const controls = node.querySelectorAll("input, select, textarea");
      if (controls.length > 1) return "";
      if (controls.length === 1) return shallowText(node);
      node = node.parentElement;
      hops++;
    }
    return "";
  }

  // Text of a node excluding nested form controls / option lists.
  function shallowText(node) {
    if (!node) return "";
    let out = "";
    node.childNodes.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) out += " " + n.textContent;
      else if (n.nodeType === Node.ELEMENT_NODE &&
        !/^(input|select|textarea|option|script|style|button)$/i.test(n.tagName)) {
        out += " " + (n.textContent || "");
      }
    });
    return out;
  }

  // Score a normalized signature against one schema field. Returns the length of
  // the longest matched synonym (more specific = higher), or 0 / -1 if anti words
  // are present.
  function scoreField(sig, field) {
    for (const a of (field.anti || [])) {
      if (containsPhrase(sig.full, normalize(a))) return -1;
    }
    let best = 0;
    for (const s of field.synonyms) {
      const ns = normalize(s);
      if (containsPhrase(sig.full, ns)) {
        // Prefer matches that also appear in the strong (visible-label) text.
        const weight = ns.length + (containsPhrase(sig.strong, ns) ? 2 : 0);
        if (weight > best) best = weight;
      }
    }
    return best;
  }

  // Choose the best-matching schema field for an element's signature.
  function bestMatch(sig, schema) {
    let winner = null;
    let winScore = 0;
    for (const field of schema) {
      const score = scoreField(sig, field);
      if (score > winScore) {
        winScore = score;
        winner = field;
      }
    }
    return winner ? { field: winner, score: winScore } : null;
  }

  window.RecruitMatcher = { normalize, containsPhrase, getSignature, scoreField, bestMatch };
})();
