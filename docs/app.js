import {
  getCitiesAllLangs,
  getPrefecturesAllLangs,
} from "https://esm.sh/jp-regions-i18n@0.9.1";

// ===== 言語メタ定義 =====
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

// 市区町村の言語タブ
const CITY_LANG_TABS = [
  { code: "ja",      label: "日本語" },
  { code: "en",      label: "English" },
  { code: "zh-CN",   label: "中文(简)" },
  { code: "zh-TW",   label: "中文(繁)" },
  { code: "ko",      label: "한국어" },
  { code: "pt",      label: "Português" },
  { code: "vi",      label: "Tiếng Việt" },
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

// ===== State =====
let allPrefectures = [];
let selectedPref   = null;
let selectedCities = [];
let cityLang       = "ja";
let cityFilter     = "";

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
const cityLangTabsEl  = document.getElementById("city-lang-tabs");
const citiesSearchEl  = document.getElementById("cities-search");

// ===== DOM helpers =====
/** テキストノードを持つ要素を生成 */
function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text != null) e.textContent = text;
  return e;
}

// ===== Init =====
function init() {
  allPrefectures = getPrefecturesAllLangs();

  buildCityLangTabs();

  const params = new URLSearchParams(location.search);
  const initialQuery    = params.get("q")    ?? "";
  const initialPrefCode = params.get("pref") ?? "";
  const initialLang     = params.get("lang") ?? "ja";

  cityLang = CITY_LANG_TABS.some(t => t.code === initialLang) ? initialLang : "ja";
  updateLangTabUI();

  if (initialQuery) searchEl.value = initialQuery;
  const initialList = filterPrefectures(initialQuery);
  renderList(initialList);

  if (initialPrefCode) {
    const pref = allPrefectures.find((p) => p.code === initialPrefCode);
    if (pref) selectPref(pref, /* pushState= */ false);
  }

  searchEl.addEventListener("input", onPrefSearch);
  citiesSearchEl.addEventListener("input", onCitySearch);
}

// ===== City lang tabs =====
function buildCityLangTabs() {
  cityLangTabsEl.textContent = "";
  CITY_LANG_TABS.forEach(({ code, label }) => {
    const btn = el("button", "city-lang-tab", label);
    btn.type = "button";
    btn.dataset.lang = code;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", code === cityLang ? "true" : "false");
    btn.addEventListener("click", () => {
      cityLang = code;
      updateLangTabUI();
      updateUrl({ lang: code });
      renderCitiesContent();
    });
    cityLangTabsEl.appendChild(btn);
  });
}

function updateLangTabUI() {
  cityLangTabsEl.querySelectorAll(".city-lang-tab").forEach((btn) => {
    const active = btn.dataset.lang === cityLang;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });
}

// ===== Pref search =====
function onPrefSearch() {
  const q = searchEl.value.trim();
  const filtered = filterPrefectures(q);
  renderList(filtered);
  updateUrl({ q: q || null });
  if (selectedPref && !filtered.find((p) => p.code === selectedPref.code)) {
    clearDetail();
  }
}

function onCitySearch() {
  cityFilter = citiesSearchEl.value.trim().toLowerCase();
  renderCitiesContent();
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

// ===== Render pref list =====
function renderList(prefectures) {
  countEl.textContent = `${prefectures.length} 件`;

  const fragment = document.createDocumentFragment();
  prefectures.forEach((pref) => {
    const li = document.createElement("li");
    li.className = `pref-item${selectedPref?.code === pref.code ? " active" : ""}`;
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", selectedPref?.code === pref.code ? "true" : "false");
    li.dataset.code = pref.code;
    li.append(
      el("span", "pref-code", pref.code),
      el("span", "pref-ja",   pref.name.ja),
      el("span", "pref-en",   pref.name.en),
    );
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
    if (val == null) params.delete(key);
    else params.set(key, val);
  }
  const qs = params.toString();
  history.pushState({}, "", qs ? `?${qs}` : location.pathname);
}

// ===== Select prefecture =====
function selectPref(pref, pushState = true) {
  selectedPref = pref;
  cityFilter = "";
  citiesSearchEl.value = "";

  listEl.querySelectorAll(".pref-item").forEach((item) => {
    const active = item.dataset.code === pref.code;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", active ? "true" : "false");
  });

  if (pushState) updateUrl({ pref: pref.code });
  renderDetail(pref);

  selectedCities = getCitiesAllLangs(pref.code);
  renderCitiesHeader(pref);
  renderCitiesContent();
}

function clearDetail() {
  selectedPref = null;
  selectedCities = [];
  placeholderEl.classList.remove("hidden");
  prefDetailEl.classList.add("hidden");
  citiesSectionEl.classList.add("hidden");
}

// ===== Render prefecture detail =====
function renderDetail(pref) {
  placeholderEl.classList.add("hidden");
  prefDetailEl.classList.remove("hidden");

  detailTitleEl.textContent = pref.name.ja;

  // codes
  detailCodesEl.textContent = "";
  [
    { label: "JIS",    value: pref.code },
    { label: "ISO",    value: pref.iso },
    { label: "LGCode", value: pref.lgCode },
  ].forEach(({ label, value }) => {
    const chip = el("span", "code-chip");
    chip.append(
      el("span", "chip-label", label),
      el("span", "chip-value", value),
    );
    detailCodesEl.appendChild(chip);
  });

  // lang grid
  langGridEl.textContent = "";
  LANG_META.forEach(({ code, label, script }) => {
    const card = el("div", "lang-card");

    const labelEl = el("div", "lang-label", label);
    if (script) {
      labelEl.appendChild(el("span", "lang-script", script));
    }

    card.append(
      labelEl,
      el("div", "lang-name", pref.name[code] ?? "—"),
      el("div", "lang-code", code),
    );
    langGridEl.appendChild(card);
  });

  btnCopyPrefEl.dataset.json = JSON.stringify(
    { code: pref.code, iso: pref.iso, lgCode: pref.lgCode, name: pref.name },
    null,
    2
  );
}

// ===== Copy pref JSON =====
btnCopyPrefEl.addEventListener("click", () => {
  const json = btnCopyPrefEl.dataset.json;
  if (!json) return;
  navigator.clipboard.writeText(json).then(() => {
    btnCopyPrefEl.classList.add("copied");
    btnCopyPrefEl.textContent = "✓ Copied!";
    showToast("Copied JSON to clipboard");
    setTimeout(() => {
      btnCopyPrefEl.classList.remove("copied");
      btnCopyPrefEl.textContent = "📋 Copy JSON";
    }, 2000);
  });
});

// ===== Render cities header (once per prefecture) =====
function renderCitiesHeader(pref) {
  citiesSectionEl.classList.remove("hidden");
  citiesTitleEl.textContent = `${pref.name.ja} / Cities`;
  citiesCountEl.textContent = `${selectedCities.length} 件`;
}

// ===== Render cities content (re-run on lang/filter change) =====
function renderCitiesContent() {
  const filtered = cityFilter
    ? selectedCities.filter((city) =>
        Object.values(city.name).some((n) => n.toLowerCase().includes(cityFilter))
      )
    : selectedCities;

  citiesContEl.textContent = "";

  if (filtered.length === 0) {
    const empty = el("div", "cities-empty", `No cities found for "${cityFilter}"`);
    citiesContEl.appendChild(empty);
    return;
  }

  // type別グルーピング
  const grouped = {};
  filtered.forEach((city) => {
    if (!grouped[city.type]) grouped[city.type] = [];
    grouped[city.type].push(city);
  });

  const fragment = document.createDocumentFragment();

  CITY_TYPE_ORDER.filter((t) => grouped[t]?.length).forEach((type) => {
    // ward は政令市の子として処理するためスキップ
    if (type === "ward" && grouped.designated_city?.length) return;

    const cities = grouped[type];
    const section = el("div", "city-group");

    const header = el("div", "city-group-header");
    const badge = el("span", `city-type-badge ${type}`, CITY_TYPE_LABEL[type]);
    const cnt = el("span", "city-group-count", `${cities.length}`);
    header.append(badge, cnt);
    section.appendChild(header);

    if (type === "designated_city") {
      renderDesignatedCities(cities, filtered, section);
    } else {
      section.appendChild(buildCityChips(cities));
    }

    fragment.appendChild(section);
  });

  citiesContEl.appendChild(fragment);
}

// ===== 政令指定都市の親子レンダリング =====
function renderDesignatedCities(designatedCities, allFiltered, container) {
  designatedCities.forEach((city) => {
    const cityWrap = el("div");

    cityWrap.appendChild(buildCityChip(city, /* isParent= */ true));

    const wards = allFiltered.filter(
      (c) => c.type === "ward" && c.parentJisCode === city.jisCode
    );
    if (wards.length > 0) {
      const subgroup = el("div", "city-subgroup");
      subgroup.appendChild(el("div", "city-subgroup-title", `Wards (${wards.length})`));
      subgroup.appendChild(buildCityChips(wards));
      cityWrap.appendChild(subgroup);
    }

    container.appendChild(cityWrap);
  });
}

// ===== City chip builders =====
function buildCityChips(cities) {
  const wrap = el("div", "city-chips");
  for (const city of cities) {
    wrap.appendChild(buildCityChip(city, false));
  }
  return wrap;
}

function buildCityChip(city, isParent) {
  const primary   = city.name[cityLang] ?? city.name.ja;
  const secondary = cityLang !== "ja" ? city.name.ja : city.name.en;

  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = `city-chip${isParent ? " city-chip--parent" : ""}`;
  chip.title = `JIS: ${city.jisCode} / LG: ${city.lgCode}`;
  chip.append(
    el("span", "city-chip-primary",   primary),
    el("span", "city-chip-secondary", secondary),
  );

  chip.addEventListener("click", () => {
    const json = JSON.stringify(
      {
        jisCode: city.jisCode,
        lgCode: city.lgCode,
        type: city.type,
        parentJisCode: city.parentJisCode,
        name: city.name,
      },
      null,
      2
    );
    navigator.clipboard.writeText(json).then(() => {
      showToast(`Copied ${city.name.ja} JSON to clipboard`);
    });
  });

  return chip;
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
