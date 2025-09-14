/**
 * @description unfavorite an article
 * see: https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/send/#action-favorite
 */
import updateArticle    from "@src/db/dbcontrollers/article.updateArticle.js";
import { type Schema }  from "ajv";
import app              from "@src/app.js";
import ajv              from "@src/commons/ajv.js";


interface IUnfavoriteAction {
    item_id:    string,
};


const unFavoriteActionSchema: Schema = {
    type: "object",
    properties: {
        // bigint range: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
        // see: https://www.postgresql.org/docs/current/datatype-numeric.html
        item_id: { type: "string", pattern: "^\\d+$", minLength: 1, maxLength: 20 }
    },
    required: ["item_id"]
};


async function unFavoriteAction( data: IUnfavoriteAction ): Promise<boolean> {

    try {

        if ( !ajv.validate(unFavoriteActionSchema, data) ) {
            throw new Error("Schema validation failed" + ajv.errorsText());
        }

        const item_id = BigInt(data.item_id);
        if (item_id <= 0n || item_id > 9223372036854775807n) {
            throw new Error("item_id is out of range");
        }

        const resUpdate = await updateArticle(item_id, {
            // https://abdulrahim2002.github.io/open-pocket-docs/docs/Database-Layer/database-schema/#description-of-the-fields
            favorite: false,
        });

        if (resUpdate.success) {
            app.log.info(`Article with ID ${item_id} added to unfavorited successfully.`);
            return true;
        }

        app.log.error(`Failed to unfavorite article with ID ${item_id}: ${resUpdate.message}`);
        return false;

    }

    catch (error: any) {
        // TODO: debug error properly
        app.log.error(error);
        return false;
    }
}

export default unFavoriteAction;
