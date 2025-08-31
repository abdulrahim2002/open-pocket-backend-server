import db               from "@src/db/index.js";
import app              from "@src/app.js";
import articlesSchema   from "@src/db/schemas/articles.schema.js";
import { StatusCodes }  from "http-status-codes";
import houndError       from "@src/db/dbcontrollers/commons/errorHounder.js";
import IDbControllerResponse, { OPSTATUS }
                        from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";


type articleInsertShape = typeof articlesSchema.$inferInsert;
type articleShape       = typeof articlesSchema.$inferSelect;

async function createArticle(article: articleInsertShape):
                            Promise<IDbControllerResponse<articleShape>> {

    try {
        const resCreateArticle = await db.insert(articlesSchema).values(article).returning();

        if ( resCreateArticle[0] === undefined ) {
            throw new Error("Unknown Failure"); // handled below
        }

        app.log.info(`article created successfully, with item id: ${resCreateArticle[0].item_id}`);

        return {
            success: true,
            status: OPSTATUS.SUCCESS,
            message: "article created successfully",
            recommendedHttpResponseCode: StatusCodes.CREATED,
            data: resCreateArticle[0],
        }
    }
    catch (error: any) {
        app.log.error(error);
        return houndError(error);
    }
}

export default createArticle;