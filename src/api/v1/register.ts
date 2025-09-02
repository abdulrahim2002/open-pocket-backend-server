import registerEndpointContract from "@src/api/v1/contracts/register.contract.js";
import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";

const registerEndpoint: FastifyPluginAsyncJsonSchemaToTs = async function (app) {

    app.post(
        "/register",
        {schema: registerEndpointContract},
        async (request, reply) => {
            // return a dummy response
            return {
                status: 200,
            }
        }
    );
};

export default registerEndpoint;