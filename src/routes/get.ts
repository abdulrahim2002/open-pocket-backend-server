import type { FastifySchema, FastifyInstance } from 'fastify';

/**
 * /get endpoint
 * https://abdulrahim2002.github.io/open-pocket-backend-server/docs/API-spec/get
 **/

const getRequestSchema: FastifySchema = {
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


async function getEndpoint( app: FastifyInstance ) {
    app.post( "/get", { schema: getRequestSchema }, async (request, reply) => {
        // send a dummy response
        return {
            status: 1,
            list: {
                "12345": {
                    item_id: "12345",
                    resolved_id: "67890",
                    given_url: "https://example.com/article",
                    given_title: "Okay it appears to be owrking",
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
}

export default getEndpoint;