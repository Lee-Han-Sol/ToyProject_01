import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";

@Entity("outbox_events")
export class OutboxEvent {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 100 })
    eventType: string;

    @Column({ length: 100 })
    aggregateType: string;

    @Column({ length: 100 })
    aggregateId: string;

    @Column("json")
    payload: Record<string, any>;

    @Column({ length: 20, default: "PENDING" })
    status: string; // PENDING / PUBLISHED / FAILED

    @CreateDateColumn()
    createdAt: Date;
}