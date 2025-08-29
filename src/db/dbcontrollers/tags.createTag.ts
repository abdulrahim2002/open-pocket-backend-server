import db              from "@src/db/index.js";
import app             from "@src/app.js";
import { tagsSchema }  from "@src/db/schemas/tags.schema.js";
import { StatusCodes } from "http-status-codes";
import { houndError }  from "./commons/errorHounder.js";
import IDbControllerResponse, { OPSTATUS }
                       from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";

type tagInsertShape = typeof tagsSchema.$inferInsert;
type tagShape       = typeof tagsSchema.$inferSelect;

async function createTag(tag: tagInsertShape): Promise<IDbControllerResponse<tagShape>> {

    try {
        const res = await db.insert(tagsSchema).values(tag).returning();

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

    catch (error: any) {
        app.log.error(error);
        return houndError(error);
    }
}

export default createTag;