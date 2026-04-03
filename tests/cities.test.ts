import { describe, expect, it } from "vitest";
import { getCities, getCityByJisCode, getCityByLGCode } from "../src/index.js";

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
