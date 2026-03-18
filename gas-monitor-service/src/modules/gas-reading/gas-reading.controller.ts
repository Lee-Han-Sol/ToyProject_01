import { FastifyReply, FastifyRequest } from "fastify";
import { GasReadingService } from "./gas-reading.service";
import { CreateGasReadingRequestDto } from "./dto/create-gas-reading.request.dto";
import { GetGasReadingsQueryDto } from "./dto/get-gas-readings.query.dto";

// 가스 측정 데이터 관련 Controller
export class GasReadingController {
    private gasReadingService = new GasReadingService();

    // 가스 측정값 생성 API
    async createReading(
        request: FastifyRequest<{
            Params: {
                sensorId: string;
            };
            Body: CreateGasReadingRequestDto;
        }>,
        reply: FastifyReply
    ) {
        try {
            const { sensorId } = request.params;
            const dto = request.body;

            const result = await this.gasReadingService.createReading(
                Number(sensorId),
                dto
            );

            return reply.code(201).send(result);
        } catch (error: any) {
            request.log.error(error);

            return reply.code(400).send({
                message: error.message || "GasReading 생성 실패",
            });
        }
    }

    // 센서별 가스 데이터 조회 API
    async getReadings(
        request: FastifyRequest<{
            Params: {
                sensorId: string;
            };
            Querystring: {
                page?: string;
                limit?: string;
            };
        }>,
        reply: FastifyReply
    ) {
        try {
            const { sensorId } = request.params;

            const query: GetGasReadingsQueryDto = {
                page: request.query.page ? Number(request.query.page) : undefined,
                limit: request.query.limit ? Number(request.query.limit) : undefined,
            };

            const result = await this.gasReadingService.getReadings(
                Number(sensorId),
                query
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