import { error } from "console";
import Fastify, { type FastifySchema } from "fastify";
import { url } from "inspector";
import { title } from "process";

const app = Fastify({
    logger: true,
});

/**
 * /add endpoint
 * https://abdulrahim2002.github.io/open-pocket-backend-server/docs/API-spec/add
 **/


// See: https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/#validation

const addRequestSchema: FastifySchema = {
    // request body
    body: {
        type: 'object',
        properties: {
            url: { type: 'string', format: 'uri' },
            title: { type: 'string', nullable: true },
            tags: { type: 'string', nullable: true },
            tweet_id: { type: 'string', nullable: true },
            consumer_key: { type: 'string' },
            access_token: { type: 'string' }
        },
        required: ['url', 'consumer_key', 'access_token']
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
                item_id: { type: 'string' },
                normal_url: { type: 'string' },
                resolved_id: { type: 'string' },
                resolved_url: { type: 'string' },
                domain_id: { type: 'string' },
                origin_domain_id: { type: 'string' },
                response_code: { type: 'string', nullable: true },
                mime_type: { type: 'string', nullable: true },
                content_length: { type: 'string', nullable: true },
                encoding: { type: 'string', nullable: true },
                date_resolved: { type: 'string', format: 'date-time', nullable: true },
                date_published: { type: 'string', format: 'date-time', nullable: true },
                title: { type: 'string', nullable: true },
                excerpt: { type: 'string', nullable: true },
                word_count: { type: 'integer', nullable: true },
                has_image: { type: 'integer', default: 0 },
                has_video: { type: 'integer', default: 0 },
                is_index: { type: 'integer', default: 0 },
                is_article: { type: 'integer', default: 0 },
                authors: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            author_id: { type: 'string' },
                            name: { type: 'string', nullable: true },
                            url: { type: 'string', format: 'uri', nullable: true },
                        },
                        required: ['name']
                    },
                    nullable: true,
                },
                images: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            image_id: { type: 'string' },
                            src: { type: 'string', format: 'uri', nullable: true },
                            width: { type: 'integer', nullable: true },
                            height: { type: 'integer', nullable: true },
                            credit: { type: 'string', nullable: true },
                        },
                        required: ['src']
                    },
                    nullable: true,
                },
                videos: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            video_id: { type: 'string' },
                            src: { type: 'string', format: 'uri' },
                            width: { type: 'integer', nullable: true },
                            height: { type: 'integer', nullable: true },
                            type: { type: 'string', nullable: true },
                        },
                        required: ['src']
                    },
                    nullable: true,
                },
            },
            required: [
                'item_id', 'normal_url', 'resolved_id', 'resolved_url', 'domain_id', 
                'origin_domain_id', 'date_resolved', 'date_published'
            ],
        }
    }
}

app.post("/add", { schema: addRequestSchema }, async (request, reply) => {
    // send a dummy response
    return {
        item_id: "12345",
        normal_url: "https://example.com/article",
        resolved_id: "67890",
        resolved_url: "https://example.com/resolved",
        domain_id: "domain123",
        origin_domain_id: "origin123",
        response_code: "200",
        mime_type: "text/html",
        content_length: "1024",
        encoding: "utf-8",
        date_resolved: new Date().toISOString(),
        date_published: new Date().toISOString(),
        title: "Sample Article Title",
        excerpt: "This is a sample excerpt of the article.",
    };
});


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
