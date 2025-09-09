/**
 * /add endpoint
 * https://abdulrahim2002.github.io/open-pocket-backend-server/docs/API-spec/Endpoints/add/
 * https://abdulrahim2002.github.io/open-pocket-backend-server/docs/Processes/add_request_lifecycle/
 **/
import createArticle    from "@src/db/dbcontrollers/articles.createArticle.js";
import createTag        from "@src/db/dbcontrollers/tags.createTag.js";
import { StatusCodes }  from "http-status-codes";
import fastifyPassport  from "@src/commons/fastifyPassport.js";
import addEndpointContract from "@src/api/v1/contracts/add.contract.js";
import { FastifyPluginAsyncJsonSchemaToTs }
                        from "@fastify/type-provider-json-schema-to-ts";


const addEndpoint: FastifyPluginAsyncJsonSchemaToTs = async (app) => {

    app.post(
        "/add",
        {
            schema: addEndpointContract,
            preValidation: fastifyPassport.authenticate(["secure-session", "jwt"])
        },
        async (request, response) => {
            // create a new article
            const resCreateArticle = await createArticle({
                user_id: request.user!.user_id!,
                resolved_url: `Supplied url: ${request.body.url}, resolved url: WIP`,
                resolved_title: `Supplied title: ${request.body.title}, resolved title: WIP`,
                excerpt: "Backend parser not implemented yet",
                word_count: 0,
                has_image: 0,
                has_video: 0,
                is_index: false,
                is_article: true,
                author_id: undefined, // TODO: Implement Authors | needs backend parser
                status: 0,
                favorite: false,
                time_added: new Date(),
                time_updated: new Date(),
                top_image_url: "Backend parser not implemented yet",
            });

            if (!resCreateArticle.success) {
                const   errorCode = resCreateArticle.recommendedHttpResponseCode ||
                                    StatusCodes.INTERNAL_SERVER_ERROR,
                        errorMsg  = resCreateArticle.message || "Something went wrong!";

                response.status(errorCode);
                return {
                    error: {
                        code: errorCode,
                        message: errorMsg,
                    }
                }
            }

            // create all tags that apply
            const tags = request.body.tags?.split(",");
            if (tags) {
                for ( const tag of tags ) {
                    if (!tag) continue;
                    const resCreateTag = await createTag({
                        user_id: request.user!.user_id!,
                        item_id: resCreateArticle.data!.item_id,
                        tag_name: tag,
                    });

                    if ( !resCreateTag.success ) {
                        app.log.error(`Could not create tag ${tag}. Messaeg: ${resCreateTag.message}`);
                    }
                }
            }

            response.status(StatusCodes.OK);
            return {
                item_id: resCreateArticle.data!.item_id.toString(),
                normal_url: resCreateArticle.data!.resolved_url!,
                resolved_id: resCreateArticle.data!.item_id.toString(),
                resolved_url: resCreateArticle.data!.resolved_url!,
                domain_id: "Domain ID is not implemented yet, schema needs upgrade",
                origin_domain_id: "Origin domain ID not implemented yet, schema needs upgrade",
                response_code: StatusCodes.OK.toString(),
                mime_type: "Needs backend parser | WIP",
                content_length: "Needs backend parser | WIP",
                encoding: "Needs backend parser | WIP",
                date_resolved: new Date().toISOString(),
                date_published: new Date().toISOString(),
                title: resCreateArticle.data!.resolved_title,
                excerpt: "Needs backend parser | WIP",
            }

        }

    );

};

export default addEndpoint;
