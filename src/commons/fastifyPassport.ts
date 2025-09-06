import { Authenticator }    from "@fastify/passport";
import { FastifyRequest }   from "fastify";
import mainConfig           from "@src/configs/main.config.js";
import bcrypt               from "bcrypt";
import usersSchema          from "@src/db/schemas/users.schema.js";
import readUser             from "@src/db/dbcontrollers/users.readUser.js";

import { Strategy as LocalStrategy }             from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt }   from "passport-jwt";
import { Strategy as SecureSessionStrategy }     from "passport-custom";

const fastifyPassport = new Authenticator({
    // clearSessionIgnoreFields: add fields you do not want to be cleared in request.session
});

fastifyPassport.registerUserSerializer(
    async (user: typeof usersSchema.$inferSelect, request) => {
        return { user_id: user.user_id };
    }
);

fastifyPassport.registerUserDeserializer(
    async (identifier: {user_id: number}, request) => {
        const resReadUser = await readUser(identifier.user_id);
        return (resReadUser.success) ? resReadUser.data : null;
    }
);

// local strategy
fastifyPassport.use(new LocalStrategy(
    {
        usernameField: "email",     // we ask user for email not username
        passwordField: "password",
    },
    async (email, password, done) => {
        const resReadUser = await readUser(email);

        if ( !resReadUser.success ) {
            return done(null, false);
        }

        const hashed_password_from_db = resReadUser.data!.hashed_password;
        if ( (!await bcrypt.compare(password, hashed_password_from_db!)) ) {
            return done(null, false);
        }

        return done(null, resReadUser.data);
    }
));

// jwt strategy
fastifyPassport.use(new JwtStrategy(
    {
        secretOrKey: mainConfig.JWT_GENERATION_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (jwtPayload: { user_id: number }, done) => {
        const resReadUser = await readUser(jwtPayload.user_id);

        if ( !resReadUser.success ) {
            return done(null, false);
        }

        return done(null, resReadUser.data);
    }
));

// if client comes with encrypted cookie set by fastify/secure-session
// use it to determine weather user is already authenticated
fastifyPassport.use("secure-session", new SecureSessionStrategy(
    async (req: any, done) => {

        // req is incorrectly typed
        const request = req as FastifyRequest;

        const userId: number = request.session.get("passport")?.user_id;
        if ( !userId ) {
            return done(null, false);
        }

        const resReadUser = await readUser(userId);
        if (!resReadUser.success) {
            request.session.delete();
            return done(null, false);
        }

        return done(null, resReadUser.data);
    }
));

// TODO: note that `request.logout` will destroy `request.sesison` requiring
// client to reauthenticate. Hence, implemnt a `/logout` endpoint doing exactly
// this

export default fastifyPassport;
