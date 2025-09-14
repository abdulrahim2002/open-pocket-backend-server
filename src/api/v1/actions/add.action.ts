/**
 * @description add an item to the user's pocket list
 * see: https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/send/#action-add
*/
import ajv    from "@src/commons/ajv.js";
import app    from "@src/app.js";
import parser from "@open-pocket/article-parser";
import { type Schema }  from "ajv";
import createArticle    from "@src/db/dbcontrollers/articles.createArticle.js";
import articlesSchema   from "@src/db/schemas/articles.schema.js";

interface IaddActionParams {
    user_id: number,
    url:     string,
    tags?:   string,
    title?:  string,
};

const addActionParamsSchema: Schema = {
    type: "object",
    properties: {
        user_id: { type: "number" },
        // TODO: add support for formats in ajv instance
        url:     { type: "string" },
        tags:    { type: "string", default: "" }, // format: "uri"
        title:   { type: "string", default: "" },
    },
    required: ["user_id", "url"]
};


async function addAction(params: IaddActionParams): Promise<boolean> {
    try {

        // first check if params conform to schema.
        if (!ajv.validate(addActionParamsSchema, params)) {
            throw new Error("addAction: invalid parameters: " +
                            ajv.errorsText());
        }

        const resParser = await parser(params.url, 5000);

        const articleData: typeof articlesSchema.$inferInsert = {
            user_id:                    params.user_id,
            given_url:                  params.url,
            status:                     0,
            favorite:                   false,
            given_title:                params.title ?? null,
            resolved_title:             resParser?.resolved_title ?? "",
            resolved_url:               resParser?.resolved_url ?? "",
            domain_id:                  BigInt(-1), // TODO: implement domain parsing
            origin_domain_id:           BigInt(-1), // TODO: implement domain information
            excerpt:                    resParser?.excerpt ?? "",
            is_article:                 resParser?.is_article ?? false,
            is_index:                   false, // TODO: depreciate is_index field properly
            has_video:                  resParser?.videos ? 1 : 0,
            has_image:                  resParser?.images ? 1 : 0,
            word_count:                 resParser?.word_count ?? 0,
            time_added:                 new Date(),
            time_updated:               new Date(),
            top_image_url:              resParser?.top_image_url ?? "",
            author_id:                  -1, // TODO: implement author parsing
        };

        const resCreateArticle = await createArticle(articleData);

        if (resCreateArticle.success) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error: any) {
        app.log.error("add.action: error: " + error?.message);
        return false;
    }
}


export default addAction;
