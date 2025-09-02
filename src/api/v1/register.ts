import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import bcrypt                       from "bcrypt";
import createUser                   from "@src/db/dbcontrollers/users.createUser.js";
import registerEndpointContract     from "./contracts/register.contract.js";

const registerEndpoint: FastifyPluginAsyncJsonSchemaToTs = async function (app) {
    app.post(
        "/register",
        {schema: registerEndpointContract},
        async (request, reply) => {

        const { name, email, password } = request.body;
        app.log.info(`user received with name: ${name}, email: ${email}`);

        // hash the password
        const hashed_password: string = await bcrypt.hash(password, 8);

        const resCreateUser = await createUser({
            name: name,
            email: email,
            hashed_password: hashed_password,
        });

        if ( resCreateUser.success ) {
            reply.statusCode = resCreateUser.recommendedHttpResponseCode || 200;
            return {
                status: 1,
                message: "Created Successfully",
            }
        }
        else {
            reply.statusCode = resCreateUser.recommendedHttpResponseCode || 400;
            return {
                error: true,
            }
        }
    });
}

export default registerEndpoint;