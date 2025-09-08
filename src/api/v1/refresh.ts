import crypto           from "node:crypto";
import redisMaps        from "@src/commons/redisMaps.js";
import redis            from "@src/commons/redis.js";
import mainConfig       from "@src/configs/main.config.js";
import { StatusCodes }  from "http-status-codes";
import IJwtPayload      from "@src/commons/IJwtPayload.js";
import { FastifyPluginAsyncJsonSchemaToTs }
                        from "@fastify/type-provider-json-schema-to-ts";
import refreshEndpointContract
                        from "@src/api/v1/contracts/refresh.contract.js";


const refreshEndpoint: FastifyPluginAsyncJsonSchemaToTs = async (app) => {

    app.post(
        "/refresh",
        { schema: refreshEndpointContract },
        async (request, response) => {

            const oldRefreshToken = request.body.refresh_token;

            const userId = await redis.hGet(redisMaps.refreshToken_userId, oldRefreshToken);
            if ( !userId ) {
                // reject the request as unauthorized;
                response.status(StatusCodes.UNAUTHORIZED);
                return {
                    error: {
                        code: StatusCodes.UNAUTHORIZED,
                        message: "Unauthorized"
                    }
                }
            }

            // create a new jwt token
            const jwtToken = app.jwt.sign(
                { user_id: Number(userId) } as IJwtPayload, {
                expiresIn: mainConfig.JWT_EXPIRES_IN
            });

            // craete a new refresh token and store it in redis
            const newRefreshToken = crypto.randomBytes(32).toString("hex");

            // refresh_token:user_id map
            await redis.hSet(redisMaps.refreshToken_userId, newRefreshToken, userId);
            await redis.hExpire(redisMaps.refreshToken_userId, [newRefreshToken],
                                mainConfig.REFRESH_TOKEN_EXPIRES_IN, "NX");

            // user_id:refresh_token map
            await redis.hSet(redisMaps.userId_refreshToken, userId, newRefreshToken);
            await redis.hExpire(redisMaps.userId_refreshToken, [userId],
                                mainConfig.REFRESH_TOKEN_EXPIRES_IN, "NX");

            // delete the old refresh token
            await redis.hDel(redisMaps.refreshToken_userId, oldRefreshToken);

            response.status(StatusCodes.OK);
            return {
                tokens: {
                    accessToken:    jwtToken,
                    refreshToken:   newRefreshToken,
                    tokenType:      "Bearer",
                }
            };
        }

    );

};

export default refreshEndpoint;