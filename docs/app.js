import {
  getCitiesAllLangs,
  getPrefecturesAllLangs,
} from "https://esm.sh/jp-regions-i18n@0.8.0";

// ===== 言語ラベル定義 =====
const LANG_META = [
  { code: "ja",      label: "日本語",      script: "漢字" },
  { code: "ja-Hira", label: "日本語",      script: "ひらがな" },
  { code: "ja-Kana", label: "日本語",      script: "カタカナ" },
  { code: "ja-HW",   label: "日本語",      script: "半角カナ" },
  { code: "en",      label: "English",    script: null },
  { code: "zh-CN",   label: "中文",        script: "简体" },
  { code: "zh-TW",   label: "中文",        script: "繁體" },
  { code: "ko",      label: "한국어",       script: null },
  { code: "pt",      label: "Português",  script: null },
  { code: "vi",      label: "Tiếng Việt", script: null },
];

const CITY_TYPE_LABEL = {
  designated_city: "政令指定都市",
  city:            "市",
  special_ward:    "特別区（東京23区）",
  ward:            "区（政令市の区）",
  town:            "町",
  village:         "村",
};
const CITY_TYPE_ORDER = [
  "designated_city", "special_ward", "city", "ward", "town", "village",
];

// ===== Helper: HTML エスケープ =====
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ===== State =====
let allPrefectures = [];
let selectedPref = null;

// ===== DOM refs =====
const searchEl        = document.getElementById("search");
const listEl          = document.getElementById("pref-list");
const countEl         = document.getElementById("pref-count");
const placeholderEl   = document.getElementById("detail-placeholder");
const prefDetailEl    = document.getElementById("pref-detail");
const citiesSectionEl = document.getElementById("cities-section");
const detailTitleEl   = document.getElementById("detail-title");
const detailCodesEl   = document.getElementById("detail-codes");
const langGridEl      = document.getElementById("lang-grid");
const citiesTitleEl   = document.getElementById("cities-title");
const citiesCountEl   = document.getElementById("cities-count");
const citiesContEl    = document.getElementById("cities-container");
const btnCopyPrefEl   = document.getElementById("btn-copy-pref");

// ===== Init =====
function init() {
  allPrefectures = getPrefecturesAllLangs();

  // URL パラメータから初期状態を復元
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q") ?? "";
  const initialPrefCode = params.get("pref") ?? "";

  if (initialQuery) searchEl.value = initialQuery;
  const initialList = filterPrefectures(initialQuery);
  renderList(initialList);

  if (initialPrefCode) {
    const pref = allPrefectures.find((p) => p.code === initialPrefCode);
    if (pref) selectPref(pref, /* pushState= */ false);
  }

  searchEl.addEventListener("input", () => {
    const q = searchEl.value.trim();
    const filtered = filterPrefectures(q);
    renderList(filtered);
    updateUrl({ q: q || null });
    if (selectedPref && !filtered.find((p) => p.code === selectedPref.code)) {
      clearDetail();
    }
  });
}

// ===== Filter =====
function filterPrefectures(query) {
  if (!query) return allPrefectures;
  const q = query.toLowerCase();
  return allPrefectures.filter((pref) => {
    if (pref.code === query.padStart(2, "0")) return true;
    if (pref.iso.toLowerCase() === q) return true;
    if (pref.lgCode === query) return true;
    return Object.values(pref.name).some((n) => n.toLowerCase().includes(q));
  });
}

// ===== Render list =====
function renderList(prefectures) {
  countEl.textContent = `${prefectures.length} 件`;

  const fragment = document.createDocumentFragment();
  prefectures.forEach((pref) => {
    const li = document.createElement("li");
    li.className = `pref-item${selectedPref?.code === pref.code ? " active" : ""}`;
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", selectedPref?.code === pref.code ? "true" : "false");
    li.dataset.code = pref.code;

    const codeSpan = document.createElement("span");
    codeSpan.className = "pref-code";
    codeSpan.textContent = pref.code;

    const jaSpan = document.createElement("span");
    jaSpan.className = "pref-ja";
    jaSpan.textContent = pref.name.ja;

    const enSpan = document.createElement("span");
    enSpan.className = "pref-en";
    enSpan.textContent = pref.name.en;

    li.append(codeSpan, jaSpan, enSpan);
    li.addEventListener("click", () => selectPref(pref));
    fragment.appendChild(li);
  });

  listEl.textContent = "";
  listEl.appendChild(fragment);
}

// ===== URL helpers =====
function updateUrl(patch) {
  const params = new URLSearchParams(location.search);
  for (const [key, val] of Object.entries(patch)) {
    if (val == null) {
      params.delete(key);
    } else {
      params.set(key, val);
    }
  }
  const qs = params.toString();
  history.pushState({}, "", qs ? `?${qs}` : location.pathname);
}

// ===== Select prefecture =====
function selectPref(pref, pushState = true) {
  selectedPref = pref;
  listEl.querySelectorAll(".pref-item").forEach((el) => {
    const isActive = el.dataset.code === pref.code;
    el.classList.toggle("active", isActive);
    el.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  if (pushState) updateUrl({ pref: pref.code });
  renderDetail(pref);
  renderCities(pref.code, pref.name.ja);
}

function clearDetail() {
  selectedPref = null;
  placeholderEl.classList.remove("hidden");
  prefDetailEl.classList.add("hidden");
  citiesSectionEl.classList.add("hidden");
}

// ===== Render detail =====
function renderDetail(pref) {
  placeholderEl.classList.add("hidden");
  prefDetailEl.classList.remove("hidden");

  detailTitleEl.textContent = pref.name.ja;

  detailCodesEl.innerHTML = [
    { label: "JIS",    value: pref.code },
    { label: "ISO",    value: pref.iso },
    { label: "LGCode", value: pref.lgCode },
  ]
    .map(
      (c) => `<span class="code-chip">
        <span class="chip-label">${esc(c.label)}</span>
        <span class="chip-value">${esc(c.value)}</span>
      </span>`
    )
    .join("");

  langGridEl.innerHTML = LANG_META.map(({ code, label, script }) => {
    const name = pref.name[code] ?? "—";
    const displayLabel = script ? `${esc(label)} (${esc(script)})` : esc(label);
    return `<div class="lang-card">
      <div class="lang-label">${displayLabel}</div>
      <div class="lang-name">${esc(name)}</div>
      <div class="lang-code">${esc(code)}</div>
    </div>`;
  }).join("");

  btnCopyPrefEl.dataset.json = JSON.stringify(
    { code: pref.code, iso: pref.iso, lgCode: pref.lgCode, name: pref.name },
    null,
    2
  );
}

// ===== Copy JSON =====
btnCopyPrefEl.addEventListener("click", () => {
  const json = btnCopyPrefEl.dataset.json;
  if (!json) return;
  navigator.clipboard.writeText(json).then(() => {
    btnCopyPrefEl.classList.add("copied");
    btnCopyPrefEl.textContent = "✅ Copied!";
    showToast("JSON をクリップボードにコピーしました");
    setTimeout(() => {
      btnCopyPrefEl.classList.remove("copied");
      btnCopyPrefEl.textContent = "📋 Copy JSON";
    }, 2000);
  });
});

// ===== Render cities =====
function renderCities(prefCode, prefNameJa) {
  const cities = getCitiesAllLangs(prefCode);
  citiesSectionEl.classList.remove("hidden");
  citiesTitleEl.textContent = `${prefNameJa} の市区町村`;
  citiesCountEl.textContent = `${cities.length} 件`;

  const grouped = {};
  cities.forEach((city) => {
    if (!grouped[city.type]) grouped[city.type] = [];
    grouped[city.type].push(city);
  });

  const fragment = document.createDocumentFragment();
  CITY_TYPE_ORDER.filter((t) => grouped[t]?.length).forEach((type) => {
    const section = document.createElement("div");

    const title = document.createElement("div");
    title.className = "city-group-title";
    title.textContent = `${CITY_TYPE_LABEL[type]} (${grouped[type].length})`;
    section.appendChild(title);

    const chips = document.createElement("div");
    chips.className = "city-chips";
    grouped[type].forEach((city) => {
      const chip = document.createElement("span");
      chip.className = "city-chip";

      const jaEl = document.createElement("span");
      jaEl.className = "city-chip-ja";
      jaEl.textContent = city.name.ja;

      const enEl = document.createElement("span");
      enEl.className = "city-chip-en";
      enEl.textContent = city.name.en;

      chip.append(jaEl, enEl);
      chips.appendChild(chip);
    });
    section.appendChild(chips);
    fragment.appendChild(section);
  });

  citiesContEl.textContent = "";
  citiesContEl.appendChild(fragment);
}

// ===== Toast =====
const toastEl = document.getElementById("toast");
let toastTimer;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2500);
}

// ===== Start =====
init();
