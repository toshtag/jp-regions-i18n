import { describe, expect, it } from "vitest";
import {
  getPrefectureByCode,
  getPrefectureByCodeAllLangs,
  getPrefectureByISO,
  getPrefectureByISOAllLangs,
  getPrefectureByLGCode,
  getPrefectureByLGCodeAllLangs,
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

  it("includes all 7 languages in name", () => {
    const prefs = getPrefecturesAllLangs();
    const langs = ["ja", "en", "zh-CN", "zh-TW", "ko", "pt", "vi"] as const;
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
});
