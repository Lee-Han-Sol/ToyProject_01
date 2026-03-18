// Sensor Swagger schema 정의

export const createSensorSwaggerSchema = {
    tags: ["Sensor"],
    summary: "센서 생성",
    description: "특정 현장에 센서를 등록합니다.",
    params: {
        type: "object",
        required: ["siteId"],
        properties: {
            siteId: {
                type: "number",
            },
        },
    },
    body: {
        type: "object",
        required: ["name", "type"],
        properties: {
            name: {
                type: "string",
            },
            type: {
                type: "string",
            },
            installLocation: {
                type: "string",
            },
        },
    },
    response: {
        201: {
            type: "object",
            properties: {
                id: { type: "number" },
                siteId: { type: "number" },
                name: { type: "string" },
                type: { type: "string" },
                installLocation: {
                    anyOf: [{ type: "string" }, { type: "null" }],
                },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
                deletedAt: {
                    anyOf: [
                        { type: "string", format: "date-time" },
                        { type: "null" },
                    ],
                },
            },
        },
    },
};