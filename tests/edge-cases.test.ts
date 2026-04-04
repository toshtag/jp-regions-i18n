import { describe, expect, it } from "vitest";
import { getPrefectureByCode, getSupportedLanguages } from "../src/index.js";

describe("language aliases", () => {
  it("resolves zh-Hans to zh-CN", () => {
    const pref = getPrefectureByCode("13", "zh-Hans");
    expect(pref?.name).toBe("东京都");
  });

  it("resolves zh-Hant to zh-TW", () => {
    const pref = getPrefectureByCode("13", "zh-Hant");
    expect(pref?.name).toBe("東京都");
  });

  it("resolves zh to zh-CN", () => {
    const pref = getPrefectureByCode("13", "zh");
    expect(pref?.name).toBe("东京都");
  });

  it("resolves cn to zh-CN", () => {
    const pref = getPrefectureByCode("13", "cn");
    expect(pref?.name).toBe("东京都");
  });

  it("resolves tw to zh-TW", () => {
    const pref = getPrefectureByCode("13", "tw");
    expect(pref?.name).toBe("東京都");
  });

  it("resolves hira to ja-Hira", () => {
    const pref = getPrefectureByCode("13", "hira");
    expect(pref?.name).toBe("とうきょうと");
  });

  it("resolves hiragana to ja-Hira", () => {
    const pref = getPrefectureByCode("13", "hiragana");
    expect(pref?.name).toBe("とうきょうと");
  });

  it("resolves kana to ja-Kana", () => {
    const pref = getPrefectureByCode("13", "kana");
    expect(pref?.name).toBe("トウキョウト");
  });

  it("resolves katakana to ja-Kana", () => {
    const pref = getPrefectureByCode("13", "katakana");
    expect(pref?.name).toBe("トウキョウト");
  });

  it("resolves hw to ja-HW", () => {
    const pref = getPrefectureByCode("13", "hw");
    expect(pref?.name).toBe("ﾄｳｷｮｳﾄ");
  });
});

describe("unsupported language fallback", () => {
  it("falls back to ja for unsupported language", () => {
    const pref = getPrefectureByCode("13", "fr");
    expect(pref?.name).toBe("東京都");
  });

  it("falls back to ja when lang is empty string", () => {
    const pref = getPrefectureByCode("13", "");
    expect(pref?.name).toBe("東京都");
  });
});

describe("getSupportedLanguages", () => {
  it("returns all 10 supported languages", () => {
    const langs = getSupportedLanguages();
    expect(langs).toHaveLength(10);
    expect(langs).toContain("ja");
    expect(langs).toContain("ja-Hira");
    expect(langs).toContain("ja-Kana");
    expect(langs).toContain("ja-HW");
    expect(langs).toContain("en");
    expect(langs).toContain("zh-CN");
    expect(langs).toContain("zh-TW");
    expect(langs).toContain("ko");
    expect(langs).toContain("pt");
    expect(langs).toContain("vi");
  });
});
