import type { FastifyInstance } from 'fastify';
import getRequestContract       from '@src/api/v1/contracts/get.contract.js';
import fastifyPassport          from '@src/plugins/fastifyPassport.js';

/**
 * /get endpoint
 * https://abdulrahim2002.github.io/open-pocket-backend-server/docs/API-spec/Endpoints/get/
 **/
async function getEndpoint( app: FastifyInstance ) {
    app.post(
        "/get",
        {
            schema: getRequestContract,
            preValidation: fastifyPassport.authenticate("jwt")
        },
        async (request, reply) => {
            console.log(request.user);
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