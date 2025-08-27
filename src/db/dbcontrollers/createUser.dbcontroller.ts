import db              from "@src/db/index.js";
import app             from "@src/app.js";
import { usersSchema } from "@src/db/schemas/users.schema.js";
import { StatusCodes } from "http-status-codes";
import { DrizzleQueryError } from "drizzle-orm";
// TODO: Remove dependency on pg-protocol since it is not mentioned in dependencies
import { DatabaseError }     from "pg-protocol";
import IDbControllerResponse, { OPSTATUS } from "@src/db/dbcontrollers/IDbControllerResponse.js";

type UserInsertShape = typeof usersSchema.$inferInsert;
type UserShape       = typeof usersSchema.$inferSelect;

async function createUser(user: UserInsertShape): Promise<IDbControllerResponse<UserShape>> {

    try {
        const insertedUser = await db.insert(usersSchema).values(user).returning();

        if ( insertedUser[0] === undefined ) {
            throw new Error("Unknown Error"); // handled below
        }

        app.log.info(`User created successfully with uid: ${insertedUser[0].uid}`);

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

        // if error has not originated from pg driver, no useful information can be extracted
        if ( !(err instanceof DrizzleQueryError) || !(err.cause instanceof DatabaseError) ) {
            return {
                success: false,
                status: OPSTATUS.UNKNOWN_FAILURE,
                message: "Unknown Failure"
            }
        }

        let recommendedHttpResponseCode: number|undefined = undefined,
            message = "",
            originalError: DatabaseError = err.cause,
            errCode: number = Number(originalError.code);
        
        // try to find out what went wrong?
        switch (errCode) {

            case OPSTATUS.UNIQUE_VIOLATION: {
                recommendedHttpResponseCode = StatusCodes.CONFLICT;
                message = "User already exists";
                break;
            }
            case OPSTATUS.CONNECTION_FAILURE: {
                recommendedHttpResponseCode = StatusCodes.INTERNAL_SERVER_ERROR;
                message = "Broken connection to database server";
                break;
            }
        }

        return {
            success: false,
            status: errCode,
            recommendedHttpResponseCode: recommendedHttpResponseCode || StatusCodes.INTERNAL_SERVER_ERROR,
            message: message || "Unknown Failure",
        }
    }
}

export default createUser;