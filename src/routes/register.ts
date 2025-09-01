/**
 * The purpose of this file is to register the user. We shall retrieve the required
 * fields, and then insert the user into the database
**/

import type { FastifyInstance, FastifySchema } from "fastify";
import type { FastifyRequest } from "fastify";
import bcrypt from "bcrypt";

interface IRequestBody {
    name: string,
    email: string,
    password: string,
};

const registerRequestSchema: FastifySchema = {
    // request body
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
        },
        required: ['name', 'email', 'password']
    },
    // request headers
    headers: {
        type: 'object',
        properties: {
            'Content-Type': { type: 'string', enum: ['application/json'] },
        },
        required: ['Content-Type'],
    },
    // response schema
    response: {
        default: {
            type: 'object',
            properties: {
                error: { type: 'boolean', default: true }
            }
        },
        '2xx': {
            type: 'object',
            properties: {
                status: { type: 'integer', default: 1 }
            },
            required: ['status'],
        }
    },
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