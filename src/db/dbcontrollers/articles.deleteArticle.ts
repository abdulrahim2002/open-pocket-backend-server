import db               from "@src/db/index.js";
import app              from "@src/app.js";
import articlesSchema   from "@src/db/schemas/articles.schema.js";
import { eq }           from "drizzle-orm";
import { StatusCodes }  from "http-status-codes";
import houndError       from "@src/db/dbcontrollers/commons/errorHounder.js";
import OPSTATUS         from "@src/commons/opstatus.js";
import IDbControllerResponse from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";


type articleShape = typeof articlesSchema.$inferSelect;

async function deleteArticle(item_id: bigint):
                        Promise<IDbControllerResponse<articleShape>> {

    try {
        const deletedArticles = await db.delete(articlesSchema)
                                        .where( eq(articlesSchema.item_id, item_id) )
                                        .returning();

        if (deletedArticles[0] === undefined) {
            // TODO: this is extremely generic failure. It would occur
            // if there was not article by the given item_id or even
            // in case of network failure, or maybe the database is not
            // initialized. We must segregate and isolate these failures
            // further to respond with appropriate error
            throw new Error("Unknown Failure");
        }

        app.log.info(`article with item_id: ${item_id}, deleted successfully`);

        return {
            success: true,
            status: OPSTATUS.SUCCESS,
            message: `article with item_id: ${item_id}, deleted successfully`,
            recommendedHttpResponseCode: StatusCodes.OK,
            data: deletedArticles[0],
        }
    }

    catch (error: any) {
        app.log.error(error);
        return houndError(error);
    }
}

export default deleteArticle;
