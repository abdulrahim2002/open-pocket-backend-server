const refreshEndpointContract = {
    // request body
    body: {
        type: "object",
        properties: {
            refresh_token:      { type: "string" },
        },
        required: ["refresh_token"],
    },
    // request headers
    headers: {
        type: "object",
        properties: {
            "Content-Type": { type: "string", enum: ["application/json"] },
        },
        required: ["Content-Type"],
    },
    // response schema
    response: {
        default: {
            type: "object",
            properties: {
                error: {
                    type: "object",
                    properties: {
                        code: { type: "integer" },
                        message: { type: "string" },
                        details: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    code: { type: "number" },
                                    message: { type: "string" }
                                },
                                required: [ "code", "message" ]
                            }
                        },
                    },
                    required: [ "code", "message" ]
                }
            },
            required: [ "error" ]
        },
        "2xx": {
            type: "object",
            additionalProperties: false,
            properties: {
                tokens: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        accessToken:   { type: "string" },
                        refreshToken:  { type: "string" },
                        tokenType:     { type: "string" }, // MUST be "Bearer"
                    },
                    required: [ "accessToken", "refreshToken", "tokenType" ]
                }
            },
            required: ["tokens"]
        }
    },
} as const; // this is important for type inference on `req.body`

export default refreshEndpointContract;
