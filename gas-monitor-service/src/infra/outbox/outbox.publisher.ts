import { AppDataSource } from "../db/data-source";
import { OutboxEvent } from "../../modules/outbox/outbox-event.entity";

// Outbox 이벤트를 외부로 발행하는 Publisher
export class OutboxPublisher {
    private interval: NodeJS.Timeout | null = null;

    // polling 시작
    start() {
        console.log("Outbox Publisher 시작");

        // 3초마다 실행
        this.interval = setInterval(async () => {
            await this.processEvents();
        }, 3000);
    }

    // polling 종료
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    // 이벤트 처리
    private async processEvents() {
        const repository = AppDataSource.getRepository(OutboxEvent);

        // PENDING 상태 이벤트 조회
        const events = await repository.find({
            where: { status: "PENDING" },
            order: { createdAt: "ASC" },
            take: 10, // 한 번에 10개씩 처리
        });

        if (events.length === 0) {
            return;
        }

        console.log(`Outbox 이벤트 처리 시작: ${events.length}건`);

        for (const event of events) {
            try {
                // 1. 이벤트 발행 (현재는 콘솔 로그로 대체)
                await this.publishEvent(event);

                // 2. 상태 변경
                event.status = "SENT";
                await repository.save(event);

            } catch (error) {
                console.error("Outbox 이벤트 처리 실패:", event.id, error);

                // 실패 시 FAILED로 변경 (선택)
                event.status = "FAILED";
                await repository.save(event);
            }
        }
    }

    // 실제 이벤트 발행 (지금은 mock) 테스트용 운영단계에서 주석 처리할것
    private async publishEvent(event: OutboxEvent) {
        console.log("=== 이벤트 발행 ===");
        console.log("eventType:", event.eventType);
        console.log("payload:", JSON.stringify(event.payload, null, 2));
        console.log("==================");

        // 나중에 여기서 SNS/SQS로 보냄
    }
}