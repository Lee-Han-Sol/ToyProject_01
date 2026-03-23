import { AppDataSource } from "../../infra/db/data-source";
import { Site } from "../site/site.entity";
import { Sensor } from "./sensor.entity";
import { CreateSensorRequestDto } from "./dto/create-sensor.request.dto";
import { SensorResponseDto } from "./dto/sensor.response.dto";

// Sensor 관련 비즈니스 로직 처리
export class SensorService {
    private sensorRepository = AppDataSource.getRepository(Sensor);
    private siteRepository = AppDataSource.getRepository(Site);

    // 센서 생성
    async createSensor(
        siteId: number,
        data: CreateSensorRequestDto
    ): Promise<SensorResponseDto> {
        // 1. Site 존재 여부 확인
        const site = await this.siteRepository.findOne({
            where: { id: siteId },
        });

        if (!site) {
            throw new Error("Site not found");
        }

        // 2. 관계 객체 기반 생성
        const sensor = this.sensorRepository.create({
            siteId,
            site,
            name: data.name,
            installLocation: data.installLocation ?? null,
        });

        const saved = await this.sensorRepository.save(sensor);

        return this.toSensorResponseDto(saved);
    }

    // Entity -> Response DTO 변환
    private toSensorResponseDto(sensor: Sensor): SensorResponseDto {
        return {
            id: sensor.id,
            siteId: sensor.siteId,
            name: sensor.name,
            installLocation: sensor.installLocation,
            createdAt: sensor.createdAt,
            updatedAt: sensor.updatedAt,
            deletedAt: sensor.deletedAt,
        };
    }
}