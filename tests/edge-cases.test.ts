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
  it("returns all 7 supported languages", () => {
    const langs = getSupportedLanguages();
    expect(langs).toHaveLength(7);
    expect(langs).toContain("ja");
    expect(langs).toContain("en");
    expect(langs).toContain("zh-CN");
    expect(langs).toContain("zh-TW");
    expect(langs).toContain("ko");
    expect(langs).toContain("pt");
    expect(langs).toContain("vi");
  });
});
