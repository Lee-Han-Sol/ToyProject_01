import { FastifyInstance } from "fastify";
import { SensorService } from "./sensor.service";

const sensorService = new SensorService();

// Sensor 관련 HTTP 라우트 등록
export async function sensorRoutes(app: FastifyInstance) {
    // 특정 Site에 센서 등록
    app.post("/sites/:siteId/sensors", async (request, reply) => {
        const params = request.params as { siteId: string };

        const body = request.body as {
            name: string;
            type: string;
            installLocation?: string;
        };

        // 필수값 검증
        if (!body.name || !body.type) {
            return reply.status(400).send({
                message: "name and type are required",
            });
        }

        const sensor = await sensorService.createSensor({
            siteId: Number(params.siteId),
            name: body.name,
            type: body.type,
            installLocation: body.installLocation,
        });

        return reply.status(201).send(sensor);
    });
}