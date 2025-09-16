/**
 * The purpose of this file is, once an error occurs within a dbcontroller.
 * And is caught by the top level try-catch block (within drizzle-session
 * layer). Then, it becomes the responsibility of this file to find out the
 * actual cause of the error and populate the relevant fields in IDbController
 * interface.
 **/
import { DrizzleQueryError } from "drizzle-orm";
import { DatabaseError }     from "pg-protocol";
import { StatusCodes }       from "http-status-codes";
import OPSTATUS              from "@src/commons/opstatus.js";
import IDbControllerResponse from "@src/commons/IDbControllerResponse.js";

export default function houndError(error: Error): IDbControllerResponse<any> {

    if ( !(error instanceof DrizzleQueryError) || !(error.cause instanceof DatabaseError) ) {
        return {
            success: false,
            status: OPSTATUS.UNKNOWN_FAILURE,
            message: "Unknown Failure",
        }
    }

    // TODO: the originalErrorCode is not always an integer
    let recommendedHttpResponseCode: number|undefined = undefined,
        message = "",
        originalErrorCode = Number(error.cause.code);

    // try to find out what went wrong?
    switch (originalErrorCode) {

        case OPSTATUS.UNIQUE_VIOLATION: {
            recommendedHttpResponseCode = StatusCodes.CONFLICT;
            message = "You probably tried to insert a duplicate record";
            break;
        }
        case OPSTATUS.CONNECTION_FAILURE: {
            recommendedHttpResponseCode = StatusCodes.SERVICE_UNAVAILABLE;
            message = "Database Server is probably down. Please try again later";
            break;
        }
        case OPSTATUS.FOREIGN_KEY_VIOLATION: {
            recommendedHttpResponseCode = StatusCodes.BAD_REQUEST;
            message = "Foreign Key Violation: The operation failed because the referenced value " +
                    "in the parent table does not exist. Please ensure that the foreign key being " +
                    "referenced points to a valid record in the parent table. If you're trying to " +
                    "delete or update records, double-check that there are no dependent rows in the child table";
            break;
        }
    }

    return {
        success: false,
        status: originalErrorCode || OPSTATUS.UNKNOWN_FAILURE,
        recommendedHttpResponseCode: recommendedHttpResponseCode,
        message: message || "Unknown Failure",
    }
}
