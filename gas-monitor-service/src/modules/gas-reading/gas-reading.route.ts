import { FastifyInstance } from "fastify";
import { GasReadingService } from "./gas-reading.service";

const gasReadingService = new GasReadingService();

// GasReading 관련 HTTP 라우트 등록
export async function gasReadingRoutes(app: FastifyInstance) {
    // 센서 측정값 수집 API
    app.post("/sensors/:sensorId/readings", async (request, reply) => {
        const params = request.params as { sensorId: string };

        const body = request.body as {
            gasType: string;
            value: number;
            unit: string;
        };

        // 필수값 검증
        if (!body.gasType || body.value === undefined || !body.unit) {
            return reply.status(400).send({
                message: "gasType, value and unit are required",
            });
        }

        const reading = await gasReadingService.createReading({
            sensorId: Number(params.sensorId),
            gasType: body.gasType,
            value: body.value,
            unit: body.unit,
        });

        return reply.status(201).send(reading);
    });
}