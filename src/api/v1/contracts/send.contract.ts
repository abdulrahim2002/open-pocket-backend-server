import type { FastifySchema } from "fastify";

const sendEndpointContract: FastifySchema = {
    // request body
    body: {
        type: 'object',
        properties: {
            consumer_key: { type: 'string' },
            access_token: { type: 'string' },
            actions: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: [ "add", "archive", "readd", "favorite", "unfavorite", "delete",
                                    "tags_add", "tags_remove", "tags_replace", "tags_clear", "tag_rename", "tag_delete"
                            ],
                        },
                        // This is actually inacurate. We need to define a different schema for each action
                        item_id: { type: 'string', nullable: true },
                        ref_id: { type: 'string', nullable: true },
                        tags: { type: 'string', nullable: true },
                        time: { type: 'string', format: 'date-time', nullable: true },
                        title: { type: 'string', nullable: true },
                        url: { type: 'string', format: 'uri', nullable: true },
                        old_tag: { type: 'string', nullable: true },
                        new_tag: { type: 'string', nullable: true },
                    }
                }
            }
        }
    },
    // request headers
    headers: {
        type: 'object',
        properties: {
            'Content-Type': { type: 'string', enum: ['application/json'] },
        },
        required: ['Content-Type']
    },
    // response schema
    response: {
        default: {
            type: 'object',
            properties: {
                error: { type: 'boolean', default: true },
            }
        },
        '2xx': {
            type: 'object',
            properties: {
                status: { type: 'integer', default: 1 },
                action_results: {
                    type: 'array',
                    items: { type: 'boolean' },
                }
            }
        }
    }
};

export default sendEndpointContract;