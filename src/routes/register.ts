/**
 * The purpose of this file is to register the user. We shall retrieve the required
 * fields, and then insert the user into the database
**/
import registerRequestSchema    from "@src/routes/schemas/register.schema.js";
import type { FastifyInstance } from "fastify";
import type { FastifyRequest }  from "fastify";
import bcrypt from "bcrypt";

interface IRequestBody {
    name: string,
    email: string,
    password: string,
};

async function registerEndpoint( app: FastifyInstance ) {
    app.post(
        "/register",
        { schema: registerRequestSchema },
        async (request: FastifyRequest<{Body: IRequestBody}>, reply) => {

        const { name, email, password } = request.body;

        app.log.info(`name: ${name}`);
        app.log.info(`email: ${email}`);
        app.log.info(`password: ${password}`);

        // hash the password
        const hashed_password: string = await bcrypt.hash(password, 8);
        app.log.info(`hashed_password: ${hashed_password}`);

        // send a dummy response
        return {
            status: 1,
        }
    })
}

export default registerEndpoint;