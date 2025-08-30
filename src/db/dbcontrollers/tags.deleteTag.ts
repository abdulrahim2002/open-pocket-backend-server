import app              from "@src/app.js";
import db               from "@src/db/index.js";
import tagsSchema       from "@src/db/schemas/tags.schema.js";
import { StatusCodes }  from "http-status-codes";
import { eq }           from "drizzle-orm";
import houndError       from "./commons/errorHounder.js";
import IDbControllerResponse, { OPSTATUS }
                        from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";

type tagShape = typeof tagsSchema.$inferSelect;

async function deleteTag(tag_id: number): Promise<IDbControllerResponse<tagShape>> {
    try {
        const deletedTags = await db.delete(tagsSchema)
                                    .where(eq(tagsSchema.tag_id, tag_id)).returning();

        if ( deletedTags[0] === undefined ) {
            throw new Error("Unknown Failure"); // handled below
        }

        return {
            success: true,
            status: OPSTATUS.SUCCESS,
            message: "tag deleted successfully",
            recommendedHttpResponseCode: StatusCodes.OK,
            data: deletedTags[0],
        }
    }
    catch (error: any) {
        app.log.error(error);
        return houndError(error);
    }
}

export default deleteTag;