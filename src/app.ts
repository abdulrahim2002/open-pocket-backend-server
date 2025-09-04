import Fastify          from "fastify";
import mainConfig       from "@src/configs/main.config.js";
import addEndpoint      from "@src/api/v1/add.js";
import getEndpoint      from "@src/api/v1/get.js";
import sendEndpoint     from "@src/api/v1/send.js";
import registerEndpoint from "@src/api/v1/register.js";
import loginEndpoint    from "@src/api/v1/login.js";
import usersSchema      from "@src/db/schemas/users.schema.js";
import readUser         from "@src/db/dbcontrollers/users.readUser.js";
import { Authenticator }
                        from "@fastify/passport";
import fastifySecureSession
                        from "@fastify/secure-session";
import { Strategy as LocalStrategy }
                        from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt }
                        from "passport-jwt";
import fastifyJwt       from "@fastify/jwt";
import bcrypt           from "bcrypt";

const app = Fastify({
    logger: true,
});

app.register(fastifyJwt, {
    secret: mainConfig.JWT_GENERATION_SECRET,
    decoratorName: ""   // TODO: body fastifyJwt and passport-jwt try to
                        // decorate request with `user` object creating conflict
});

// TODO: this file is getting fatter. Turn relevant things into plugins
const fastifyPassport = new Authenticator();

fastifyPassport.use(new LocalStrategy(
    {
        usernameField: "email",     // we ask user for email not username
        passwordField: "password",
    },
    async (email, password, done) => {
        const resReadUser = await readUser(email);

        if ( !resReadUser.success ) {
            // TODO: when no user is retrieved and when an error occured
            // these cases should return differently. For this to happen
            // we need to stop throwing an error if user is not found
            return done(null, false); // password wrong case.
        }

        const hashed_password_from_db = resReadUser.data!.hashed_password;
        if ( (!await bcrypt.compare(password, hashed_password_from_db!)) ) {
            return done(null, false);
        }

        return done(null, resReadUser.data);
    }
));

/**
 * This function shall return a user_id, or something that can uniquely identify a user
 * Here we will use: { user_id, email }; to allow both options.
**/
fastifyPassport.registerUserSerializer(
    async (user: typeof usersSchema.$inferSelect, request) => {
        // this is the identifier
        // TODO: define an interface for this
        return {
            user_id: user.user_id,
            email: user.email,
        }
    }
);

/**
 * This function does the opposite of the above. It takes your identifier (in our case
 * its {user_id, email} and returns a user object.
 * Note: This will polulate request.user with user object returned here!
**/
fastifyPassport.registerUserDeserializer(
    async (identifierObj: any, request) => {
        const { user_id } = identifierObj;
        const resReadUser = await readUser(user_id);
        if (!resReadUser.success) {
            return null;
        }

        return resReadUser.data;
    }
);


// add support for jwt tokens
fastifyPassport.use(new JwtStrategy(
    {
        secretOrKey: mainConfig.JWT_GENERATION_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (jwtPayload, done) => {
        const { id } = jwtPayload; // { id, email }

        const resReadUser = await readUser(id);

        if ( !resReadUser.success ) {
            return done(null, false); // TODO: currently we return wrong jwt token
                                    // but maybe some error was thrown. On which another response
                                    // should be send
        }

        return done(null, resReadUser.data);
    }
));

// auth functionality
app.register(fastifySecureSession, { key: mainConfig.SECURE_SESSION_KEY });
app.register(fastifyPassport.initialize());
app.register(fastifyPassport.secureSession());


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
export { fastifyPassport };
