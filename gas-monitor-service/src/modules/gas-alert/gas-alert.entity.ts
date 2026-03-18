import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn, UpdateDateColumn, DeleteDateColumn,
} from "typeorm";
import { Sensor } from "../sensor/sensor.entity";
import { GasReading } from "../gas-reading/gas-reading.entity";

// 위험도 판정 결과
@Entity("gas_alerts")
export class GasAlert {
    @PrimaryGeneratedColumn()
    id: number;

    // 논리 FK
    @Column()
    sensorId: number;

    // 논리 FK
    @Column()
    readingId: number;

    // WARNING / DANGER
    @Column({ length: 20 })
    level: string;

    @Column({ length: 255 })
    reason: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt!: Date | null;

    // relation은 유지, 물리 FK 제약은 생성하지 않음
    @ManyToOne(() => Sensor, (sensor) => sensor.alerts, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: "sensorId" })
    sensor: Sensor;

    @ManyToOne(() => GasReading, (reading) => reading.alerts, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: "readingId" })
    reading: GasReading;
}