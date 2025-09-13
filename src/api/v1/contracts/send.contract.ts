const sendEndpointContract = {
    // request body
    body: {
        type: "object",
        properties: {
            consumer_key: { type: "string" },
            access_token: { type: "string" },
            actions: {
                /**
                 * each action contains "action" which is one of the following
                 * along with propertis required for that action. Since we cannot
                 * determine these properties beforehand, we let them pass though
                 * hereand validate them in the relevant action handler.
                **/
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        action: {
                            type: "string",
                            enum: [
                                "add", "archive", "readd", "favorite", "unfavorite", "delete", "tags_add",
                                "tags_remove", "tags_replace", "tags_clear", "tag_rename", "tag_delete",
                            ],
                        },
                    },
                    required: ["action"],
                    additionalProperties: true, // let additional properties pass through
                },
            },
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
            properties: {
                status: { type: "integer", default: 1 },
                action_results: {
                    type: "array",
                    items: { type: "boolean" },
                },
            },
        },
    },
} as const;

export default sendEndpointContract;
