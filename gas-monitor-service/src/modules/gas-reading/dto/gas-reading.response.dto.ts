// 가스 측정값 응답 DTO
export interface GasReadingResponseDto {
    id: number;
    sensorId: number;
    gasType: string;
    value: number;
    unit: string;
    createdAt: Date;
}