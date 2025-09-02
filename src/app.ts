import Fastify          from "fastify";
import fastifyEnv       from "@fastify/env";
import configOpts       from "./configs/config.js";
import addEndpoint      from "@src/routes/add.js";
import getEndpoint      from "@src/routes/get.js";
import sendEndpoint     from "@src/routes/send.js";
import registerEndpoint from "@src/routes/register.js";

const app = Fastify({
    logger: true,
});

// Register `app.config` first
await app.register(fastifyEnv, configOpts);

// Register routes
app.register(addEndpoint);
app.register(getEndpoint);
app.register(sendEndpoint);
app.register(registerEndpoint);

/* Health Check endpoint */
app.get("/", async (request, reply) => "Server is live!");

/**
 * Start the server!
 **/
app.listen(
    {
        port: app.config.CUR_SERVER_PORT,
        host: app.config.CUR_SERVER_HOST,
    },
    (err, addr) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        app.log.debug(`Server is running on http://localhost:${addr}`);
    }
);

export default app;