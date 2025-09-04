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

import refTokenMap                  from "@src/api/v1/commons/abstractStore.js";
import crypto                       from "node:crypto";
import mainConfig                   from "@src/configs/main.config.js";
import { StatusCodes }              from "http-status-codes";
import { FastifyPluginAsyncJsonSchemaToTs }
                                    from "@fastify/type-provider-json-schema-to-ts";


const refreshEndpoint: FastifyPluginAsyncJsonSchemaToTs = async (app) => {

    app.post(
        "/refresh",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        refresh_token: { type: "string" }
                    },
                    required: [ "refresh_token" ]
                }
            }
        },
        async (request, response) => {
            // try to find the user in the session store
            const oldrefreshtoken = request.body.refresh_token;
            if ( !refTokenMap.has(oldrefreshtoken) ) {
                // reject the request as unauthorized;
                response.status(StatusCodes.UNAUTHORIZED);
                return {
                    error: {
                        code: StatusCodes.UNAUTHORIZED,
                        message: "Unauthorized"
                    }
                }
            }

            const { user_id, email } = refTokenMap.get(oldrefreshtoken) as any;

            const jwtToken = app.jwt.sign({
                email: email,
                id: user_id,
                expiresIn: mainConfig.JWT_EXPIRES_IN
            });

            const newRefreshToken = crypto.randomBytes(32).toString("hex");
            refTokenMap.set(newRefreshToken, {
                user_id,
                email
            });

            // delete the old refresh token
            refTokenMap.delete(oldrefreshtoken);

            response.status(StatusCodes.OK);
            return {
                tokens: {
                    accessToken:    jwtToken,
                    refreshToken:   newRefreshToken,
                    tokenType:      "Bearer",
                }
            };

        }
    )

};

export default refreshEndpoint;