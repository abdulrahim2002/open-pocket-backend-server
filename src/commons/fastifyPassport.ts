import { Authenticator }    from "@fastify/passport";
import mainConfig           from "@src/configs/main.config.js";
import bcrypt               from "bcrypt";
import usersSchema          from "@src/db/schemas/users.schema.js";
import readUser             from "@src/db/dbcontrollers/users.readUser.js";

import { Strategy as LocalStrategy }             from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt }   from "passport-jwt";

const fastifyPassport = new Authenticator();

// this function shall return a user_id, or something that can uniquely
// identify a user Here we will use: { user_id, email }; to allow both options
fastifyPassport.registerUserSerializer(
    async (user: typeof usersSchema.$inferSelect, request) => {
        return {
            // this is the identifier, used in deserializer below
            // TODO: define an interface for this
            user_id: user.user_id,
            email: user.email,
        }
    }
);

// turn you itentifier object into a user object.
fastifyPassport.registerUserDeserializer(
    async (identifier: any, request) => {
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

        const userInfoForSession = {
            user_id: resReadUser.data!.user_id,
            name: resReadUser.data!.name,
            email: resReadUser.data!.email,
        };

        // Note: userInfoForSession is what will get attached to `request.user` on successfull
        // authentication. Therefore, it is important that we do not supply sensitive information
        // TODO: Though I think `request.user` should not be stored in a session. So it should be fine
        return done(null, userInfoForSession);
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

        const userInfoForSession = {
            user_id: resReadUser.data!.user_id,
            name: resReadUser.data!.name,
            email: resReadUser.data!.email,
        }

        return done(null, userInfoForSession);
    }
));

export default fastifyPassport;
