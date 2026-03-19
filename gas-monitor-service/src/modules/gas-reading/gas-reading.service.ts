import { AppDataSource } from "../../infra/db/data-source";
import { Sensor } from "../sensor/sensor.entity";
import { CreateGasReadingRequestDto } from "./dto/create-gas-reading.request.dto";
import { GasReadingResponseDto } from "./dto/gas-reading.response.dto";
import { GetGasReadingsQueryDto } from "./dto/get-gas-readings.query.dto";
import { PagedGasReadingsResponseDto } from "./dto/paged-gas-readings.response.dto";
import { GasReading } from "./gas-reading.entity";
import {calculateGasRisk} from "./gas-risk.rule";
import {OutboxEvent} from "../outbox/outbox-event.entity";
import {GasAlert} from "../gas-alert/gas-alert.entity";

// GasReading 저장 담당
export class GasReadingService {
    private gasReadingRepository = AppDataSource.getRepository(GasReading);
    private sensorRepository = AppDataSource.getRepository(Sensor);

    // 센서 측정값 저장
    async createReading(
        sensorId: number,
        data: CreateGasReadingRequestDto
    ): Promise<GasReadingResponseDto> {
        // 센서 존재 유무
        const sensor = await this.sensorRepository.findOne({
            where: { id: sensorId },
        });

        if (!sensor) {
            throw new Error("해당 센서 존재하지않음");
        }

        // 트랜잭션 시작
        const savedReading = await AppDataSource.transaction(async (manager) => {
            const gasReadingRepository = manager.getRepository(GasReading);
            const gasAlertRepository = manager.getRepository(GasAlert);
            const outboxRepository = manager.getRepository(OutboxEvent);

            // 1. GasReading 저장
            const reading = gasReadingRepository.create({
                sensorId,
                sensor,
                gasType: data.gasType,
                value: data.value,
                unit: data.unit,
            });

            const saved = await gasReadingRepository.save(reading);

            // 2. 위험도 계산
            const risk = calculateGasRisk(data.gasType, data.value);

            // 3. WARNING/DANGER면 GasAlert 생성
            if (risk.level !== "NORMAL") {
                const alert = gasAlertRepository.create({
                    sensorId,
                    readingId: saved.id,
                    level: risk.level,
                    reason: risk.reason,
                });

                const savedAlert = await gasAlertRepository.save(alert);

                // 4. OutboxEvent 저장
                const outbox = outboxRepository.create({
                    eventType: "GasAlertCreated",
                    aggregateType: "GasAlert",
                    aggregateId: String(savedAlert.id),
                    payload: {
                        alertId: savedAlert.id,
                        sensorId: sensorId,
                        readingId: saved.id,
                        gasType: saved.gasType,
                        value: saved.value,
                        unit: saved.unit,
                        level: savedAlert.level,
                        reason: savedAlert.reason,
                        occurredAt: saved.createdAt,
                    },
                    status: "PENDING",
                });

                await outboxRepository.save(outbox);
            }
            return saved;
        });
        return this.toGasReadingResponseDto(savedReading);
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