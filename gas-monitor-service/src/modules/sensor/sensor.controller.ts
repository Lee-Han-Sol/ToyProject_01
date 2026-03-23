import { FastifyReply, FastifyRequest } from "fastify";
import { SensorService } from "./sensor.service";
import { CreateSensorRequestDto } from "./dto/create-sensor.request.dto";

// 센서 관련 HTTP 요청을 처리하는 Controller
export class SensorController {
    private sensorService = new SensorService();

    // 센서 생성 API
    async createSensor(
        request: FastifyRequest<{
            Params: {
                siteId: string;
            };
            Body: CreateSensorRequestDto;
        }>,
        reply: FastifyReply
    ) {
        try {
            const { siteId } = request.params;
            const dto = request.body;

            const result = await this.sensorService.createSensor(
                Number(siteId),
                dto
            );

            return reply.code(201).send(result);
        } catch (error: any) {
            request.log.error(error);

            return reply.code(400).send({
                message: error.message || "Sensor 생성 실패",
            });
        }
    }
}