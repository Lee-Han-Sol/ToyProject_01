import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from "typeorm";
import { Sensor } from "../sensor/sensor.entity";
//건설, 공사 단위 현장
@Entity("sites")
export class Site {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 255 })
    location: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Sensor, (sensor) => sensor.site)
    sensors: Sensor[];
}