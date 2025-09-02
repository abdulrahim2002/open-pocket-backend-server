import app              from "@src/app.js";
import db               from "@src/db/index.js";
import usersSchema      from "@src/db/schemas/users.schema.js";
import houndError       from "@src/db/dbcontrollers/commons/errorHounder.js";
import { eq }           from "drizzle-orm";
import { StatusCodes }  from "http-status-codes";
import IDbControllerResponse, { OPSTATUS }
                        from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";

type userShape = typeof usersSchema.$inferSelect;

// define function signatures for email/id overloads
function readUser(user_id: number): Promise<IDbControllerResponse<userShape>>;
function readUser(email: string): Promise<IDbControllerResponse<userShape>>;

async function readUser(identifier: number|string): Promise<IDbControllerResponse<userShape>> {
    try {

        let foundUser;

        // find user by email or id depending on the input type
        if ( typeof identifier === "number" ) {
            foundUser = await db.select().from(usersSchema)
                                        .where( eq(usersSchema.user_id, identifier) );
        }
        else {
            foundUser = await db.select().from(usersSchema)
                                        .where( eq(usersSchema.email, identifier) );
        }

        if ( foundUser[0] === undefined ) {
            throw new Error("Unable to find the user");
        }

        return {
            success: true,
            status: OPSTATUS.SUCCESS,
            recommendedHttpResponseCode: StatusCodes.OK,
            message: "User retrieved successfully",
            data: foundUser[0],
        }

    }
    catch (err: any) {
        app.log.error(err);
        return houndError(err);
    }

}

export default readUser;