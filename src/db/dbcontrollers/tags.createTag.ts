import db              from "@src/db/index.js";
import app             from "@src/app.js";
import { tagsSchema }  from "@src/db/schemas/tags.schema.js";
import { StatusCodes } from "http-status-codes";
import IDbControllerResponse, { OPSTATUS } from "@src/db/dbcontrollers/IDbControllerResponse.js";
import { DrizzleQueryError } from "drizzle-orm";
import { DatabaseError }     from "pg-protocol";

type tagInsertShape = typeof tagsSchema.$inferInsert;
type tagShape       = typeof tagsSchema.$inferSelect;

async function createTag(tag: tagInsertShape): Promise<IDbControllerResponse<tagShape>> {

    try {
        const res = await db.insert(tagsSchema).values(tag);

        if (res[0] === undefined) {
            throw new Error("Unknown Failure"); // handle below
        }

        return {
            success: true,
            status: OPSTATUS.SUCCESS,
            message: `tag create successfully`,
            recommendedHttpResponseCode: StatusCodes.CREATED,
            data: res[0],
        }
    }

    catch (error) {
        app.log.error(error);

        if ( !(error instanceof DrizzleQueryError) || !(error.cause instanceof DatabaseError) ) {
            return {
                success: false,
                status: OPSTATUS.UNKNOWN_FAILURE,
                message: "Unknown Failure",
            }
        }

        let     recommendedHttpResponseCode: number|undefined = undefined,
                message = "",
                originalErrorCode = Number(error.cause.code);

        switch (originalErrorCode) {
            case OPSTATUS.FOREIGN_KEY_VIOLATION: {
                recommendedHttpResponseCode = StatusCodes.BAD_REQUEST;
                message = "You probably tried to insert a tag with non existant user_id or article_id";
                break;
            }
            case OPSTATUS.CONNECTION_FAILURE: {
                recommendedHttpResponseCode = StatusCodes.SERVICE_UNAVAILABLE;
                message = "Database Server is probably down. Please try again later";
                break;
            }
            case OPSTATUS.UNIQUE_VIOLATION: {
                recommendedHttpResponseCode=  StatusCodes.CONFLICT;
                message = "You probably tried inserting a duplicate record";
                break;
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

export default createTag;