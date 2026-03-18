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
}