import { FastifyReply, FastifyRequest } from "fastify";
import { SiteService } from "./site.service";

// Site 관련 HTTP 요청 처리 Controller
export class SiteController {
    // Site 서비스 인스턴스
    private siteService = new SiteService();

    // 현장 생성 API
    async createSite(
        request: FastifyRequest<{
            Body: {
                name: string; // 현장 이름
                location: string; // 현장 위치
            };
        }>,
        reply: FastifyReply
    ) {
        try {
            // 요청 데이터 추출
            const data = request.body;

            // 서비스 호출 (현장 생성)
            const result = await this.siteService.createSite(data);

            // 성공 응답 반환
            return reply.code(201).send(result);
        } catch (error: any) {
            // 에러 로그 출력
            request.log.error(error);

            // 에러 응답 반환
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
            // query는 string으로 들어옴 → number 변환
            const page = request.query.page
                ? Number(request.query.page)
                : undefined;

            const limit = request.query.limit
                ? Number(request.query.limit)
                : undefined;

            const result = await this.siteService.getSites({
                page,
                limit,
            });

            return reply.send(result);
        } catch (error: any) {
            request.log.error(error);

            return reply.code(500).send({
                message: "Site 조회 실패",
            });
        }
    }
}