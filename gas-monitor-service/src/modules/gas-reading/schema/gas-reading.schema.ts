// GasReading Swagger schema 정의

export const createGasReadingSwaggerSchema = {
    tags: ["GasReading"],
    summary: "가스 측정값 저장",
    description: "특정 센서의 가스 측정값을 저장하고, 기준 초과 시 경보와 이벤트를 생성합니다.",
    params: {
        type: "object",
        required: ["sensorId"],
        properties: {
            sensorId: {
                type: "number",
            },
        },
    },
    body: {
        type: "object",
        required: ["gasType", "value", "unit"],
        properties: {
            gasType: {
                type: "string",
            },
            value: {
                type: "number",
            },
            unit: {
                type: "string",
            },
        },
    },
    response: {
        201: {
            type: "object",
            properties: {
                id: { type: "number" },
                sensorId: { type: "number" },
                gasType: { type: "string" },
                value: { type: "number" },
                unit: { type: "string" },
                createdAt: { type: "string", format: "date-time" },
            },
        },
    },
};

export const getGasReadingsSwaggerSchema = {
    tags: ["GasReading"],
    summary: "가스 측정값 조회",
    description: "특정 센서의 측정값 목록을 페이징 조회합니다.",
    params: {
        type: "object",
        required: ["sensorId"],
        properties: {
            sensorId: {
                type: "number",
            },
        },
    },
    querystring: {
        type: "object",
        properties: {
            page: {
                type: "number",
                default: 1,
            },
            limit: {
                type: "number",
                default: 10,
            },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            sensorId: { type: "number" },
                            gasType: { type: "string" },
                            value: { type: "number" },
                            unit: { type: "string" },
                            createdAt: { type: "string", format: "date-time" },
                        },
                    },
                },
                meta: {
                    type: "object",
                    properties: {
                        page: { type: "number" },
                        limit: { type: "number" },
                        total: { type: "number" },
                        totalPages: { type: "number" },
                    },
                },
            },
        },
    },
};