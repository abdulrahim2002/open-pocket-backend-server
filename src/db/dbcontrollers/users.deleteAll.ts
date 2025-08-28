/**
 * WARNING: deleteAll function would delete all rows in users table
 * It is intended for use in tests only.
 **/
import db   from "@src/db/index.js";
import { usersSchema } from "../schemas/users.schema.js";
import IDbControllerResponse, { OPSTATUS } from "./IDbControllerResponse.js";

async function deleteAll(): Promise<IDbControllerResponse<void>> {
    try {
        await db.delete(usersSchema);
        return {
            success: true,
            status: OPSTATUS.SUCCESS,
            message: "All rows deleted successfully for `users` table",
        }
    }
    catch (error) {
        return {
            success: false,
            status: OPSTATUS.UNKNOWN_FAILURE,
            message: "Something went wrong",
        }
    }
}

export default deleteAll;