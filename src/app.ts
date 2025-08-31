import Fastify      from "fastify";
import mainConfig   from "@src/configs/main.config.js";
import addEndpoint  from "@src/routes/add.js";
import getEndpoint  from "@src/routes/get.js";
import sendEndpoint from "@src/routes/send.js";


const app = Fastify({
    logger: true,
});

app.register(addEndpoint);
app.register(getEndpoint);
app.register(sendEndpoint);



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
