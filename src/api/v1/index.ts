import addEndpoint      from "@src/api/v1/add.js";
import getEndpoint      from "@src/api/v1/get.js";
import sendEndpoint     from "@src/api/v1/send.js";

import loginEndpoint    from "@src/api/v1/login.js";
import logoutEndpoint   from "@src/api/v1/logout.js";
import refreshEndpoint  from "@src/api/v1/refresh.js";
import registerEndpoint from "@src/api/v1/register.js";

import { FastifyInstance } from "fastify";

async function routesLoader(app: FastifyInstance) {
    app.register(addEndpoint);
    app.register(getEndpoint);
    app.register(sendEndpoint);
    app.register(loginEndpoint);
    app.register(logoutEndpoint);
    app.register(refreshEndpoint);
    app.register(registerEndpoint);
}

export default routesLoader;
