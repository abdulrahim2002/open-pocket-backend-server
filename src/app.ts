import Fastify from "fastify";

const app = Fastify();

app.get("/", async (request, reply) => {
    return "Server is live!";
});

app.listen({port:7860, host: "0.0.0.0"}, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Server is running on http://localhost:7860");
});