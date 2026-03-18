import { FastifyInstance } from "fastify";
import { GasReadingController } from "./gas-reading.controller";
import {
    createGasReadingSwaggerSchema,
    getGasReadingsSwaggerSchema,
} from "./schema/gas-reading.schema";

// GasReading 라우트 정의
export async function gasReadingRoutes(fastify: FastifyInstance) {
    const controller = new GasReadingController();

    // 가스 데이터 생성
    // POST /sensors/:sensorId/readings
    fastify.post(
        "/",
        {
            schema: createGasReadingSwaggerSchema,
        },
        controller.createReading.bind(controller)
    );

    // 가스 데이터 조회
    // GET /sensors/:sensorId/readings
    fastify.get(
        "/",
        {
            schema: getGasReadingsSwaggerSchema,
        },
        controller.getReadings.bind(controller)
    );
}