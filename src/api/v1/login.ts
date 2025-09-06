import loginEndpointContract    from "@src/api/v1/contracts/login.contract.js";
import { StatusCodes }          from "http-status-codes";
import mainConfig               from "@src/configs/main.config.js";
import fastifyPassport          from "@src/commons/fastifyPassport.js";
import refTokenMap              from "@src/api/v1/commons/abstractStore.js";
import crypto                   from "node:crypto";
import { FastifyPluginAsyncJsonSchemaToTs }
                                from "@fastify/type-provider-json-schema-to-ts";

const loginEndpoint: FastifyPluginAsyncJsonSchemaToTs = async (app) => {

    app.post(
        "/login",
        {
            schema: loginEndpointContract,
            preValidation: fastifyPassport.authenticate("local", { session: false }),
        },
        async (request, response) => {

            // we can be sure that request.session.passport and request.session.session will be available
            // even if clear fields are set
            // https://github.com/fastify/fastify-passport/blob/55aad13004def208107353a9d06b714e7d7b31f3/src/Authenticator.ts#L46
            //
            const { email, user_id, name } = request.user as any;

            const jwtToken = app.jwt.sign({
                email: email,
                id: user_id,
            }, {
                expiresIn: mainConfig.JWT_EXPIRES_IN
            });

            // create a new refresh token.
            // TODO: but what happens to old refresh tokens that this user had?
            // We need to augment the structure of our key-value store. To allow
            // us to track and delete active refresh tokens for a given user
            const refreshToken = crypto.randomBytes(32).toString("hex");
            refTokenMap.set(refreshToken, {
                user_id,
                email
            });

            response.status(StatusCodes.OK);
            return {
                data: {
                    type: "users",
                    user_id: String(user_id),
                    attributes: {
                        name: name,
                        email: email
                    }
                },
                tokens: {
                    accessToken:    jwtToken,
                    refreshToken:   refreshToken,
                    tokenType:      "Bearer",
                }
            };

        }

    );
};

export default loginEndpoint;