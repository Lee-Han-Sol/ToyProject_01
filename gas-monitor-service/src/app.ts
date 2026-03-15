import Fastify from "fastify";

const app = Fastify({
    logger: true,
});

app.get("/health", async () => {
    return {
        status: "ok",
        service: "gas-monitor-service",
    };
});

export default app;