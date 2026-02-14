import { NextResponse } from "next/server";

export async function GET() {
    const spec = {
        openapi: "3.0.0",
        info: {
            title: "NexaLine API",
            version: "1.0.0",
            description: "API for Virtual Numbers, SMS, and Verification"
        },
        servers: [
            {
                url: "/api/v1",
                description: "Current Server"
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "API Key" // We treat API keys as Bearer tokens
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ],
        paths: {
            "/keys": {
                get: {
                    summary: "List API Keys",
                    operationId: "listKeys",
                    responses: {
                        "200": {
                            description: "List of API keys",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            keys: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        id: { type: "string" },
                                                        name: { type: "string" },
                                                        keyPrefix: { type: "string" },
                                                        status: { type: "string" },
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                post: {
                    summary: "Create API Key",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        "200": {
                            description: "Key created"
                        }
                    }
                }
            },
            "/verify/numbers": {
                post: {
                    summary: "Send Verification OTP",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        phoneNumber: { type: "string" }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        "200": { description: "OTP Sent" }
                    }
                },
                get: {
                    summary: "Check Verification OTP",
                    parameters: [
                        { name: "phoneNumber", in: "query", required: true, schema: { type: "string" } },
                        { name: "code", in: "query", required: true, schema: { type: "string" } }
                    ],
                    responses: {
                        "200": { description: "Verified" }
                    }
                }
            }
        }
    };

    return NextResponse.json(spec);
}
