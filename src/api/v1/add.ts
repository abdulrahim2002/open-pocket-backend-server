import type { FastifyInstance } from "fastify";
import addRequestSchema         from "@src/api/v1/schemas/add.schema.js";

/**
 * /add endpoint
 * https://abdulrahim2002.github.io/open-pocket-backend-server/docs/API-spec/add
 **/
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