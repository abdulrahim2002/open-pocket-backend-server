import loginEndpointContract        from "@src/api/v1/contracts/login.contract.js";
import { StatusCodes }              from "http-status-codes";
import mainConfig                   from "@src/configs/main.config.js";
import { FastifyPluginAsyncJsonSchemaToTs }
                                    from "@fastify/type-provider-json-schema-to-ts";
import { fastifyPassport }          from "@src/app.js";

const loginEndpoint: FastifyPluginAsyncJsonSchemaToTs = async (app) => {

    app.post(
        "/login",
        {
            schema: loginEndpointContract,
            preValidation: fastifyPassport.authenticate("local", { session: false }),
        },
        async (request, response) => {
            const { email, user_id, name } = request.user as any;

            const jwtToken = app.jwt.sign({
                email: email,
                id: user_id,
                expiresIn: mainConfig.JWT_EXPIRES_IN
            });

            response.status(StatusCodes.OK);
            return {
                data: {
                    type: "users",
                    id: String(user_id),
                    attributes: {
                        name: name,
                        email: email
                    }
                },
                tokens: {
                    accessToken:    jwtToken,
                    refreshToken:   "sorry! not implemented yet. Get a new token please.",
                    tokenType:      "Bearer",
                }
            };

        }

    );
};

export default loginEndpoint;