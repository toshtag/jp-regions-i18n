import { describe, expect, it } from "vitest";
import {
  getPrefectureByCode,
  getPrefectureByCodeAllLangs,
  getPrefectureByISO,
  getPrefectureByISOAllLangs,
  getPrefectureByLGCode,
  getPrefectureByLGCodeAllLangs,
  getPrefectureByName,
  getPrefectureByNameAllLangs,
  getPrefectures,
  getPrefecturesAllLangs,
} from "../src/index.js";

describe("getPrefectures", () => {
  it("returns all 47 prefectures", () => {
    const prefs = getPrefectures();
    expect(prefs).toHaveLength(47);
  });

  it("defaults to Japanese names", () => {
    const prefs = getPrefectures();
    expect(prefs[0].name).toBe("北海道");
    expect(prefs[12].name).toBe("東京都");
  });

  it("returns English names", () => {
    const prefs = getPrefectures("en");
    expect(prefs[0].name).toBe("Hokkaido");
    expect(prefs[12].name).toBe("Tokyo");
  });

  it("returns names in all 7 languages", () => {
    const langs = ["ja", "en", "zh-CN", "zh-TW", "ko", "pt", "vi"] as const;
    for (const lang of langs) {
      const prefs = getPrefectures(lang);
      expect(prefs).toHaveLength(47);
      for (const p of prefs) {
        expect(p.name).toBeTruthy();
      }
    }
  });

  it("returns hiragana names", () => {
    const prefs = getPrefectures("ja-Hira");
    expect(prefs).toHaveLength(47);
    expect(prefs[0].name).toBe("ほっかいどう");
    expect(prefs[12].name).toBe("とうきょうと");
    expect(prefs[26].name).toBe("おおさかふ");
  });

  it("returns katakana names", () => {
    const prefs = getPrefectures("ja-Kana");
    expect(prefs).toHaveLength(47);
    expect(prefs[0].name).toBe("ホッカイドウ");
    expect(prefs[12].name).toBe("トウキョウト");
    expect(prefs[26].name).toBe("オオサカフ");
  });

  it("returns half-width kana names", () => {
    const prefs = getPrefectures("ja-HW");
    expect(prefs).toHaveLength(47);
    expect(prefs[0].name).toBe("ﾎｯｶｲﾄﾞｳ");
    expect(prefs[12].name).toBe("ﾄｳｷｮｳﾄ");
    expect(prefs[26].name).toBe("ｵｵｻｶﾌ");
  });
});

describe("getPrefectureByCode", () => {
  it("returns correct prefecture for valid code", () => {
    const tokyo = getPrefectureByCode("13");
    expect(tokyo).toBeDefined();
    expect(tokyo?.code).toBe("13");
    expect(tokyo?.iso).toBe("JP-13");
    expect(tokyo?.name).toBe("東京都");
  });

  it("returns English name when lang is specified", () => {
    const tokyo = getPrefectureByCode("13", "en");
    expect(tokyo?.name).toBe("Tokyo");
  });

  it("returns undefined for non-existent code", () => {
    expect(getPrefectureByCode("99")).toBeUndefined();
  });

  it("defaults to ja when lang is omitted", () => {
    const hokkaido = getPrefectureByCode("01");
    expect(hokkaido?.name).toBe("北海道");
  });
});

describe("getPrefectureByISO", () => {
  it("returns correct prefecture for valid ISO code", () => {
    const tokyo = getPrefectureByISO("JP-13");
    expect(tokyo).toBeDefined();
    expect(tokyo?.code).toBe("13");
    expect(tokyo?.name).toBe("東京都");
  });

  it("returns zh-CN name", () => {
    const tokyo = getPrefectureByISO("JP-13", "zh-CN");
    expect(tokyo?.name).toBe("东京都");
  });

  it("returns undefined for non-existent ISO", () => {
    expect(getPrefectureByISO("JP-99")).toBeUndefined();
  });
});

describe("getPrefectureByLGCode", () => {
  it("returns correct prefecture for valid 6-digit lgCode", () => {
    const tokyo = getPrefectureByLGCode("130001");
    expect(tokyo).toBeDefined();
    expect(tokyo?.code).toBe("13");
    expect(tokyo?.iso).toBe("JP-13");
    expect(tokyo?.lgCode).toBe("130001");
    expect(tokyo?.name).toBe("東京都");
  });

  it("returns English name when lang is specified", () => {
    const tokyo = getPrefectureByLGCode("130001", "en");
    expect(tokyo?.name).toBe("Tokyo");
  });

  it("returns Hokkaido by lgCode", () => {
    const hokkaido = getPrefectureByLGCode("010006");
    expect(hokkaido?.code).toBe("01");
    expect(hokkaido?.lgCode).toBe("010006");
  });

  it("returns undefined for non-existent lgCode", () => {
    expect(getPrefectureByLGCode("999999")).toBeUndefined();
  });
});

describe("Prefecture lgCode field", () => {
  it("all prefectures have a 6-digit lgCode", () => {
    const prefs = getPrefectures();
    for (const p of prefs) {
      expect(p.lgCode).toMatch(/^\d{6}$/);
    }
  });

  it("getPrefectureByCode includes lgCode", () => {
    const tokyo = getPrefectureByCode("13");
    expect(tokyo?.lgCode).toBe("130001");
  });

  it("getPrefectureByISO includes lgCode", () => {
    const tokyo = getPrefectureByISO("JP-13");
    expect(tokyo?.lgCode).toBe("130001");
  });
});

describe("getPrefecturesAllLangs", () => {
  it("returns all 47 prefectures", () => {
    expect(getPrefecturesAllLangs()).toHaveLength(47);
  });

  it("includes all 10 languages in name", () => {
    const prefs = getPrefecturesAllLangs();
    const langs = [
      "ja",
      "ja-Hira",
      "ja-Kana",
      "ja-HW",
      "en",
      "zh-CN",
      "zh-TW",
      "ko",
      "pt",
      "vi",
    ] as const;
    for (const p of prefs) {
      for (const lang of langs) {
        expect(p.name[lang]).toBeTruthy();
      }
    }
  });

  it("returns correct names for Hokkaido", () => {
    const hokkaido = getPrefecturesAllLangs()[0];
    expect(hokkaido.name.ja).toBe("北海道");
    expect(hokkaido.name.en).toBe("Hokkaido");
  });

  it("returns correct structure fields", () => {
    const p = getPrefecturesAllLangs()[0];
    expect(p.code).toBe("01");
    expect(p.iso).toBe("JP-01");
    expect(p.lgCode).toMatch(/^\d{6}$/);
  });
});

describe("getPrefectureByCodeAllLangs", () => {
  it("returns prefecture with all languages", () => {
    const tokyo = getPrefectureByCodeAllLangs("13");
    expect(tokyo).toBeDefined();
    expect(tokyo?.code).toBe("13");
    expect(tokyo?.iso).toBe("JP-13");
    expect(tokyo?.lgCode).toBe("130001");
    expect(tokyo?.name.ja).toBe("東京都");
    expect(tokyo?.name.en).toBe("Tokyo");
    expect(tokyo?.name.ko).toBe("도쿄도");
  });

  it("returns undefined for non-existent code", () => {
    expect(getPrefectureByCodeAllLangs("99")).toBeUndefined();
  });
});

describe("getPrefectureByISOAllLangs", () => {
  it("returns prefecture with all languages", () => {
    const osaka = getPrefectureByISOAllLangs("JP-27");
    expect(osaka).toBeDefined();
    expect(osaka?.code).toBe("27");
    expect(osaka?.name.ja).toBeTruthy();
    expect(osaka?.name.en).toBeTruthy();
  });

  it("returns undefined for non-existent ISO", () => {
    expect(getPrefectureByISOAllLangs("JP-99")).toBeUndefined();
  });
});

describe("getPrefectureByLGCodeAllLangs", () => {
  it("returns prefecture with all languages", () => {
    const tokyo = getPrefectureByLGCodeAllLangs("130001");
    expect(tokyo).toBeDefined();
    expect(tokyo?.code).toBe("13");
    expect(tokyo?.name.ja).toBe("東京都");
    expect(tokyo?.name.en).toBe("Tokyo");
  });

  it("returns undefined for non-existent lgCode", () => {
    expect(getPrefectureByLGCodeAllLangs("999999")).toBeUndefined();
  });
});

describe("getPrefectureByName", () => {
  it("matches Japanese full name", () => {
    const tokyo = getPrefectureByName("東京都");
    expect(tokyo).toBeDefined();
    expect(tokyo?.code).toBe("13");
    expect(tokyo?.name).toBe("東京都");
  });

  it("matches Japanese short name", () => {
    const tokyo = getPrefectureByName("東京");
    expect(tokyo?.code).toBe("13");
    const osaka = getPrefectureByName("大阪");
    expect(osaka?.code).toBe("27");
  });

  it("matches English name", () => {
    const tokyo = getPrefectureByName("Tokyo");
    expect(tokyo?.code).toBe("13");
  });

  it("is case-insensitive for English", () => {
    expect(getPrefectureByName("tokyo")?.code).toBe("13");
    expect(getPrefectureByName("TOKYO")?.code).toBe("13");
    expect(getPrefectureByName("osaka")?.code).toBe("27");
  });

  it("matches Korean name", () => {
    const tokyo = getPrefectureByName("도쿄도");
    expect(tokyo?.code).toBe("13");
  });

  it("matches hiragana name", () => {
    const tokyo = getPrefectureByName("とうきょうと");
    expect(tokyo?.code).toBe("13");
  });

  it("matches hiragana short name", () => {
    const tokyo = getPrefectureByName("とうきょう");
    expect(tokyo?.code).toBe("13");
  });

  it("returns undefined for unknown name", () => {
    expect(getPrefectureByName("存在しない県")).toBeUndefined();
    expect(getPrefectureByName("Unknown")).toBeUndefined();
  });

  it("returns output in specified lang", () => {
    const tokyo = getPrefectureByName("Tokyo", "ja");
    expect(tokyo?.name).toBe("東京都");
    const osaka = getPrefectureByName("大阪府", "en");
    expect(osaka?.name).toBe("Osaka");
  });

  it("supports short option", () => {
    const tokyo = getPrefectureByName("東京都", "ja", { short: true });
    expect(tokyo?.name).toBe("東京");
  });

  it("preserves code/iso/lgCode fields", () => {
    const tokyo = getPrefectureByName("東京都");
    expect(tokyo?.code).toBe("13");
    expect(tokyo?.iso).toBe("JP-13");
    expect(tokyo?.lgCode).toBe("130001");
  });
});

describe("getPrefectureByNameAllLangs", () => {
  it("returns prefecture with all 10 languages", () => {
    const tokyo = getPrefectureByNameAllLangs("東京都");
    expect(tokyo).toBeDefined();
    expect(tokyo?.code).toBe("13");
    expect(tokyo?.name.ja).toBe("東京都");
    expect(tokyo?.name.en).toBe("Tokyo");
    expect(tokyo?.name.ko).toBe("도쿄도");
  });

  it("matches English name and returns all languages", () => {
    const tokyo = getPrefectureByNameAllLangs("Tokyo");
    expect(tokyo?.name.ja).toBe("東京都");
    expect(tokyo?.name["zh-CN"]).toBeTruthy();
  });

  it("matches short name", () => {
    const osaka = getPrefectureByNameAllLangs("大阪");
    expect(osaka?.code).toBe("27");
  });

  it("supports short option", () => {
    const tokyo = getPrefectureByNameAllLangs("東京都", { short: true });
    expect(tokyo?.name.ja).toBe("東京");
    expect(tokyo?.name.en).toBe("Tokyo");
  });

  it("returns undefined for unknown name", () => {
    expect(getPrefectureByNameAllLangs("Unknown")).toBeUndefined();
  });
});

describe("short option (prefectures)", () => {
  it("strips Japanese suffixes", () => {
    const prefs = getPrefectures("ja", { short: true });
    const tokyo = prefs.find((p) => p.code === "13");
    const hokkaido = prefs.find((p) => p.code === "01");
    const osaka = prefs.find((p) => p.code === "27");
    const aomori = prefs.find((p) => p.code === "02");
    expect(tokyo?.name).toBe("東京");
    expect(hokkaido?.name).toBe("北海");
    expect(osaka?.name).toBe("大阪");
    expect(aomori?.name).toBe("青森");
  });

  it("is no-op for English (already suffix-free)", () => {
    const prefs = getPrefectures("en", { short: true });
    const tokyo = prefs.find((p) => p.code === "13");
    expect(tokyo?.name).toBe("Tokyo");
  });

  it("strips zh-CN suffixes", () => {
    const tokyo = getPrefectureByCode("13", "zh-CN", { short: true });
    expect(tokyo?.name).toBe("东京");
    const aomori = getPrefectureByCode("02", "zh-CN", { short: true });
    expect(aomori?.name).toBe("青森");
  });

  it("strips Korean suffixes", () => {
    const tokyo = getPrefectureByISO("JP-13", "ko", { short: true });
    expect(tokyo?.name).toBe("도쿄");
    const osaka = getPrefectureByLGCode("270008", "ko", { short: true });
    expect(osaka?.name).toBe("오사카");
    const aomori = getPrefectureByCode("02", "ko", { short: true });
    expect(aomori?.name).toBe("아오모리");
  });

  it("does not modify name when short is omitted", () => {
    const tokyo = getPrefectureByCode("13", "ja");
    expect(tokyo?.name).toBe("東京都");
  });

  it("strips all languages in AllLangs", () => {
    const tokyo = getPrefectureByCodeAllLangs("13", { short: true });
    expect(tokyo?.name.ja).toBe("東京");
    expect(tokyo?.name.en).toBe("Tokyo");
    expect(tokyo?.name["zh-CN"]).toBe("东京");
    expect(tokyo?.name["zh-TW"]).toBe("東京");
    expect(tokyo?.name.ko).toBe("도쿄");
  });

  it("strips in getPrefecturesAllLangs", () => {
    const all = getPrefecturesAllLangs({ short: true });
    const aomori = all.find((p) => p.code === "02");
    expect(aomori?.name.ja).toBe("青森");
    expect(aomori?.name["zh-CN"]).toBe("青森");
    expect(aomori?.name["zh-TW"]).toBe("青森");
    expect(aomori?.name.ko).toBe("아오모리");
  });

  it("strips hiragana suffixes", () => {
    const tokyo = getPrefectureByCode("13", "ja-Hira", { short: true });
    expect(tokyo?.name).toBe("とうきょう");
    const osaka = getPrefectureByCode("27", "ja-Hira", { short: true });
    expect(osaka?.name).toBe("おおさか");
    const hokkaido = getPrefectureByCode("01", "ja-Hira", { short: true });
    expect(hokkaido?.name).toBe("ほっかい");
    const aomori = getPrefectureByCode("02", "ja-Hira", { short: true });
    expect(aomori?.name).toBe("あおもり");
  });

  it("strips katakana suffixes", () => {
    const tokyo = getPrefectureByCode("13", "ja-Kana", { short: true });
    expect(tokyo?.name).toBe("トウキョウ");
    const osaka = getPrefectureByCode("27", "ja-Kana", { short: true });
    expect(osaka?.name).toBe("オオサカ");
    const aomori = getPrefectureByCode("02", "ja-Kana", { short: true });
    expect(aomori?.name).toBe("アオモリ");
  });

  it("strips half-width kana suffixes", () => {
    const tokyo = getPrefectureByCode("13", "ja-HW", { short: true });
    expect(tokyo?.name).toBe("ﾄｳｷｮｳ");
    const osaka = getPrefectureByCode("27", "ja-HW", { short: true });
    expect(osaka?.name).toBe("ｵｵｻｶ");
    const aomori = getPrefectureByCode("02", "ja-HW", { short: true });
    expect(aomori?.name).toBe("ｱｵﾓﾘ");
  });

  it("strips kana in AllLangs", () => {
    const tokyo = getPrefectureByCodeAllLangs("13", { short: true });
    expect(tokyo?.name["ja-Hira"]).toBe("とうきょう");
    expect(tokyo?.name["ja-Kana"]).toBe("トウキョウ");
    expect(tokyo?.name["ja-HW"]).toBe("ﾄｳｷｮｳ");
  });
});
