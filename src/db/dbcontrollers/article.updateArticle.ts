import db               from "@src/db/index.js";
import app              from "@src/app.js";
import { eq }           from "drizzle-orm";
import articlesSchema   from "@src/db/schemas/articles.schema.js";
import { StatusCodes }  from "http-status-codes";
import houndError       from "@src/commons/houndError.js";
import IDbControllerResponse from "@src/commons/IDbControllerResponse.js";
import OPSTATUS         from "@src/commons/opstatus.js";

// only status and favorite can be updated by external users
type IArticleUpdateObj = Pick<typeof articlesSchema.$inferInsert, "status" | "favorite">;

async function updateArticle(item_id: bigint,  updateObj: IArticleUpdateObj):
                Promise<IDbControllerResponse<typeof articlesSchema.$inferSelect>> {


    try {
        const resUpdateArticle = await  db.update(articlesSchema)
                                        .set({
                                            ...updateObj,
                                            time_updated: new Date(),
                                        })
                                        .where( eq(articlesSchema.item_id, item_id) )
                                        .returning();

        app.log.info(`Article updated with id: ${item_id}`);

        if (!resUpdateArticle.length) {
            // most likely the article does not exist. Return error
            throw new Error("Unknown failure during article update");
        }

        return {
            success:        true,
            status:         OPSTATUS.SUCCESS,
            recommendedHttpResponseCode: StatusCodes.OK,
            message:       `Article updated with id: ${item_id}`,
            data:           resUpdateArticle[0]!,
        }

    }
    catch (error: any) {
        app.log.error(error);
        return houndError(error);
    }
}

export default updateArticle;
