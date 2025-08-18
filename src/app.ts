import Fastify, { type FastifySchema } from "fastify";
import addEndpoint from "./routes/add.js";

const app = Fastify({
    logger: true,
});

app.register(addEndpoint);

/**
 * /get endpoint
 * https://abdulrahim2002.github.io/open-pocket-backend-server/docs/API-spec/get
 **/

const getRequestSchema = {
    // request body
    body: {
        type: 'object',
        properties: {
            consumer_key: { type: 'string' },
            access_token: { type: 'string' },
            state: { type: 'string', enum: ['all', 'unread', 'archive', 'deleted'], default: 'all' },
            favorited: { type: 'string', enum: ['0', '1'], default: '0' },
            tag: { type: 'string', nullable: true },
            contentType: { type: 'string', enum: ['article', 'video', 'image'], default: 'article' },
            sort: { type: 'string', enum: ['newest', 'oldest', 'title', 'site'], default: 'newest' },
            detailType: { type: 'string', enum: ['simple', 'complete'], default: 'simple' },
            search: { type: 'string', nullable: true },
            domain: { type: 'string', nullable: true },
            since: { type: 'string', format: 'uri', nullable: true },
            count: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
            offset: { type: 'integer', default: 0, minimum: 0 },
            total: { type: 'boolean', default: false },
        },
        required: ['consumer_key', 'access_token']
    },
    // request headers
    headers: {
        type: 'object',
        properties: {
            'Content-Type': { type: 'string', enum: ['application/json'] },
        },
        required: ['Content-Type'],
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
                list: {
                    type: 'object',
                    patternProperties: {
                        '^[0-9]+$': {
                            type: 'object',
                            properties: {
                                item_id: { type: 'string' },
                                resolved_id: { type: 'string' },
                                given_url: { type: 'string', format: 'uri', nullable: true },
                                given_title: { type: 'string', nullable: true },
                                favorite: { type: 'string', enum: ['0', '1'], default: '0' },
                                status: { type: 'string', enum: ['0', '1'], default: '0' },
                                resolved_title: { type: 'string', nullable: true },
                                resolved_url: { type: 'string', format: 'uri', nullable: true },
                                excerpt: { type: 'string', nullable: true },
                                is_article: { type: 'string', default: '0' },
                                has_video: { type: 'string', default: '0' },
                                has_image: { type: 'string', default: '0' },
                                word_count: { type: 'string', nullable: true },
                                tags: { type: 'string', nullable: true },
                                // authors: to be implemented
                                // images: to be implemented
                                // videos: to be implemented
                            },
                            required: ['item_id' ],
                        }
                    }
                }
            }
        }
    },
}

app.post("/get", { schema: getRequestSchema }, async (request, reply) => {
    // send a dummy response
    return {
        status: 1,
        list: {
            "12345": {
                item_id: "12345",
                resolved_id: "67890",
                given_url: "https://example.com/article",
                given_title: "Sample Article",
                favorite: "0",
                status: "1",
                resolved_title: "Sample Article Title",
                resolved_url: "https://example.com/resolved",
                excerpt: "This is a sample excerpt of the article.",
                is_article: "1",
                has_video: "0",
                has_image: "1",
                word_count: "500",
            }
        }
    }
});

/**
 * /send endpoint
 * https://abdulrahim2002.github.io/open-pocket-backend-server/docs/API-spec/send
 **/

const sendRequestSchema = {
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

app.post("/send", { schema: sendRequestSchema }, async (request, reply) => {
    // send a dummy response
    return {
        status: 1,
        action_results: [true, false, true],
    };
});



/* Health Check endpoint */
app.get("/", async (request, reply) => {
    return "Server is live!";
});

/**
 * Start the server!
 **/
app.listen({port:7860, host: "0.0.0.0"}, (err, addr) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.debug(`Server is running on http://localhost:${addr}`);
});
