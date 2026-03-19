// 가스 위험도 계산 규칙
export type GasAlertLevel = "NORMAL" | "WARNING" | "DANGER";

type GasThreshold = {
    lel: number; // Lower Explosive Limit
};

// 4개 가스 기준
const GAS_THRESHOLDS: Record<string, GasThreshold> = {
    H2: { lel: 4.0 },
    CH4: { lel: 5.0 },
    C2H4: { lel: 2.7 },
    C2H2: { lel: 2.5 },
};

// 위험도 계산 결과
export interface GasRiskResult {
    level: GasAlertLevel;
    reason: string;
}

// 위험도 계산
export function calculateGasRisk(
    gasType: string,
    value: number
): GasRiskResult {
    const threshold = GAS_THRESHOLDS[gasType];

    // 기준 없는 가스는 일단 NORMAL 처리
    if (!threshold) {
        return {
            level: "NORMAL",
            reason: `Unknown gas type: ${gasType}`,
        };
    }

    const warningThreshold = threshold.lel * 0.8;
    const dangerThreshold = threshold.lel;

    if (value >= dangerThreshold) {
        return {
            level: "DANGER",
            reason: `${gasType} concentration reached or exceeded LEL (${threshold.lel})`,
        };
    }

    if (value >= warningThreshold) {
        return {
            level: "WARNING",
            reason: `${gasType} concentration reached 80% of LEL (${warningThreshold})`,
        };
    }

    return {
        level: "NORMAL",
        reason: `${gasType} concentration is within normal range`,
    };
}