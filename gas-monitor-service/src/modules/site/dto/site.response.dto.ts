// 현장 응답 DTO
export interface SiteResponseDto {
    id: number;
    name: string;
    location: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}