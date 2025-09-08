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
                response.status(StatusCodes.UNAUTHORIZED);
                return {
                    error: {
                        code: StatusCodes.UNAUTHORIZED,
                        message: "Invalid Refresh Token"
                    }
                }
            }

            const jwtToken = app.jwt.sign(
                { user_id: Number(userId) } as IJwtPayload, {
                expiresIn: mainConfig.JWT_EXPIRES_IN
            });

            const newRefreshToken = crypto.randomBytes(32).toString("hex");

            // update refresh_token -> user_id mapping
            await redis.hSet(redisMaps.refreshToken_userId, newRefreshToken, userId);
            await redis.hExpire(redisMaps.refreshToken_userId, [newRefreshToken],
                                mainConfig.REFRESH_TOKEN_EXPIRES_IN, "NX");

            // update user_id -> refresh_token mapping
            await redis.hSet(redisMaps.userId_refreshToken, userId, newRefreshToken);
            await redis.hExpire(redisMaps.userId_refreshToken, [userId],
                                mainConfig.REFRESH_TOKEN_EXPIRES_IN, "NX");

            // delete oldRefreshToken from refresh_token -> user_id mapping
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
