/**
 * The purpose of this file is, once an error occurs within a dbcontroller.
 * And is caught by the top level try-catch block (within drizzle-session
 * layer). Then, it becomes the responsibility of this file to find out the
 * actual cause of the error and populate the relevant fields in IDbController
 * interface.
 **/
import { DrizzleQueryError } from "drizzle-orm";
import { DatabaseError }     from "pg-protocol";
import { StatusCodes } from "http-status-codes";
import IDbControllerResponse, { OPSTATUS }
            from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";

export function houndError(error: Error): IDbControllerResponse<any> {

    if ( !(error instanceof DrizzleQueryError) || !(error.cause instanceof DatabaseError) ) {
        return {
            success: false,
            status: OPSTATUS.UNKNOWN_FAILURE,
            message: "Unknown Failure",
        }
    }

    let recommendedHttpResponseCode: number|undefined = undefined,
        message = "",
        originalErrorCode = Number(error.cause.code);

    // try to find out what went wrong?
    switch (originalErrorCode) {

        case OPSTATUS.UNIQUE_VIOLATION: {
            recommendedHttpResponseCode = StatusCodes.CONFLICT;
            message = "User already exists";
            break;
        }
        case OPSTATUS.CONNECTION_FAILURE: {
            recommendedHttpResponseCode = StatusCodes.SERVICE_UNAVAILABLE;
            message = "Broken connection to database server";
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