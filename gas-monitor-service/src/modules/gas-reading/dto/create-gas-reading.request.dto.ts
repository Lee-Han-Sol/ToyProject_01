// 가스 측정값 생성 요청 DTO
export interface CreateGasReadingRequestDto {
    gasType: string;
    value: number;
    unit: string;
}