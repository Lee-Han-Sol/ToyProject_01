import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Sensor } from "../sensor/sensor.entity";
import { GasReading } from "../gas-reading/gas-reading.entity";

@Entity("gas_alerts")
export class GasAlert {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sensorId: number;

    @Column()
    readingId: number;

    @Column({ length: 20 })
    level: string; // NORMAL / WARNING / DANGER

    @Column({ length: 255 })
    reason: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Sensor, (sensor) => sensor.alerts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "sensorId" })
    sensor: Sensor;

    @ManyToOne(() => GasReading, (reading) => reading.alerts, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "readingId" })
    reading: GasReading;
}