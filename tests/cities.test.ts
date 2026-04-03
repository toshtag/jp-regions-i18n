import { describe, expect, it } from "vitest";
import {
  getCities,
  getCitiesAllLangs,
  getCityByJisCode,
  getCityByJisCodeAllLangs,
  getCityByLGCode,
  getCityByLGCodeAllLangs,
} from "../src/index.js";

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
  it("returns cities with all 7 languages", () => {
    const langs = ["ja", "en", "zh-CN", "zh-TW", "ko", "pt", "vi"] as const;
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
