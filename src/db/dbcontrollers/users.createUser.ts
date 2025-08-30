import db               from "@src/db/index.js";
import app              from "@src/app.js";
import { usersSchema }  from "@src/db/schemas/users.schema.js";
import { StatusCodes }  from "http-status-codes";
import { houndError }   from "./commons/errorHounder.js";
import IDbControllerResponse, { OPSTATUS }
                        from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";

type UserInsertShape = typeof usersSchema.$inferInsert;
type UserShape       = typeof usersSchema.$inferSelect;

async function createUser(user: UserInsertShape): Promise<IDbControllerResponse<UserShape>> {

    try {
        const insertedUser = await db.insert(usersSchema).values(user).returning();

        if ( insertedUser[0] === undefined ) {
            throw new Error("Unknown Failure"); // handled below
        }

        app.log.info(`User created successfully with user_id: ${insertedUser[0].user_id}`);

        return {
            success: true,
            status: OPSTATUS.SUCCESS,
            message: "User created successfully",
            recommendedHttpResponseCode: StatusCodes.CREATED,
            data: insertedUser[0],
        }
    }
    catch (err: any) {
        app.log.error(err);
        return houndError(err);
    }
}

export default createUser;