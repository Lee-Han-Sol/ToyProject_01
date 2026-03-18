import { FastifyInstance } from "fastify";
import { SensorController } from "./sensor.controller";
import { createSensorSwaggerSchema } from "./schema/sensor.schema";

// Sensor 라우트 정의
export async function sensorRoutes(fastify: FastifyInstance) {
    const controller = new SensorController();

    // 센서 생성
    // POST /sites/:siteId/sensors
    fastify.post(
        "/",
        {
            schema: createSensorSwaggerSchema,
        },
        controller.createSensor.bind(controller)
    );
}