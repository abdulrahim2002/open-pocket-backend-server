import loginEndpointContract    from "@src/api/v1/contracts/login.contract.js";
import { StatusCodes }          from "http-status-codes";
import mainConfig               from "@src/configs/main.config.js";
import fastifyPassport          from "@src/commons/fastifyPassport.js";
import redisMaps                from "@src/commons/redisMaps.js";
import redis                    from "@src/commons/redis.js";
import crypto                   from "node:crypto";
import IJwtPayload              from "@src/commons/IJwtPayload.js";
import { FastifyPluginAsyncJsonSchemaToTs }
                                from "@fastify/type-provider-json-schema-to-ts";

const loginEndpoint: FastifyPluginAsyncJsonSchemaToTs = async (app) => {

    app.post(
        "/login",
        {
            schema: loginEndpointContract,
            preValidation: fastifyPassport.authenticate("local"),
        },
        async (request, response) => {
            const { email, user_id, name } = request.user!;

            const jwtToken = app.jwt.sign(
                { user_id: user_id, } as IJwtPayload, {
                expiresIn: mainConfig.JWT_EXPIRES_IN
            });


            // delete old refresh token for current user.
            const oldRefreshToken = await redis.hGet(redisMaps.userId_refreshToken,
                                                    user_id.toString());

            if (oldRefreshToken) {
                await redis.hDel(redisMaps.refreshToken_userId, oldRefreshToken);
            }


            const refreshToken = crypto.randomBytes(32).toString("hex");

            // refresh_token:user_id map
            await redis.hSet(redisMaps.refreshToken_userId, refreshToken, user_id);
            await redis.hExpire(redisMaps.refreshToken_userId,
                                [refreshToken], mainConfig.REFRESH_TOKEN_EXPIRES_IN, "NX");

            // user_id:refresh_token map
            await redis.hSet(redisMaps.userId_refreshToken, user_id, refreshToken);
            await redis.hExpire(redisMaps.userId_refreshToken, [user_id.toString()],
                                mainConfig.REFRESH_TOKEN_EXPIRES_IN, "NX");

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