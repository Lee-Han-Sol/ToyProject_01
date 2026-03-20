import { describe, it, expect } from "vitest";
import { calculateGasRisk } from "./gas-risk.rule";

describe("calculateGasRisk", () => {
    it("CH4 값이 80% LEL 미만이면 NORMAL", () => {
        const r = calculateGasRisk("CH4", 3.9); // CH4 LEL=5.0 → 80%=4.0
        expect(r.level).toBe("NORMAL");
    });

    it("CH4 값이 80% LEL 이상이면 WARNING", () => {
        const r = calculateGasRisk("CH4", 4.0);
        expect(r.level).toBe("WARNING");
    });

    it("CH4 값이 LEL 이상이면 DANGER", () => {
        const r = calculateGasRisk("CH4", 5.0);
        expect(r.level).toBe("DANGER");
    });

    it("Unknown gasType이면 NORMAL 처리", () => {
        const r = calculateGasRisk("UNKNOWN", 999);
        expect(r.level).toBe("NORMAL");
    });
});