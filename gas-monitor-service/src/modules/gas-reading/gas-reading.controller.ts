import { FastifyReply, FastifyRequest } from "fastify";
import { GasReadingService } from "./gas-reading.service";

// 가스 측정 데이터 관련 Controller
export class GasReadingController {
    // 서비스 인스턴스
    private gasReadingService = new GasReadingService();

    // 가스 측정값 생성 API
    async createReading(
        request: FastifyRequest<{
            Params: {
                sensorId: string; // 센서 ID (URL param)
            };
            Body: {
                gasType: string; // 가스 종류 (CH4, H2 등)
                value: number; // 측정값
                unit: string; // 단위 (ppm 등)
            };
        }>,
        reply: FastifyReply
    ) {
        try {
            // URL 파라미터 추출
            const { sensorId } = request.params;

            // Body 데이터 추출
            const data = request.body;

            // 서비스 호출 (가스 데이터 저장)
            const result = await this.gasReadingService.createReading({
                sensorId: Number(sensorId),
                ...data,
            });

            // 성공 응답 반환
            return reply.code(201).send(result);
        } catch (error: any) {
            // 에러 로그 출력
            request.log.error(error);

            // 에러 응답 반환
            return reply.code(400).send({
                message: error.message || "GasReading 생성 실패",
            });
        }
    }

    // 센서별 가스 데이터 조회 API
    async getReadings(
        request: FastifyRequest<{
            Params: { sensorId: string };
            Querystring: {
                page?: string;
                limit?: string;
            };
        }>,
        reply: FastifyReply
    ) {
        try {
            const { sensorId } = request.params;

            const page = request.query.page
                ? Number(request.query.page)
                : undefined;

            const limit = request.query.limit
                ? Number(request.query.limit)
                : undefined;

            const result = await this.gasReadingService.getReadings(
                Number(sensorId),
                { page, limit }
            );

            return reply.send(result);
        } catch (error: any) {
            request.log.error(error);

            return reply.code(500).send({
                message: "GasReading 조회 실패",
            });
        }
    }
}