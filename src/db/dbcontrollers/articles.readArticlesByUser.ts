import articlesSchema   from "@src/db/schemas/articles.schema.js";
import db               from "@src/db/index.js";
import app              from "@src/app.js";
import houndError       from "@src/db/dbcontrollers/commons/errorHounder.js";
import OPSTATUS         from "@src/commons/opstatus.js";
import { eq }           from "drizzle-orm";
import { StatusCodes }  from "http-status-codes";
import IDbControllerResponse from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";


type IArticle = typeof articlesSchema.$inferSelect;


async function readArticlesByUser(user_id: number): Promise<IDbControllerResponse<IArticle[]>> {

    try {
        const fetchedArticles = await db.select().from(articlesSchema)
                                        .where( eq(articlesSchema.user_id, user_id) );

        app.log.info(`fetched articles for user: ${user_id}`);
        return {
            success: true,
            status: OPSTATUS.SUCCESS,
            message: `Articles retrieved for user: ${user_id}`,
            recommendedHttpResponseCode: StatusCodes.OK,
            data: fetchedArticles
        }
    }
    catch (error: any) {
        app.log.error(`Failed to articles for user. Details: ${error}`);
        return houndError(error);
    }

}

export default readArticlesByUser;
