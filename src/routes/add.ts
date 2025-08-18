import type { FastifyInstance, FastifySchema } from "fastify";


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

async function addEndpoint(app: FastifyInstance) {
    app.post('/add', { schema: addRequestSchema }, async (request, reply) => {
        // dummy response
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
}

export default addEndpoint;