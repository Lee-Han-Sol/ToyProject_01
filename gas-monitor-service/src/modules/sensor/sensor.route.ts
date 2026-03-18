import { FastifyInstance } from "fastify";
import { SensorController } from "./sensor.controller";

export async function sensorRoutes(fastify: FastifyInstance) {
    const controller = new SensorController();

    // 센서 생성
    fastify.post("/", controller.createSensor.bind(controller));
}