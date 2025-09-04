import Fastify          from "fastify";
import mainConfig       from "@src/configs/main.config.js";
import fastifyAuth      from "@fastify/auth";
import addEndpoint      from "@src/api/v1/add.js";
import getEndpoint      from "@src/api/v1/get.js";
import sendEndpoint     from "@src/api/v1/send.js";
import registerEndpoint from "@src/api/v1/register.js";
import loginEndpoint    from "@src/api/v1/login.js";

const app = Fastify({
    logger: true,
});


// auth functionaly
app.register(fastifyAuth);

// register routes
app.register(addEndpoint);
app.register(getEndpoint);
app.register(sendEndpoint);
app.register(registerEndpoint);
app.register(loginEndpoint);

// health check endpoint
app.get("/", async (request, response) => "Server is live!");

// start the server
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
