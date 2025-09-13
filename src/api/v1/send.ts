/**
 * /send endpoint
 * https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/send/
 **/
import fastifyPassport          from "@src/commons/fastifyPassport.js";
import sendEndpointContract     from "@src/api/v1/contracts/send.contract.js";
import { FastifyPluginAsyncJsonSchemaToTs }
                                from "@fastify/type-provider-json-schema-to-ts";


const sendEndpoint: FastifyPluginAsyncJsonSchemaToTs = async (app) => {

    app.post(
        "/send",
        {
            schema: sendEndpointContract,
            preValidation: fastifyPassport.authenticate(["secure-session", "jwt"])
        },
        async (request, reply) => {
            // send a dummy response
            return {
                status: 1,
                action_results: [true, false, true]
            }
        }

    );

};

export default sendEndpoint;
