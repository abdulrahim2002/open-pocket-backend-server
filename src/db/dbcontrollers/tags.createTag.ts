import db                   from "@src/db/index.js";
import app                  from "@src/app.js";
import tagsSchema           from "@src/db/schemas/tags.schema.js";
import { StatusCodes }      from "http-status-codes";
import houndError           from "@src/db/dbcontrollers/commons/errorHounder.js";
import OPSTATUS             from "@src/commons/opstatus.js";
import IDbControllerResponse from "@src/commons/IDbControllerResponse.js";

type tagInsertShape = typeof tagsSchema.$inferInsert;
type tagShape       = typeof tagsSchema.$inferSelect;

async function createTag(tag: tagInsertShape): Promise<IDbControllerResponse<tagShape>> {

    try {
        const res = await db.insert(tagsSchema).values(tag).returning();

        if (res[0] === undefined) {
            throw new Error("Unknown Failure"); // handle below
        }

        app.log.info(`tag created successfully with tag_id: ${res[0].tag_id}`);

        return {
            success: true,
            status: OPSTATUS.SUCCESS,
            message: `tag created successfully`,
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
