import { AppDataSource } from "../../infra/db/data-source";
import { Site } from "../site/site.entity";
import {Sensor} from "./sensor.entity";

export class SensorService {
    private sensorRepository = AppDataSource.getRepository(Sensor);
    private siteRepository = AppDataSource.getRepository(Site);

    async createSensor(data: {
        siteId: number;
        name: string;
        type: string;
        installLocation?: string;
    }) {
        // 1. Site 존재 여부 확인
        const site = await this.siteRepository.findOne({
            where: { id: data.siteId },
        });

        if (!site) {
            throw new Error("Site not found");
        }

        // 2. 관계 객체 기반으로 생성
        const sensor = this.sensorRepository.create({
            site,
            name: data.name,
            type: data.type,
            installLocation: data.installLocation ?? null,
        });

        return await this.sensorRepository.save(sensor);
    }
}