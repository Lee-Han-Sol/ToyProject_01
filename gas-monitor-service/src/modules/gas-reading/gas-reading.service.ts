import { AppDataSource } from "../../infra/db/data-source";
import { Sensor } from "../sensor/sensor.entity";
import { CreateGasReadingRequestDto } from "./dto/create-gas-reading.request.dto";
import { GasReadingResponseDto } from "./dto/gas-reading.response.dto";
import { GetGasReadingsQueryDto } from "./dto/get-gas-readings.query.dto";
import { PagedGasReadingsResponseDto } from "./dto/paged-gas-readings.response.dto";
import { GasReading } from "./gas-reading.entity";

// GasReading 저장 담당
export class GasReadingService {
    private gasReadingRepository = AppDataSource.getRepository(GasReading);
    private sensorRepository = AppDataSource.getRepository(Sensor);

    // 센서 측정값 저장
    async createReading(
        sensorId: number,
        data: CreateGasReadingRequestDto
    ): Promise<GasReadingResponseDto> {
        const sensor = await this.sensorRepository.findOne({
            where: { id: sensorId },
        });

        if (!sensor) {
            throw new Error("Sensor not found");
        }

        const reading = this.gasReadingRepository.create({
            sensorId,
            sensor,
            gasType: data.gasType,
            value: data.value,
            unit: data.unit,
        });

        const saved = await this.gasReadingRepository.save(reading);

        return this.toGasReadingResponseDto(saved);
    }

    // 센서 측정값 조회
    async getReadings(
        sensorId: number,
        query: GetGasReadingsQueryDto = {}
    ): Promise<PagedGasReadingsResponseDto> {
        const page = Math.max(query.page ?? 1, 1);
        const limit = Math.min(Math.max(query.limit ?? 10, 1), 100);
        const skip = (page - 1) * limit;

        const [data, total] = await this.gasReadingRepository.findAndCount({
            where: {
                sensorId,
            },
            order: {
                createdAt: "DESC",
            },
            skip,
            take: limit,
        });

        return {
            data: data.map((reading) => this.toGasReadingResponseDto(reading)),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Entity -> Response DTO 변환
    private toGasReadingResponseDto(
        reading: GasReading
    ): GasReadingResponseDto {
        return {
            id: reading.id,
            sensorId: reading.sensorId,
            gasType: reading.gasType,
            value: reading.value,
            unit: reading.unit,
            createdAt: reading.createdAt,
        };
    }
}