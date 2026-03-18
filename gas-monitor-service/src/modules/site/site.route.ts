import { FastifyInstance } from "fastify";
import { SiteService } from "./site.service";

const siteService = new SiteService();

// Site 관련 HTTP 라우트 등록
export async function siteRoutes(app: FastifyInstance) {
    // 현장 생성 API
    app.post("/sites", async (request, reply) => {
        const body = request.body as {
            name: string;
            location: string;
        };

        // 필수값 검증
        if (!body.name || !body.location) {
            return reply.status(400).send({
                message: "name and location are required",
            });
        }

        const site = await siteService.createSite(body);

        // 생성 성공
        return reply.status(201).send(site);
    });
}