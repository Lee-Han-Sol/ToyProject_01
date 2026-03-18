import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { Sensor } from "../sensor/sensor.entity";
import { GasAlert } from "../gas-alert/gas-alert.entity";

// 센서가 수집한 가스 측정 원본 데이터
@Entity("gas_readings")
export class GasReading {
    @PrimaryGeneratedColumn()
    id: number;

    // 논리 FK
    @Column()
    sensorId: number;

    @Column({ length: 20 })
    gasType: string;

    @Column("float")
    value: number;

    @Column({ length: 20 })
    unit: string;

    @CreateDateColumn()
    createdAt: Date;

    // relation은 유지, 물리 FK 제약은 생성하지 않음
    @ManyToOne(() => Sensor, (sensor) => sensor.readings, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: "sensorId" })
    sensor: Sensor;

    @OneToMany(() => GasAlert, (alert) => alert.reading)
    alerts: GasAlert[];
}