import { describe, expect, it } from "vitest";
import { getPrefectureByCode, getPrefectureByISO, getPrefectures } from "../src/index.js";

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
