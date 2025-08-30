import app              from "@src/app.js";
import db               from "@src/db/index.js";
import usersSchema      from "@src/db/schemas/users.schema.js";
import { houndError }   from "@src/db/dbcontrollers/commons/errorHounder.js";
import { eq }           from "drizzle-orm";
import { StatusCodes }  from "http-status-codes";
import IDbControllerResponse, { OPSTATUS }
                        from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";

type userShape = typeof usersSchema.$inferSelect;

async function readUser(user_id: number): Promise<IDbControllerResponse<userShape>> {
    try {
        const foundUser = await db.select().from(usersSchema)
                                    .where(eq(usersSchema.user_id, user_id));

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