import db   from "@src/db/index.js";
import { usersSchema } from "@src/db/schemas/users.schema.js";
import { DrizzleQueryError, eq } from "drizzle-orm";
import IDbControllerResponse, { OPSTATUS } from "./IDbControllerResponse.js";
import { StatusCodes } from "http-status-codes";
import { DatabaseError } from "pg-protocol";

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
        if ( !(error instanceof DrizzleQueryError) || !(error.cause instanceof DatabaseError) ) {
            return {
                success: false,
                status: OPSTATUS.UNKNOWN_FAILURE,
                message: "Unknown Failure",
            }
        }

        let     recommendedHttpResponseCode: number|undefined = undefined,
                message = "",
                originalError: DatabaseError = error.cause,
                originalErrorCode: number = Number(originalError.code);

        switch (originalErrorCode) {
            case OPSTATUS.CONNECTION_DOES_NOT_EXIST: {
                recommendedHttpResponseCode = StatusCodes.SERVICE_UNAVAILABLE;
                message = "Database Server is unreachable at the time";
                break;
            }
            case OPSTATUS.CONNECTION_FAILURE: {
                recommendedHttpResponseCode = StatusCodes.SERVICE_UNAVAILABLE;
                message = "Database Server is unreachable at the time, try again later";
            }
        }

        return {
            success: false,
            status: originalErrorCode,
            message: message,
            recommendedHttpResponseCode: recommendedHttpResponseCode,
        }
    }
}

export default deleteUser;