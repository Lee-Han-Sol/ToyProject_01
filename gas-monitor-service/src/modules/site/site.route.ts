import { FastifyInstance } from "fastify";
import { SiteController } from "./site.controller";

// Site 라우트 정의
export async function siteRoutes(fastify: FastifyInstance) {
    // 컨트롤러 인스턴스 생성
    const controller = new SiteController();

    // 현장 생성
    // POST /sites
    fastify.post("/", controller.createSite.bind(controller));

    // 현장 목록 조회
    // GET /sites
    fastify.get("/", controller.getSites.bind(controller));
}