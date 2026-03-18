import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from "typeorm";
import { Sensor } from "../sensor/sensor.entity";
//건설, 공사 현장 단위
@Entity("sites")
export class Site {
    @PrimaryGeneratedColumn()
    id: number;

    // 현장명
    @Column({ length: 100 })
    name: string;

    // 현장 위치
    @Column({ length: 255 })
    location: string;

    @CreateDateColumn()
    createdAt: Date;

    // relation은 조회 편의를 위해 유지
    @OneToMany(() => Sensor, (sensor) => sensor.site)
    sensors: Sensor[];
}