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

@Entity("gas_readings")
export class GasReading {
    @PrimaryGeneratedColumn()
    id: number;

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

    @ManyToOne(() => Sensor, (sensor) => sensor.readings, { onDelete: "CASCADE" })
    @JoinColumn({ name: "sensorId" })
    sensor: Sensor;

    @OneToMany(() => GasAlert, (alert) => alert.reading)
    alerts: GasAlert[];
}