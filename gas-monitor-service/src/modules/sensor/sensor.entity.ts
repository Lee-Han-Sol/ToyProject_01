import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn, UpdateDateColumn, DeleteDateColumn,
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
    serial: string;

    @Column({ length: 50 })
    model: string;

    @Column({
        type: "varchar",   // 명시적으로 지정
        length: 100,
        nullable: true,
    })
    installLocation: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt!: Date | null;

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