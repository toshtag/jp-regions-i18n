import { describe, expect, it } from "vitest";
import {
  getCities,
  getCitiesByPrefName,
  getCityByJisCode,
  getCityByLGCode,
  getPrefectureByCode,
  getPrefectureByISO,
  getPrefectureByLGCode,
  getPrefectureByName,
  getPrefectures,
} from "../src/en.js";
import {
  getCities as getCitiesJa,
  getCityByJisCode as getCityByJisCodeJa,
  getPrefectureByCode as getPrefectureByCodeJa,
  getPrefectures as getPrefecturesJa,
} from "../src/ja.js";
import { getCities as getCitiesZhCN, getPrefectures as getPrefecturesZhCN } from "../src/zh-CN.js";

describe("jp-regions-i18n/en", () => {
  it("returns all 47 prefectures in English", () => {
    const prefs = getPrefectures();
    expect(prefs).toHaveLength(47);
    expect(prefs[0].name).toBe("Hokkaido");
    expect(prefs[12].name).toBe("Tokyo");
  });

  it("short option strips suffix", () => {
    const prefs = getPrefectures({ short: true });
    const tokyo = prefs.find((p) => p.code === "13");
    expect(tokyo?.name).toBe("Tokyo");
  });

  it("getPrefectureByCode returns correct prefecture", () => {
    const pref = getPrefectureByCode("13");
    expect(pref?.name).toBe("Tokyo");
    expect(pref?.iso).toBe("JP-13");
  });

  it("getPrefectureByISO returns correct prefecture", () => {
    const pref = getPrefectureByISO("JP-01");
    expect(pref?.name).toBe("Hokkaido");
  });

  it("getPrefectureByLGCode returns correct prefecture", () => {
    const pref = getPrefectureByLGCode("010006");
    expect(pref?.name).toBe("Hokkaido");
  });

  it("getPrefectureByName finds by English name", () => {
    const pref = getPrefectureByName("Osaka");
    expect(pref?.code).toBe("27");
  });

  it("getCities returns cities for prefecture", () => {
    const cities = getCities("13");
    expect(cities.length).toBeGreaterThan(0);
    expect(cities[0].prefCode).toBe("13");
  });

  it("getCities filters by type", () => {
    const cities = getCities("13", { type: "special_ward" });
    expect(cities.every((c) => c.type === "special_ward")).toBe(true);
  });

  it("getCityByJisCode returns correct city", () => {
    const city = getCityByJisCode("13101");
    expect(city?.name).toBe("Chiyoda-ku");
  });

  it("getCityByLGCode returns correct city", () => {
    const city = getCityByLGCode("131016");
    expect(city?.name).toBe("Chiyoda-ku");
  });

  it("getCitiesByPrefName returns cities for prefecture name", () => {
    const cities = getCitiesByPrefName("Tokyo");
    expect(cities.length).toBeGreaterThan(0);
  });

  describe("macrons option", () => {
    it("getPrefectures with macrons: 行政区分サフィックスを除いた長音表記", () => {
      const prefs = getPrefectures({ macrons: true });
      // 東京都: とうきょう + と(都) → Tōkyō
      expect(prefs.find((p) => p.code === "13")?.name).toBe("Tōkyō");
      // 大阪府: おおさか + ふ(府) → Ōsaka
      expect(prefs.find((p) => p.code === "27")?.name).toBe("Ōsaka");
      // 京都府: きょうと + ふ → Kyōto
      expect(prefs.find((p) => p.code === "26")?.name).toBe("Kyōto");
      // 兵庫県: ひょうご + けん → Hyōgo
      expect(prefs.find((p) => p.code === "28")?.name).toBe("Hyōgo");
      // 高知県: こうち + けん → Kōchi
      expect(prefs.find((p) => p.code === "39")?.name).toBe("Kōchi");
      // 大分県: おおいた + けん → Ōita
      expect(prefs.find((p) => p.code === "44")?.name).toBe("Ōita");
    });

    it("getPrefectures without macrons stays unchanged", () => {
      const prefs = getPrefectures();
      expect(prefs.find((p) => p.code === "13")?.name).toBe("Tokyo");
    });

    it("getPrefectureByCode with macrons", () => {
      expect(getPrefectureByCode("27", { macrons: true })?.name).toBe("Ōsaka");
    });

    it("getCities with macrons: ハイフン付きサフィックスを維持", () => {
      const cities = getCities("01", { macrons: true });
      // 札幌市 (さっぽろし) → 長音なし、サフィックス維持
      expect(cities.find((c) => c.jisCode === "01100")?.name).toBe("Sapporo-shi");
      // 中央区 (ちゅうおうく) → Chūō-ku
      expect(cities.find((c) => c.jisCode === "01101")?.name).toBe("Chūō-ku");
    });

    it("getCityByJisCode with macrons", () => {
      // 大阪市 (おおさかし) → Ōsaka-shi
      expect(getCityByJisCode("27100", { macrons: true })?.name).toBe("Ōsaka-shi");
    });

    it("getCityByLGCode with macrons", () => {
      // lgCode = jisCode + lgSuffix = "27100" + "4" = "271004"
      expect(getCityByLGCode("271004", { macrons: true })?.name).toBe("Ōsaka-shi");
    });
  });
});

describe("jp-regions-i18n/ja", () => {
  it("returns all 47 prefectures in Japanese", () => {
    const prefs = getPrefecturesJa();
    expect(prefs).toHaveLength(47);
    expect(prefs[0].name).toBe("北海道");
  });

  it("short option strips suffix", () => {
    const prefs = getPrefecturesJa({ short: true });
    const tokyo = prefs.find((p) => p.code === "13");
    expect(tokyo?.name).toBe("東京");
  });

  it("getPrefectureByCode returns Japanese name", () => {
    const pref = getPrefectureByCodeJa("27");
    expect(pref?.name).toBe("大阪府");
  });

  it("getCities returns Japanese city names", () => {
    const cities = getCitiesJa("13");
    expect(cities.length).toBeGreaterThan(0);
    expect(cities[0].name).toMatch(/[ぁ-ん\u3041-\u9FFF]/);
  });

  it("getCityByJisCode returns Japanese city name", () => {
    const city = getCityByJisCodeJa("13101");
    expect(city?.name).toBe("千代田区");
  });
});

describe("jp-regions-i18n/zh-CN", () => {
  it("returns all 47 prefectures in Simplified Chinese", () => {
    const prefs = getPrefecturesZhCN();
    expect(prefs).toHaveLength(47);
    expect(prefs[0].name).toBe("北海道");
  });

  it("getCities returns Simplified Chinese city names", () => {
    const cities = getCitiesZhCN("01");
    expect(cities.length).toBeGreaterThan(0);
  });
});
