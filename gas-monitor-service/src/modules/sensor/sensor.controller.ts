import { FastifyReply, FastifyRequest } from "fastify";
import { SensorService } from "./sensor.service";

// 센서 관련 HTTP 요청을 처리하는 Controller
export class SensorController {
    // 센서 서비스 인스턴스
    private sensorService = new SensorService();

    // 센서 생성 API
    async createSensor(
        request: FastifyRequest<{
            Body: {
                siteId: number; // 소속 현장 ID
                name: string; // 센서 이름
                type: string; // 센서 타입 (ex: GAS)
                installLocation?: string; // 설치 위치 (선택)
            };
        }>,
        reply: FastifyReply
    ) {
        try {
            // 요청 Body 추출
            const data = request.body;

            // 서비스 로직 호출 (센서 생성)
            const result = await this.sensorService.createSensor(data);

            // 성공 응답 반환
            return reply.code(201).send(result);
        } catch (error: any) {
            // 에러 로그 기록
            request.log.error(error);

            // 에러 응답 반환
            return reply.code(400).send({
                message: error.message || "Sensor 생성 실패",
            });
        }
    }
}