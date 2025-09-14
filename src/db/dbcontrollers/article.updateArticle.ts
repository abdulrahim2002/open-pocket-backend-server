import db               from "@src/db/index.js";
import app              from "@src/app.js";
import { eq }           from "drizzle-orm";
import articlesSchema   from "@src/db/schemas/articles.schema.js";
import { StatusCodes }  from "http-status-codes";
import houndError       from "@src/db/dbcontrollers/commons/errorHounder.js";
import IDbControllerResponse, { OPSTATUS }
                        from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";

// only status and favorite can be updated by external users
type IArticleUpdateObj = Pick<typeof articlesSchema.$inferInsert, "status" | "favorite">;

async function updateArticle(articleId: bigint,  updateObj: IArticleUpdateObj):
                Promise<IDbControllerResponse<typeof articlesSchema.$inferSelect>> {


    try {
        const resUpdateArticle = await  db.update(articlesSchema)
                                        .set({
                                            ...updateObj,
                                            time_updated: new Date(),
                                        })
                                        .where( eq(articlesSchema.item_id, articleId) )
                                        .returning();

        app.log.info(`Article updated with id: ${articleId}`);

        if (!resUpdateArticle.length) {
            // most likely the article does not exist. Return error
            throw new Error("Unknown failure during article update");
        }

        return {
            success:        true,
            status:         OPSTATUS.SUCCESS,
            recommendedHttpResponseCode: StatusCodes.OK,
            message:       `Article updated with id: ${articleId}`,
            data:           resUpdateArticle[0]!,
        }

    }
    catch (error: any) {
        app.log.error(error);
        return houndError(error);
    }
}

export default updateArticle;
