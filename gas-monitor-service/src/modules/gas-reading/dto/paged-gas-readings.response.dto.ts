import { GasReadingResponseDto } from "./gas-reading.response.dto";

// 페이징 응답 메타 DTO
export interface PaginationMetaDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// 가스 측정값 페이징 응답 DTO
export interface PagedGasReadingsResponseDto {
    data: GasReadingResponseDto[];
    meta: PaginationMetaDto;
}