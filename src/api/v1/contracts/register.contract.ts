const registerEndpointContract = {
    // request body
    body: {
        type: "object",
        properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
        },
        required: ["name", "email", "password"],
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
        // inspired by: https://docs.oasis-open.org/odata/odata-json-format/v4.0/errata02/os/odata-json-format-v4.0-errata02-os-complete.html#_Toc403940655
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
        // see: https://jsonapi.org/format/#crud-creating-responses
        "2xx": {
            type: "object",
            additionalProperties: false,
            properties: {
                data: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        type: { type: "string", default: "users" },
                        id:   { type: "string" },
                        attributes: {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                name: { type: "string" },
                                email: { type: "string" }
                            },
                            required: [ "name", "email" ]
                        }
                    },
                    required: [ "type", "id", "attributes" ]
                },
                links: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        self: { type: "string" }
                    },
                    required: [ "self" ]
                }
            },
            required: [ "token", "data" ]
        }
    },
} as const; // this is important for type inference on `req.body`

export default registerEndpointContract;
