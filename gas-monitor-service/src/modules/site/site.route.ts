import { FastifyInstance } from "fastify";
import { SiteController } from "./site.controller";
import {
    createSiteSwaggerSchema,
    getSitesSwaggerSchema,
} from "./schema/site.schema";

// Site 라우트 정의
export async function siteRoutes(fastify: FastifyInstance) {
    const controller = new SiteController();

    // 현장 생성
    // POST /sites
    fastify.post(
        "/",
        {
            schema: createSiteSwaggerSchema,
        },
        controller.createSite.bind(controller)
    );

    // 현장 목록 조회
    // GET /sites
    fastify.get(
        "/",
        {
            schema: getSitesSwaggerSchema,
        },
        controller.getSites.bind(controller)
    );
}