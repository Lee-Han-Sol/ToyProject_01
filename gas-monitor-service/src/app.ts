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

  // 도메인별 라우트 등록
  // prefix를 통해 URL 구조를 계층적으로 구성

// Site
app.register(siteRoutes, {
    prefix: "/sites",
});

// Sensor (Site 하위 리소스)
app.register(sensorRoutes, {
    prefix: "/sites/:siteId/sensors",
});

// GasReading (Sensor 하위 리소스)
app.register(gasReadingRoutes, {
    prefix: "/sensors/:sensorId/readings",
});

export default app;