import db               from "@src/db/index.js";
import app              from "@src/app.js";
import { usersSchema }  from "@src/db/schemas/users.schema.js";
import { eq }           from "drizzle-orm";
import { StatusCodes }  from "http-status-codes";
import { houndError }   from "./commons/errorHounder.js";
import IDbControllerResponse, { OPSTATUS }
                        from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";

type userShape = typeof usersSchema.$inferSelect;

async function deleteUser(user_id: number): Promise<IDbControllerResponse<userShape>> {
    try {
        const deletedUser = await db.delete(usersSchema)
                                    .where( eq(usersSchema.user_id, user_id) ).returning();

        // this is dangerous, because this is returned even when the database server is unavailable
        // TODO:
        if ( deletedUser[0] === undefined ) {
            throw new Error("Unknown Failure");
        }

        return {
            success: true,
            status: OPSTATUS.SUCCESS,
            message: `Deleted User with user_id: ${user_id} successfully`,
            recommendedHttpResponseCode: StatusCodes.OK,
            data: deletedUser[0],
        }
    }
    catch (error: any) {
        app.log.error(error);
        return houndError(error);
    }
}

export default deleteUser;