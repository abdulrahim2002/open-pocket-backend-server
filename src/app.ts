import Fastify          from "fastify";
import mainConfig       from "@src/configs/main.config.js";
import fastifyAuth      from "@fastify/auth";
import fastifyJwt       from "@fastify/jwt";
import addEndpoint      from "@src/api/v1/add.js";
import getEndpoint      from "@src/api/v1/get.js";
import sendEndpoint     from "@src/api/v1/send.js";
import registerEndpoint from "@src/api/v1/register.js";

const app = Fastify({
    logger: true,
});


// auth functionaly. TODO: remove hardcoded secret
app.register(fastifyAuth);
app.register(fastifyJwt, { secret: "some_secret_that_is_atleat_as_long" });

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
        port: mainConfig.CUR_SERVER_PORT,
        host: mainConfig.CUR_SERVER_HOST,
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