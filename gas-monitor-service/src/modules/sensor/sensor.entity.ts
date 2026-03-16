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

@Entity("sensors")
export class Sensor {
    @PrimaryGeneratedColumn()
    id: number;

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

    @ManyToOne(() => Site, (site) => site.sensors, { onDelete: "CASCADE" })
    @JoinColumn({ name: "siteId" })
    site: Site;

    @OneToMany(() => GasReading, (reading) => reading.sensor)
    readings: GasReading[];

    @OneToMany(() => GasAlert, (alert) => alert.sensor)
    alerts: GasAlert[];
}