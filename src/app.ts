import Fastify          from "fastify";
import mainConfig       from "@src/configs/main.config.js";
import authentication   from "@src/commons/authentication.js";
import routesLoaderV1   from "@src/api/v1/index.js";
import cors             from "@fastify/cors";

const app = Fastify({
    trustProxy: true,
    logger: true,
});

// allow CORS in "development" only. In "production", the frontend and
// backend shall be served from same origin
mainConfig.NODE_ENV === "development" && await app.register(cors, {
    origin: (_, cb) => cb(null, true),
    credentials: true,
    methods: ["GET", "POST"],
});

// authentication infrastructure
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
            process.exit(1);
        }
        app.log.debug(`Server is running on http://localhost:${addr}`);
    }
);

export default app;
