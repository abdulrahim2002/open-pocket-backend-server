import db   from "@src/db/index.js";
import { usersSchema } from "@src/db/schemas/users.schema.js";
import { StatusCodes } from "http-status-codes";
import { DrizzleQueryError, eq } from "drizzle-orm";
import { DatabaseError } from "pg-protocol";
import IDbControllerResponse, { OPSTATUS } from "@src/db/dbcontrollers/IDbControllerResponse.js";

type userShape = typeof usersSchema.$inferSelect;

async function readUser(uid: number): Promise<IDbControllerResponse<userShape>> {
    try {
        const foundUser = await db.select().from(usersSchema)
                                    .where(eq(usersSchema.uid, uid));

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
        // no useful information can be retrieved when error does not originate in pg driver
        if ( !(err instanceof DrizzleQueryError) || !(err.cause instanceof DatabaseError) ) {
            return {
                success: false,
                status: OPSTATUS.UNKNOWN_FAILURE,
                message: "Unknown Failure",
            }
        }

        // try to guess what went wrong?
        let     recommendedHttpResponseCode: number|undefined = undefined,
                message = "",
                originalError = err.cause,
                originalErrorCode = Number(originalError.code);

        switch (originalErrorCode) {
            case OPSTATUS.CONNECTION_DOES_NOT_EXIST: {
                recommendedHttpResponseCode = StatusCodes.SERVICE_UNAVAILABLE;
                message = "Database server unrechable";
                break;
            }
        }

        return {
            success: false,
            status: originalErrorCode || -1,
            message: message || "Unknown Failure",
            recommendedHttpResponseCode: recommendedHttpResponseCode,
        }
    }

}

export default readUser;