/**
 * /add endpoint
 * https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/add/
 * https://abdulrahim2002.github.io/open-pocket-docs/docs/Processes/add_request_lifecycle/
 **/
import createArticle    from "@src/db/dbcontrollers/articles.createArticle.js";
import createTag        from "@src/db/dbcontrollers/tags.createTag.js";
import { StatusCodes }  from "http-status-codes";
import fastifyPassport  from "@src/commons/fastifyPassport.js";
import parser           from "@src/commons/parser.js";
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

            const resParser = await parser(request.body.url);

            if (!resParser.success) {
                // TODO: think: to return or not to return?
                // we shall populate the parser fields on a best effort basis. 
                // Think about, What happens when the user is trying to save a url
                // to pdf or file. e.g. file://home/doc.pdf
                // in this case, the parser will surely fail. Therefore, we shall not
                // return on parser failure
                response.status(resParser.recommendedHttpResponseCode);
                return {
                    error: {
                        code: resParser.recommendedHttpResponseCode,
                        message: resParser.message,
                    }
                }
            }

            // create a new article
            const resCreateArticle = await createArticle({
                user_id: request.user!.user_id!,
                given_url:          request.body.url,
                given_title:        request.body.title || "",
                resolved_url:       resParser.data!.resolved_url,
                resolved_title:     resParser.data!.resolved_title,
                domain_id:          BigInt(1231123), // TODO: implement a domains table
                origin_domain_id:   BigInt(123123),  // TODO: implement a domains table
                excerpt:            resParser.data!.excerpt,
                word_count:         resParser.data!.word_count,
                has_image:          resParser.data!.has_image,
                has_video:          resParser.data!.has_video,
                is_index:           resParser.data!.is_index,
                is_article:         resParser.data!.is_article,
                author_id:          undefined, // TODO: Implement Authors | needs backend parser
                status:             0,
                favorite:           false,
                time_added:         new Date(),
                time_updated:       new Date(),
                top_image_url:      resParser.data!.top_image_url,
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
                item_id:            resCreateArticle.data!.item_id.toString(),
                normal_url:         resCreateArticle.data!.resolved_url!,
                resolved_id:        resCreateArticle.data!.item_id.toString(),
                resolved_url:       resCreateArticle.data!.resolved_url!,
                domain_id:          resCreateArticle.data!.domain_id?.toString() || "",
                origin_domain_id:   resCreateArticle.data!.origin_domain_id?.toString() || "",
                response_code:      StatusCodes.OK.toString(),
                mime_type:          resParser.data!.mime_type,
                content_length:     resParser.data!.content_length,
                encoding:           resParser.data!.encoding,
                date_resolved:      new Date().toISOString(),
                date_published:     new Date().toISOString(),
                title:              resCreateArticle.data!.resolved_title,
                excerpt:            resCreateArticle.data!.excerpt,
            };

        }

    );

};

export default addEndpoint;
