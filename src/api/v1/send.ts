import { type FastifyInstance } from "fastify";
import fastifyPassport          from "@src/commons/fastifyPassport.js";
import sendEndpointContract     from "@src/api/v1/contracts/send.contract.js";

/**
 * /send endpoint
 * https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/send/
 **/
async function sendEndpoint( app: FastifyInstance ) {
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
    })
}

export default sendEndpoint;
