/**
 * @description Delete all tags which match the given `user_id` and `item_id` along
 * with `tag_name` in provided list of tags
 */
import app              from "@src/app.js";
import db               from "@src/db/index.js";
import tagsSchema       from "@src/db/schemas/tags.schema.js";
import houndError       from "@src/commons/houndError.js";
import OPSTATUS         from "@src/commons/opstatus.js";
import { StatusCodes }  from "http-status-codes";
import IDbControllerResponse from "@src/commons/IDbControllerResponse.js";
import { eq, and, inArray }  from "drizzle-orm";

type tagShape = typeof tagsSchema.$inferSelect;

async function deleteTags(item_id: bigint, user_id: number, tags?: string[]):
                Promise<IDbControllerResponse<tagShape[]>> {

    try {
        // see: https://orm.drizzle.team/docs/guides/conditional-filters-in-query
        const deletedTags = await db.delete(tagsSchema)
                                    .where(
                                        and(
                                            eq(tagsSchema.item_id, item_id),
                                            eq(tagsSchema.user_id, user_id),
                                            tags ? inArray(tagsSchema.tag_name, tags) : undefined
                                        )
                                    )
                                    .returning();

        app.log.info(`${deletedTags.length} tags deleted successfully`);

        return {
            success: true,
            status: OPSTATUS.SUCCESS,
            message: "tags deleted successfully",
            recommendedHttpResponseCode: StatusCodes.OK,
            data: deletedTags,
        }
    }
    catch (error: any) {
        app.log.error(error);
        return houndError(error);
    }
}

export default deleteTags;
