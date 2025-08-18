import Fastify, { type FastifySchema } from "fastify";
import addEndpoint from "./routes/add";
import getEndpoint from "./routes/get";
import sendEndpoint from "./routes/send";

const app = Fastify({
    logger: true,
});

app.register(addEndpoint);
app.register(getEndpoint);
app.register(sendEndpoint);



/* Health Check endpoint */
app.get("/", async (request, reply) => {
    return "Server is live!";
});

/**
 * Start the server!
 **/
app.listen({port:7860, host: "0.0.0.0"}, (err, addr) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.debug(`Server is running on http://localhost:${addr}`);
});
