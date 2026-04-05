import { describe, expect, it } from "vitest";
import {
  getCities,
  getCitiesAllLangs,
  getCitiesAllLangsByPrefName,
  getCitiesByPrefName,
  getCityByJisCode,
  getCityByJisCodeAllLangs,
  getCityByLGCode,
  getCityByLGCodeAllLangs,
} from "../src/index.js";

describe("getCities (Japanese scripts)", () => {
  it("returns hiragana names", () => {
    const chiyoda = getCityByJisCode("13101", "ja-Hira");
    expect(chiyoda?.name).toBe("ちよだく");
    const sapporo = getCityByJisCode("01100", "ja-Hira");
    expect(sapporo?.name).toBe("さっぽろし");
    const tobetsu = getCityByJisCode("01303", "ja-Hira");
    expect(tobetsu?.name).toBe("とうべつちょう");
    const shinshinotsu = getCityByJisCode("01304", "ja-Hira");
    expect(shinshinotsu?.name).toBe("しんしのつむら");
  });

  it("returns katakana names", () => {
    const chiyoda = getCityByJisCode("13101", "ja-Kana");
    expect(chiyoda?.name).toBe("チヨダク");
    const sapporo = getCityByJisCode("01100", "ja-Kana");
    expect(sapporo?.name).toBe("サッポロシ");
  });

  it("returns half-width kana names", () => {
    const chiyoda = getCityByJisCode("13101", "ja-HW");
    expect(chiyoda?.name).toBe("ﾁﾖﾀﾞｸ");
    const sapporo = getCityByJisCode("01100", "ja-HW");
    expect(sapporo?.name).toBe("ｻｯﾎﾟﾛｼ");
  });
});

describe("getCities", () => {
  it("filters cities by prefecture code", () => {
    const tokyoCities = getCities("13");
    expect(tokyoCities.length).toBeGreaterThan(0);
    for (const c of tokyoCities) {
      expect(c.prefCode).toBe("13");
    }
  });

  it("returns empty array for non-existent prefecture", () => {
    expect(getCities("99")).toEqual([]);
  });

  it("filters by type", () => {
    const specialWards = getCities("13", "ja", { type: "special_ward" });
    expect(specialWards).toHaveLength(23);
    for (const w of specialWards) {
      expect(w.type).toBe("special_ward");
    }
  });

  it("filters by parentJisCode for designated city wards", () => {
    const sapporoWards = getCities("01", "ja", { parentJisCode: "01100" });
    expect(sapporoWards).toHaveLength(10);
    for (const w of sapporoWards) {
      expect(w.parentJisCode).toBe("01100");
      expect(w.type).toBe("ward");
    }
  });

  it("returns English names when specified", () => {
    const cities = getCities("13", "en", { type: "special_ward" });
    const chiyoda = cities.find((c) => c.jisCode === "13101");
    expect(chiyoda?.name).toBe("Chiyoda-ku");
  });
});

describe("getCityByJisCode", () => {
  it("returns correct city for valid code", () => {
    const chiyoda = getCityByJisCode("13101");
    expect(chiyoda).toBeDefined();
    expect(chiyoda?.jisCode).toBe("13101");
    expect(chiyoda?.prefCode).toBe("13");
    expect(chiyoda?.type).toBe("special_ward");
    expect(chiyoda?.name).toBe("千代田区");
  });

  it("returns designated city", () => {
    const sapporo = getCityByJisCode("01100");
    expect(sapporo).toBeDefined();
    expect(sapporo?.type).toBe("designated_city");
    expect(sapporo?.parentJisCode).toBeNull();
  });

  it("returns ward with parentJisCode", () => {
    const chuo = getCityByJisCode("01101");
    expect(chuo).toBeDefined();
    expect(chuo?.type).toBe("ward");
    expect(chuo?.parentJisCode).toBe("01100");
  });

  it("returns undefined for non-existent code", () => {
    expect(getCityByJisCode("99999")).toBeUndefined();
  });
});

describe("getCityByLGCode", () => {
  it("returns correct city for valid 6-digit code", () => {
    const chiyoda = getCityByLGCode("131016");
    expect(chiyoda).toBeDefined();
    expect(chiyoda?.jisCode).toBe("13101");
    expect(chiyoda?.name).toBe("千代田区");
  });

  it("returns Korean name when specified", () => {
    const chiyoda = getCityByLGCode("131016", "ko");
    expect(chiyoda?.name).toBe("지요다구");
  });

  it("returns undefined for non-existent lgCode", () => {
    expect(getCityByLGCode("999999")).toBeUndefined();
  });
});

describe("getCitiesAllLangs", () => {
  it("returns cities with all 10 languages", () => {
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
    const cities = getCitiesAllLangs("13");
    expect(cities.length).toBeGreaterThan(0);
    for (const c of cities) {
      for (const lang of langs) {
        expect(c.name[lang]).toBeTruthy();
      }
    }
  });

  it("returns correct prefCode for all cities", () => {
    const cities = getCitiesAllLangs("13");
    for (const c of cities) {
      expect(c.prefCode).toBe("13");
    }
  });

  it("supports type filter", () => {
    const wards = getCitiesAllLangs("13", { type: "special_ward" });
    expect(wards).toHaveLength(23);
    for (const w of wards) {
      expect(w.type).toBe("special_ward");
    }
  });

  it("supports parentJisCode filter", () => {
    const sapporoWards = getCitiesAllLangs("01", { parentJisCode: "01100" });
    expect(sapporoWards).toHaveLength(10);
    for (const w of sapporoWards) {
      expect(w.parentJisCode).toBe("01100");
    }
  });

  it("returns empty array for non-existent prefecture", () => {
    expect(getCitiesAllLangs("99")).toEqual([]);
  });
});

describe("getCityByJisCodeAllLangs", () => {
  it("returns city with all languages", () => {
    const chiyoda = getCityByJisCodeAllLangs("13101");
    expect(chiyoda).toBeDefined();
    expect(chiyoda?.jisCode).toBe("13101");
    expect(chiyoda?.prefCode).toBe("13");
    expect(chiyoda?.type).toBe("special_ward");
    expect(chiyoda?.name.ja).toBe("千代田区");
    expect(chiyoda?.name.en).toBeTruthy();
  });

  it("returns correct parentJisCode", () => {
    const chuo = getCityByJisCodeAllLangs("01101");
    expect(chuo?.parentJisCode).toBe("01100");
  });

  it("returns undefined for non-existent jisCode", () => {
    expect(getCityByJisCodeAllLangs("99999")).toBeUndefined();
  });
});

describe("getCityByLGCodeAllLangs", () => {
  it("returns city with all languages", () => {
    const chiyoda = getCityByLGCodeAllLangs("131016");
    expect(chiyoda).toBeDefined();
    expect(chiyoda?.jisCode).toBe("13101");
    expect(chiyoda?.name.ja).toBe("千代田区");
    expect(chiyoda?.name.en).toBeTruthy();
    expect(chiyoda?.name.ko).toBeTruthy();
  });

  it("returns undefined for non-existent lgCode", () => {
    expect(getCityByLGCodeAllLangs("999999")).toBeUndefined();
  });
});

describe("getCitiesByPrefName", () => {
  it("returns cities for Japanese full name", () => {
    const cities = getCitiesByPrefName("東京都");
    expect(cities.length).toBeGreaterThan(0);
    for (const c of cities) {
      expect(c.prefCode).toBe("13");
    }
  });

  it("returns cities for Japanese short name", () => {
    const cities = getCitiesByPrefName("東京");
    expect(cities.length).toBeGreaterThan(0);
    for (const c of cities) {
      expect(c.prefCode).toBe("13");
    }
  });

  it("returns cities for English name", () => {
    const cities = getCitiesByPrefName("Tokyo");
    expect(cities.length).toBeGreaterThan(0);
    for (const c of cities) {
      expect(c.prefCode).toBe("13");
    }
  });

  it("is case-insensitive for English", () => {
    const cities = getCitiesByPrefName("tokyo");
    expect(cities.length).toBeGreaterThan(0);
  });

  it("returns English city names when lang is specified", () => {
    const cities = getCitiesByPrefName("東京", "en", { type: "special_ward" });
    expect(cities).toHaveLength(23);
    const chiyoda = cities.find((c) => c.jisCode === "13101");
    expect(chiyoda?.name).toBe("Chiyoda-ku");
  });

  it("supports type filter", () => {
    const wards = getCitiesByPrefName("東京都", "ja", { type: "special_ward" });
    expect(wards).toHaveLength(23);
    for (const w of wards) {
      expect(w.type).toBe("special_ward");
    }
  });

  it("returns empty array for unknown prefecture name", () => {
    expect(getCitiesByPrefName("存在しない県")).toEqual([]);
    expect(getCitiesByPrefName("Unknown")).toEqual([]);
  });

  it("returns cities for Osaka by name", () => {
    const cities = getCitiesByPrefName("大阪府");
    expect(cities.length).toBeGreaterThan(0);
    for (const c of cities) {
      expect(c.prefCode).toBe("27");
    }
  });
});

describe("getCitiesAllLangsByPrefName", () => {
  it("returns cities with all 10 languages for Japanese name", () => {
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
    const cities = getCitiesAllLangsByPrefName("東京都");
    expect(cities.length).toBeGreaterThan(0);
    for (const c of cities) {
      for (const lang of langs) {
        expect(c.name[lang]).toBeTruthy();
      }
    }
  });

  it("matches English name", () => {
    const cities = getCitiesAllLangsByPrefName("Tokyo");
    expect(cities.length).toBeGreaterThan(0);
    for (const c of cities) {
      expect(c.prefCode).toBe("13");
    }
  });

  it("supports type filter", () => {
    const wards = getCitiesAllLangsByPrefName("東京都", { type: "special_ward" });
    expect(wards).toHaveLength(23);
  });

  it("returns empty array for unknown prefecture name", () => {
    expect(getCitiesAllLangsByPrefName("Unknown")).toEqual([]);
  });
});

describe("short option (cities)", () => {
  it("strips Japanese city suffixes", () => {
    const chiyoda = getCityByJisCode("13101", "ja", { short: true });
    expect(chiyoda?.name).toBe("千代田");

    const sapporo = getCityByJisCode("01100", "ja", { short: true });
    expect(sapporo?.name).toBe("札幌");

    const tobetsu = getCityByJisCode("01303", "ja", { short: true });
    expect(tobetsu?.name).toBe("当別");

    const shinshinotsu = getCityByJisCode("01304", "ja", { short: true });
    expect(shinshinotsu?.name).toBe("新篠津");
  });

  it("strips English city suffixes", () => {
    const chiyoda = getCityByJisCode("13101", "en", { short: true });
    expect(chiyoda?.name).toBe("Chiyoda");

    const sapporo = getCityByJisCode("01100", "en", { short: true });
    expect(sapporo?.name).toBe("Sapporo");

    const tobetsu = getCityByJisCode("01303", "en", { short: true });
    expect(tobetsu?.name).toBe("Tobetsu");

    const shinshinotsu = getCityByJisCode("01304", "en", { short: true });
    expect(shinshinotsu?.name).toBe("Shinshinotsu");
  });

  it("strips Korean city suffixes", () => {
    const chiyoda = getCityByLGCode("131016", "ko", { short: true });
    expect(chiyoda?.name).toBe("지요다");

    const shinshinotsu = getCityByJisCode("01304", "ko", { short: true });
    expect(shinshinotsu?.name).toBe("신시노쓰");
  });

  it("does not modify name when short is omitted", () => {
    const chiyoda = getCityByJisCode("13101", "ja");
    expect(chiyoda?.name).toBe("千代田区");
  });

  it("supports short in getCities", () => {
    const wards = getCities("13", "ja", { type: "special_ward", short: true });
    for (const w of wards) {
      expect(w.name).not.toMatch(/区$/);
    }
  });

  it("strips all languages in AllLangs", () => {
    const chiyoda = getCityByJisCodeAllLangs("13101", { short: true });
    expect(chiyoda?.name.ja).toBe("千代田");
    expect(chiyoda?.name.en).toBe("Chiyoda");
    expect(chiyoda?.name["zh-CN"]).toBe("千代田");
    expect(chiyoda?.name["zh-TW"]).toBe("千代田");
    expect(chiyoda?.name.ko).toBe("지요다");
  });

  it("strips in getCitiesAllLangs", () => {
    const wards = getCitiesAllLangs("13", { type: "special_ward", short: true });
    expect(wards).toHaveLength(23);
    for (const w of wards) {
      expect(w.name.ja).not.toMatch(/区$/);
      expect(w.name.en).not.toMatch(/-ku$/);
    }
  });

  it("strips in getCityByLGCodeAllLangs", () => {
    const chiyoda = getCityByLGCodeAllLangs("131016", { short: true });
    expect(chiyoda?.name.ja).toBe("千代田");
    expect(chiyoda?.name.en).toBe("Chiyoda");
  });

  it("strips hiragana city suffixes", () => {
    const chiyoda = getCityByJisCode("13101", "ja-Hira", { short: true });
    expect(chiyoda?.name).toBe("ちよだ");
    const sapporo = getCityByJisCode("01100", "ja-Hira", { short: true });
    expect(sapporo?.name).toBe("さっぽろ");
    const tobetsu = getCityByJisCode("01303", "ja-Hira", { short: true });
    expect(tobetsu?.name).toBe("とうべつ");
    const shinshinotsu = getCityByJisCode("01304", "ja-Hira", { short: true });
    expect(shinshinotsu?.name).toBe("しんしのつ");
  });

  it("strips katakana city suffixes", () => {
    const chiyoda = getCityByJisCode("13101", "ja-Kana", { short: true });
    expect(chiyoda?.name).toBe("チヨダ");
    const sapporo = getCityByJisCode("01100", "ja-Kana", { short: true });
    expect(sapporo?.name).toBe("サッポロ");
  });

  it("strips half-width kana city suffixes", () => {
    const chiyoda = getCityByJisCode("13101", "ja-HW", { short: true });
    expect(chiyoda?.name).toBe("ﾁﾖﾀﾞ");
    const sapporo = getCityByJisCode("01100", "ja-HW", { short: true });
    expect(sapporo?.name).toBe("ｻｯﾎﾟﾛ");
  });

  it("strips kana in AllLangs", () => {
    const chiyoda = getCityByJisCodeAllLangs("13101", { short: true });
    expect(chiyoda?.name["ja-Hira"]).toBe("ちよだ");
    expect(chiyoda?.name["ja-Kana"]).toBe("チヨダ");
    expect(chiyoda?.name["ja-HW"]).toBe("ﾁﾖﾀﾞ");
  });
});
