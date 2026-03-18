import { FastifyInstance } from "fastify";
import { GasReadingController } from "./gas-reading.controller";

// GasReading 라우트 정의
export async function gasReadingRoutes(fastify: FastifyInstance) {
    // 컨트롤러 생성
    const controller = new GasReadingController();

    // 가스 데이터 생성
    // POST /sensors/:sensorId/readings
    fastify.post("/", controller.createReading.bind(controller));

    // 가스 데이터 조회
    // GET /sensors/:sensorId/readings
    fastify.get("/", controller.getReadings.bind(controller));
}