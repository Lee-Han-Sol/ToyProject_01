import { FastifyReply, FastifyRequest } from "fastify";
import { CreateSiteRequestDto } from "./dto/create-site.request.dto";
import { GetSitesQueryDto } from "./dto/get-sites.query.dto";
import { SiteService } from "./site.service";

// Site 관련 HTTP 요청 처리 Controller
export class SiteController {
    private siteService = new SiteService();

    // 현장 생성 API
    async createSite(
        request: FastifyRequest<{
            Body: CreateSiteRequestDto;
        }>,
        reply: FastifyReply
    ) {
        try {
            const dto = request.body;
            const result = await this.siteService.createSite(dto);
            return reply.code(201).send(result);
        } catch (error: any) {
            request.log.error(error);

            return reply.code(400).send({
                message: error.message || "Site 생성 실패",
            });
        }
    }

    // 현장 목록 조회 API
    async getSites(
        request: FastifyRequest<{
            Querystring: {
                page?: string;
                limit?: string;
            };
        }>,
        reply: FastifyReply
    ) {
        try {
            const query: GetSitesQueryDto = {
                page: request.query.page ? Number(request.query.page) : undefined,
                limit: request.query.limit ? Number(request.query.limit) : undefined,
            };

            const result = await this.siteService.getSites(query);
            return reply.send(result);
        } catch (error: any) {
            request.log.error(error);

            return reply.code(500).send({
                message: "Site 조회 실패",
            });
        }
    }
}