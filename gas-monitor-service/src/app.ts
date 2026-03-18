import Fastify from "fastify";
import { siteRoutes } from "./modules/site/site.route";
import { sensorRoutes } from "./modules/sensor/sensor.route";
import { gasReadingRoutes } from "./modules/gas-reading/gas-reading.route";

const app = Fastify({
    logger: true,
});

// 서버 상태 확인용 API
app.get("/health", async () => {
    return {
        status: "ok",
        service: "gas-monitor-service",
    };
});

// 모듈별 라우트 등록
app.register(siteRoutes);
app.register(sensorRoutes);
app.register(gasReadingRoutes);

export default app;