import app              from "@src/app.js";
import db               from "@src/db/index.js";
import tagsSchema       from "@src/db/schemas/tags.schema.js";
import houndError       from "@src/db/dbcontrollers/commons/errorHounder.js";
import OPSTATUS         from "@src/commons/opstatus.js";
import { StatusCodes }  from "http-status-codes";
import { eq }           from "drizzle-orm";
import IDbControllerResponse from "@src/commons/IDbControllerResponse.js";

type tagShape = typeof tagsSchema.$inferSelect;

async function deleteTag(tag_id: number): Promise<IDbControllerResponse<tagShape>> {
    try {
        const deletedTags = await db.delete(tagsSchema)
                                    .where(eq(tagsSchema.tag_id, tag_id)).returning();

        if ( deletedTags[0] === undefined ) {
            throw new Error("Unknown Failure"); // handled below
        }

        app.log.info(`tag with tag_id: ${deletedTags[0].tag_id} deleted successfully`);

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
