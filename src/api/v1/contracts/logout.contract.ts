const logoutEndpointContract = {
    // request body
    body: {
        type: "object",
        additionalProperties: false,
        properties: {
            refresh_token: { type: "string" },
        },
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
            additionalProperties: false,
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
        // see: https://jsonapi.org/format/#document-meta
        "2xx": {
            type: "object",
            additionalProperties: false,
            properties: {
                meta: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        code:    { type: "number" },
                        message: { type: "string" }
                    },
                    required: [ "code", "message" ]
                }
            },
            required: [ "meta" ]
        }
    },
} as const; // this is important for type inference on `req.body`

export default logoutEndpointContract;
