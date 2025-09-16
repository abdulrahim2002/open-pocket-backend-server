/**
 * @description Delete all tags which match the given `user_id` and `tag_name`
 */
import app              from "@src/app.js";
import db               from "@src/db/index.js";
import tagsSchema       from "@src/db/schemas/tags.schema.js";
import houndError       from "@src/commons/errorHounder.js";
import OPSTATUS         from "@src/commons/opstatus.js";
import IDbControllerResponse from "@src/commons/IDbControllerResponse.js";
import { StatusCodes }  from "http-status-codes";
import { eq, and }      from "drizzle-orm";

type tagShape = typeof tagsSchema.$inferSelect;

async function deleteTagByName(user_id: number, tag_name: string):
                Promise<IDbControllerResponse<tagShape[]>> {

    try {
        // see: https://orm.drizzle.team/docs/guides/conditional-filters-in-query
        const deletedTags = await db.delete(tagsSchema)
                                    .where(
                                        and(
                                            eq(tagsSchema.user_id, user_id),
                                            eq(tagsSchema.tag_name, tag_name)
                                        )
                                    )
                                    .returning();

        app.log.info(`${deletedTags.length} tags deleted successfully`);

        if (!deletedTags.length) {
            throw new Error("Maybe the tag didn't existed or somehting else went wrong!");
        }

        return {
            success: true,
            status: OPSTATUS.SUCCESS,
            message: "tag deleted successfully",
            recommendedHttpResponseCode: StatusCodes.OK,
            data: deletedTags,
        }
    }
    catch (error: any) {
        app.log.error(error);
        return houndError(error);
    }
}

export default deleteTagByName;
