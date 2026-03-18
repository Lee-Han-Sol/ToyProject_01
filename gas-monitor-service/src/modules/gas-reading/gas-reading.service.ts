import { AppDataSource } from "../../infra/db/data-source";
import { GasReading } from "./gas-reading.entity";

// GasReading 저장 담당
// 현재는 측정값 저장만 하고,
// 다음 단계에서 위험도 판정/Alert/Outbox 로직을 붙일 예정
export class GasReadingService {
    private gasReadingRepository = AppDataSource.getRepository(GasReading);

    // 센서 측정값 저장
    async createReading(data: {
        sensorId: number;
        gasType: string;
        value: number;
        unit: string;
    }) {
        const reading = this.gasReadingRepository.create({
            sensorId: data.sensorId,
            gasType: data.gasType,
            value: data.value,
            unit: data.unit,
        });

        return await this.gasReadingRepository.save(reading);
    }

    // 센서 측정값 조회
    // GET /sensors/:sensorId/readings
    async getReadings(
        sensorId: number,
        query?: { page?: number; limit?: number }
    ) {
        // 기본값 설정
        const page = query?.page ?? 1;
        const limit = query?.limit ?? 10;

        // skip 계산
        const skip = (page - 1) * limit;

        // 조회
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
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}