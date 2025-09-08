/**
 * Implementation of a refresh token mechanism. The /refresh endpoint, takes in a refresh token
 * in the request body. It validates the refresh token against the databse, and generates a new
 * pair of authentication token and refresh token.
 *
 * A refresh token is actually just long random string. It should be difficult to brute force.
 * In the database, we just use a key value store. (this should typically be done with a dedicated
 * session store like redis or levelDB), but we can start simple.
 *
 * We can then query the store as follows: map[refreshtoken] ->
 * if no result, refresh token is bogus or expired
 * if this returns a { email, id } attributes. Then the user is indeed genuine (as long as the key
 * is difficult to guess).
 *
 * We generate a new jwt token using hte data above, and also a new refresh token. We then overwrite
 * as: map[newrefreshtoken] = { email, id }. and delete map[oldrefreshtoken];
 * this ensures that old refresh token is invalidated automatically.
 **/
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

            // try to find the user in the session store
            const oldRefreshToken = request.body.refresh_token;

            // TODO, we should also ask this user what is the user_id he is claiming
            // currently we just assume -> if he has the key -> userId for the key is his!
            // he might be bruteforcing.

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

            await redis.hSet(redisMaps.refreshToken_userId, newRefreshToken, userId);
            await redis.hExpire(redisMaps.refreshToken_userId, [newRefreshToken],
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