import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { Site } from "../site/site.entity";
import { GasReading } from "../gas-reading/gas-reading.entity";
import { GasAlert } from "../gas-alert/gas-alert.entity";
//현장에 설치된 가스 센서
@Entity("sensors")
export class Sensor {
    @PrimaryGeneratedColumn()
    id: number;

    // 논리 FK (핵심)
    @Column()
    siteId: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 50 })
    type: string;

    @Column({ length: 100, nullable: true })
    installLocation: string;

    @CreateDateColumn()
    createdAt: Date;

    // relation은 유지하되 FK 제약 제거
    @ManyToOne(() => Site, (site) => site.sensors, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: "siteId" })
    site: Site;

    @OneToMany(() => GasReading, (reading) => reading.sensor)
    readings: GasReading[];

    @OneToMany(() => GasAlert, (alert) => alert.sensor)
    alerts: GasAlert[];
}