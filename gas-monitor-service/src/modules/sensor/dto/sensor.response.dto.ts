// 센서 응답 DTO
export interface SensorResponseDto {
    id: number;
    siteId: number;
    name: string;
    type: string;
    installLocation: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}