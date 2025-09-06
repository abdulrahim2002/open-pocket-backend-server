import { Authenticator }    from "@fastify/passport";
import mainConfig           from "@src/configs/main.config.js";
import bcrypt               from "bcrypt";
import usersSchema          from "@src/db/schemas/users.schema.js";
import readUser             from "@src/db/dbcontrollers/users.readUser.js";

import { Strategy as LocalStrategy }             from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt }   from "passport-jwt";

const fastifyPassport = new Authenticator({
    // clearSessionIgnoreFields: add fields you do not want to be cleared in request.session
});

fastifyPassport.registerUserSerializer(
    async (user: typeof usersSchema.$inferSelect, request) => {
        return { use_id: user.user_id };
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
    async (jwtPayload: {id: number, email: string}, done) => {
        const resReadUser = await readUser(jwtPayload.id);

        if ( !resReadUser.success ) {
            return done(null, false);
        }

        return done(null, resReadUser.data);
    }
));

export default fastifyPassport;
