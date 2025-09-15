/**
 * WARNING: deleteAll function would delete all rows in users table
 * It is intended for use in tests only. Do not expose this through
 * any API endpoint
 **/
import db               from "@src/db/index.js";
import usersSchema      from "@src/db/schemas/users.schema.js";
import OPSTATUS         from "@src/commons/opstatus.js";
import IDbControllerResponse from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";

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
            message: "Cannot delete all users. Something went wrong!",
        }
    }
}

export default deleteAll;
