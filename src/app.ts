import Fastify          from "fastify";
import mainConfig       from "@src/configs/main.config.js";
import authentication   from "@src/commons/authentication.js";
import routesLoaderV1   from "@src/api/v1/index.js";
import cors             from "@fastify/cors";

const app = Fastify({
    trustProxy: true,
    logger: true,
});

// allow CORS
mainConfig.NODE_ENV === "development" && await app.register(cors, {
    origin: (origin, callback) => {
        // allow requests with no origin (Bruno, curl, server-to-server)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            // hard coded string origins
            "http://localhost:8080",
            // regex origin: GitHub Codespaces — match any port on the same codespace
            /^https:\/\/friendly-guacamole-5prg9qrx9wgfvgp5-\d+\.app\.github\.dev$/,
        ];
        
        const isAllowed = allowedOrigins.some(o => 
            typeof o === "string" ? o === origin : o.test(origin)
        );
        
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`), false);
        }
    },
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
