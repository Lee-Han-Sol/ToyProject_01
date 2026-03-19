import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./infra/db/data-source";
import { OutboxPublisher } from "./infra/outbox/outbox.publisher";
dotenv.config();

const PORT = Number(process.env.PORT || 3000);

async function bootstrap() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected");

        // Outbox Publisher 시작 메시징처리기
        const publisher = new OutboxPublisher();
        publisher.start();

        await app.listen({
            port: PORT,
            host: "0.0.0.0",
        });

        console.log(`서버시작 http://localhost:${PORT}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

bootstrap();