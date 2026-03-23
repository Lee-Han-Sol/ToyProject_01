import { AppDataSource } from "../../infra/db/data-source";
import { Site } from "./site.entity";
import { CreateSiteRequestDto } from "./dto/create-site.request.dto";
import { GetSitesQueryDto } from "./dto/get-sites.query.dto";
import { SiteResponseDto } from "./dto/site.response.dto";

// Site 관련 비즈니스 로직 처리
export class SiteService {
    private siteRepository = AppDataSource.getRepository(Site);

    // 현장 생성
    async createSite(data: CreateSiteRequestDto): Promise<SiteResponseDto> {
        const site = this.siteRepository.create({
            name: data.name,
            location: data.location,
        });

        const saved = await this.siteRepository.save(site);

        return this.toSiteResponseDto(saved);
    }

    // 현장 목록 조회
    async getSites(query: GetSitesQueryDto = {}) {
        const page = Math.max(query.page ?? 1, 1);
        const limit = Math.min(Math.max(query.limit ?? 10, 1), 100);
        const skip = (page - 1) * limit;

        const [data, total] = await this.siteRepository.findAndCount({
            order: {
                createdAt: "DESC",
            },
            skip,
            take: limit,
        });

        return {
            data: data.map((site) => this.toSiteResponseDto(site)),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Entity -> Response DTO 변환
    private toSiteResponseDto(site: Site): SiteResponseDto {
        return {
            id: site.id,
            name: site.name,
            location: site.location,
            createdAt: site.createdAt,
            updatedAt: site.updatedAt,
            deletedAt: site.deletedAt,
        };
    }
}