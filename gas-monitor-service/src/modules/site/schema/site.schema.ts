// Site Swagger schema 정의

export const createSiteSwaggerSchema = {
    tags: ["Site"],
    summary: "현장 생성",
    description: "새 건설 현장을 생성합니다.",
    body: {
        type: "object",
        required: ["name", "location"],
        properties: {
            name: {
                type: "string",
            },
            location: {
                type: "string",
            },
        },
    },
    response: {
        201: {
            type: "object",
            properties: {
                id: { type: "number" },
                name: { type: "string" },
                location: { type: "string" },
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
export const getSitesSwaggerSchema = {
    tags: ["Site"],
    summary: "현장 목록 조회",
    description: "현장 목록을 페이징하여 조회합니다.",
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
                            name: { type: "string" },
                            location: { type: "string" },
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