/**
 * /send endpoint
 * https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/send/
 **/
import fastifyPassport          from "@src/commons/fastifyPassport.js";
import sendEndpointContract     from "@src/api/v1/contracts/send.contract.js";
import actionMap                from "@src/api/v1/actions/index.js";
import { FastifyPluginAsyncJsonSchemaToTs }
                                from "@fastify/type-provider-json-schema-to-ts";
import { StatusCodes } from "http-status-codes";


const sendEndpoint: FastifyPluginAsyncJsonSchemaToTs = async (app) => {

    app.post(
        "/send",
        {
            schema: sendEndpointContract,
            preValidation: fastifyPassport.authenticate(["secure-session", "jwt"])
        },
        async (request, response) => {
            let status = 1;
            const action_results = new Array<boolean>();

            for (const actionObj of request.body.actions) {
                // result of current action
                let resCurAction;

                if (!actionMap[actionObj.action]) {
                    // if action string not in map -> ignore silently
                    app.log.warn(`send.endpoint: unknown action '${actionObj.action}'`);
                    resCurAction = false;
                }
                else {
                    // pass the whole actionObject. Unnecessary fields will be ignored!
                    resCurAction = await actionMap[actionObj.action]!(actionObj);
                }

                action_results.push(resCurAction);
                if (!resCurAction) status = 0;
            }

            response.status(StatusCodes.OK);
            return {
                status,
                action_results,
            };
        }

    );

};

export default sendEndpoint;
