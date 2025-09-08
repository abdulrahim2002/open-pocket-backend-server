import { StatusCodes }          from "http-status-codes";
import { FastifyPluginAsyncJsonSchemaToTs }
                                from "@fastify/type-provider-json-schema-to-ts";

const logoutEndpoint: FastifyPluginAsyncJsonSchemaToTs = async (app) => {

    app.post(
        "/logout",
        async (request, response) => {
            request.logout();
            return response.status(StatusCodes.OK).send();
        }
    )

};

export default logoutEndpoint;