import registerEndpointContract from "@src/api/v1/contracts/register.contract.js";
import usersSchema              from "@src/db/schemas/users.schema.js";
import createUser               from "@src/db/dbcontrollers/users.createUser.js";
import bcrypt                   from "bcrypt";
import { StatusCodes }          from "http-status-codes";
import { FastifyPluginAsyncJsonSchemaToTs }
                                from "@fastify/type-provider-json-schema-to-ts";

const registerEndpoint: FastifyPluginAsyncJsonSchemaToTs = async function (app) {

    app.post(
        "/register",
        {schema: registerEndpointContract},
        async (request, reply) => {

            const { name, email, password } = request.body;
            const hashed_password = await bcrypt.hash(password, 3);

            const newUser: typeof usersSchema.$inferInsert = {
                name: name,
                email: email,
                hashed_password: hashed_password,
            };

            const resCreateUser = await createUser(newUser);

            if (resCreateUser.success) {
                reply.status(StatusCodes.CREATED);
                return {
                    data: {
                        type: "users",
                        id: String(resCreateUser.data!.user_id),
                        attributes: {
                            name: resCreateUser.data!.name,
                            email: resCreateUser.data!.email
                        }

                    }
                }
            }

            const   errorStatusCode = resCreateUser.recommendedHttpResponseCode
                                        ?? StatusCodes.INTERNAL_SERVER_ERROR,
                    message = resCreateUser.message
                                ?? "Something Went Wrong, please try again later";

            reply.status(errorStatusCode);
            return {
                error: {
                    code: errorStatusCode,
                    message: message,
                }
            }
        }

    );
};

export default registerEndpoint;