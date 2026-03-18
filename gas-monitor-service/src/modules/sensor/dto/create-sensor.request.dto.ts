// 센서 생성 요청 DTO
export interface CreateSensorRequestDto {
    name: string;
    type: string;
    installLocation?: string;
}