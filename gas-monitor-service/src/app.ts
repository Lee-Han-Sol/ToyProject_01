import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { siteRoutes } from "./modules/site/site.route";
import { sensorRoutes } from "./modules/sensor/sensor.route";
import { gasReadingRoutes } from "./modules/gas-reading/gas-reading.route";

const app = Fastify({
    logger: true,
});
// 스웨거 문서
app.register(swagger, {
    openapi: {
        info: {
            title: "Gas Monitor API",
            description: "건설 현장 가스 모니터링 API 문서",
            version: "1.0.0",
        },
        tags: [
            { name: "Site", description: "현장 관리 API" },
            { name: "Sensor", description: "센서 관리 API" },
            { name: "GasReading", description: "가스 측정값 API" },
        ],
    },
});

app.register(swaggerUI, {
    routePrefix: "/docs",
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