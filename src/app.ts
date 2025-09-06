import Fastify          from "fastify";
import mainConfig       from "@src/configs/main.config.js";
import authentication   from "@src/commons/authentication.js";
import routesLoaderV1   from "@src/api/v1/index.js";
import redis            from "@src/commons/redis.js";

const app = Fastify({
    logger: true,
});


app.register(authentication);

// register routes
app.register(routesLoaderV1, { prefix: "/api/v1" });

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
            redis.destroy();
            process.exit(1);
        }
        app.log.debug(`Server is running on http://localhost:${addr}`);
    }
);

export default app;
