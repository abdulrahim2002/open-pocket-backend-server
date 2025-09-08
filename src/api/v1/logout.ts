import { StatusCodes }          from "http-status-codes";
import logoutEndpointContract   from "@src/api/v1/contracts/logout.contract.js";
import fastifyPassport          from "@src/commons/fastifyPassport.js";
import { FastifyPluginAsyncJsonSchemaToTs }
                                from "@fastify/type-provider-json-schema-to-ts";

const logoutEndpoint: FastifyPluginAsyncJsonSchemaToTs = async (app) => {

    app.post(
        "/logout",
        {
            schema: logoutEndpointContract,
            preValidation: fastifyPassport.authenticate("secure-session")
        },
        async (request, response) => {
            request.logout();

            if (!request.session.get("passport")) {
                response.status(StatusCodes.OK);
                return {
                    meta: {
                        code: StatusCodes.OK,
                        message: "Ok"
                    }
                }
            }
            else {
                response.status(StatusCodes.INTERNAL_SERVER_ERROR);
                return {
                    error: {
                        code: StatusCodes.INTERNAL_SERVER_ERROR,
                        message: "Something went wrong"
                    }
                }
            }
        }
    )

};

export default logoutEndpoint;
