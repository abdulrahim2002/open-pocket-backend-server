import fp                   from "fastify-plugin";
import { FastifyInstance }  from "fastify";
import mainConfig           from "@src/configs/main.config.js";
import fastifyPassport      from "@src/commons/fastifyPassport.js";
import fastifySecureSession from "@fastify/secure-session";
import fastifyJwt           from "@fastify/jwt";

async function authentication(app: FastifyInstance) {

    app.register(fastifySecureSession, {
        key: Buffer.from(mainConfig.SECURE_SESSION_KEY, "hex"),
        // TODO: add expiry option
    });

    app.register(fastifyJwt, {
        secret: mainConfig.JWT_GENERATION_SECRET,
        decoratorName: "",  // both fastifyJwt and passport-jwt try to decorate
                            // request with `user` object creating conflict
    });

    app.register(fastifyPassport.initialize());
    app.register(fastifyPassport.secureSession());
}

export default fp(authentication);