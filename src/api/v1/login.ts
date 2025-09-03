import loginEndpointContract        from "@src/api/v1/contracts/login.contract.js";
import readUser                     from "@src/db/dbcontrollers/users.readUser.js";
import { StatusCodes }              from "http-status-codes";
import bcrypt                       from "bcrypt";
import mainConfig                   from "@src/configs/main.config.js";
import { FastifyPluginAsyncJsonSchemaToTs }
                                    from "@fastify/type-provider-json-schema-to-ts"

const loginEndpoint: FastifyPluginAsyncJsonSchemaToTs = async (app) => {

    app.post(
        "/login",
        {schema: loginEndpointContract},
        async (request, response) => {

            const { email, password } = request.body;

            const resReadUser = await readUser(email);

            if ( !resReadUser.success || !resReadUser.data!.hashed_password ) {
                // user does not exist or something else went wrong
                // TODO: segregate these 2 issues
                response.status(StatusCodes.UNAUTHORIZED);
                return {
                    error: {
                        code: StatusCodes.UNAUTHORIZED,
                        message: "Invalid email or password!"
                    }
                }
            }

            const hashed_password_from_db = resReadUser.data!.hashed_password;
            if ( (!await bcrypt.compare(password, hashed_password_from_db)) ) {
                response.status(StatusCodes.UNAUTHORIZED);
                return {
                    error: {
                        code: StatusCodes.UNAUTHORIZED,
                        message: "Invalid email or password!"
                    }
                }
            }

            const jwtToken = app.jwt.sign({
                email: email,
                id: resReadUser.data!.user_id,
                expiresIn: mainConfig.JWT_EXPIRES_IN
            });

            response.status(StatusCodes.OK);
            return {
                data: {
                    type: "users",
                    id: String(resReadUser.data!.user_id),
                    attributes: {
                        name: resReadUser.data!.name,
                        email: resReadUser.data!.email
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