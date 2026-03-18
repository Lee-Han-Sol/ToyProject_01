import "reflect-metadata";
import { DataSource } from "typeorm";
import { Site } from "../../modules/site/site.entity";
import { Sensor } from "../../modules/sensor/sensor.entity";
import { GasReading } from "../../modules/gas-reading/gas-reading.entity";
import { GasAlert } from "../../modules/gas-alert/gas-alert.entity";
import { OutboxEvent } from "../../modules/outbox/outbox-event.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3307),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "gas_monitor",
    synchronize: true, // 개발단계에서 변경사항이 많으므로 설정
    logging: true,
    entities: [Site, Sensor, GasReading, GasAlert, OutboxEvent],
    // migrations: ["src/migrations/*.ts"], // 마이그레이션 사용시
});