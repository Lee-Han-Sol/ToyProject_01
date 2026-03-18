import { AppDataSource } from "../../infra/db/data-source";
import { Site } from "./site.entity";

// Site 관련 비즈니스 로직 처리
export class SiteService {
    private siteRepository = AppDataSource.getRepository(Site);

    // 현장 생성
    async createSite(data: { name: string; location: string }) {
        // 저장할 Entity 인스턴스 생성
        const site = this.siteRepository.create({
            name: data.name,
            location: data.location,
        });

        // DB 저장 후 결과 반환
        return await this.siteRepository.save(site);
    }

    // 현장 목록 조회
    async getSites(query?: { page?: number; limit?: number }) {
        // 기본값 설정
        const page = query?.page ?? 1;
        const limit = query?.limit ?? 10;

        // skip 계산
        const skip = (page - 1) * limit;

        // 데이터 조회
        const [data, total] = await this.siteRepository.findAndCount({
            order: {
                createdAt: "DESC",
            },
            skip,
            take: limit,
        });

        return {
            data, // 실제 데이터
            meta: {
                page,
                limit,
                total, // 전체 개수
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}