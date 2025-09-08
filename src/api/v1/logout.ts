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
            const user = request.user as any;
            request.logout();

            if (!request.session.get("passport")) {
                // session data deleted successfully
                response.status(StatusCodes.OK);
                return {
                    data: {
                        type: "users",
                        user_id: String(user.user_id),
                        attributes: {
                            name: user.name,
                            email: user.email
                        }
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