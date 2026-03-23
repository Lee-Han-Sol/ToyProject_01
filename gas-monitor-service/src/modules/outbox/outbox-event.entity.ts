import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn, Index,
} from "typeorm";

// 외부 메시지 발행 전 임시 저장용 Outbox
@Entity("outbox_events")
export class OutboxEvent {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 100 })
    eventType: string;

    @Column({ length: 100 })
    aggregateType: string;

    // 특정 도메인 객체 id를 문자열로 저장
    @Column({ length: 100 })
    aggregateId: string;

    @Column("json")
    payload: Record<string, any>;

    @Column({ length: 20, default: "PENDING" }) //PENDING, PUBLISHED, FAILED
    @Index()
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}