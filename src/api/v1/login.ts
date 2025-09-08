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

            // find oldRefreshToken from user_id -> refresh_token mapping
            const oldRefreshToken = await redis.hGet(redisMaps.userId_refreshToken,
                                                    user_id.toString());

            // delete oldRefreshToken from refresh_token -> user_id mapping
            if (oldRefreshToken) {
                await redis.hDel(redisMaps.refreshToken_userId, oldRefreshToken);
            }

            // generate new refresh token
            const newRefreshToken = crypto.randomBytes(32).toString("hex");

            // update refresh_token -> user_id mapping
            await redis.hSet(redisMaps.refreshToken_userId, newRefreshToken, user_id);
            await redis.hExpire(redisMaps.refreshToken_userId,
                                [newRefreshToken], mainConfig.REFRESH_TOKEN_EXPIRES_IN, "NX");

            // update user_id -> refresh_token mapping
            await redis.hSet(redisMaps.userId_refreshToken, user_id, newRefreshToken);
            await redis.hExpire(redisMaps.userId_refreshToken, [user_id.toString()],
                                mainConfig.REFRESH_TOKEN_EXPIRES_IN, "NX");

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
                    refreshToken:   newRefreshToken,
                    tokenType:      "Bearer",
                }
            };
        }
    );
};

export default loginEndpoint;