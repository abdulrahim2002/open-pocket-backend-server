import type { FastifyInstance } from 'fastify';
import getEndpointContract      from '@src/api/v1/contracts/get.contract.js';
import readArticlesByUser       from '@src/db/dbcontrollers/articles.readArticlesByUser.js';
import fastifyPassport          from '@src/commons/fastifyPassport.js';
import { StatusCodes }          from 'http-status-codes';

/**
 * /get endpoint
 * https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/get/
 **/
async function getEndpoint( app: FastifyInstance ) {
    app.post(
        "/get",
        {
            schema: getEndpointContract,
            preValidation: fastifyPassport.authenticate(["secure-session", "jwt"])
        },
        async (request, response) => {

            // TODO: add a config object to support custom filtering
            const resReadArticlesByUser = await readArticlesByUser(request.user!.user_id);

            if (!resReadArticlesByUser.success) {
                const   errorCode = resReadArticlesByUser.recommendedHttpResponseCode ||
                                    StatusCodes.INTERNAL_SERVER_ERROR,
                        errorMessage = resReadArticlesByUser.message ||
                                        "Something went wrong!";

                response.code(errorCode);
                return {
                    erorr: {
                        code: errorCode,
                        message: errorMessage
                    }
                }
            }

            const articles: Record<string, any> = {
                // mapping: item_id -> item object
            };

            for ( const article of resReadArticlesByUser.data! ) {
                articles[article.item_id.toString()] = {
                    item_id: article.item_id.toString(),
                    resolved_id:    "TODO: Needs schema update",
                    given_url:      article.given_url,
                    given_title:    article.given_title,
                    favorite:       article.favorite,
                    status:         article.status,
                    resolved_title: article.resolved_title,
                    resolved_url:   article.resolved_url,
                    excerpt:        article.excerpt,
                    is_article:     article.is_article,
                    has_video:      article.has_video,
                    has_image:      article.has_image,
                    word_count:     article.word_count,
                    // tags: WIP
                    // arthors: WIP
                    // images: WIP
                    // videso: WIP
                };
            }

            response.status(StatusCodes.OK);
            return {
                // this is not documented in detail anywhere.But i suppose 1 means success
                // and 0 means failure
                status: 1,
                list: articles,
            };
    });
}

export default getEndpoint;
