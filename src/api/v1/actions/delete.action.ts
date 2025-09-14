/**
 * @description delete an article
 * see: https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/send/#action-delete
 */
import deleteArticle    from "@src/db/dbcontrollers/articles.deleteArticle.js";
import { type Schema }  from "ajv";
import app              from "@src/app.js";
import ajv              from "@src/commons/ajv.js";


interface IDeleteAction {
    item_id:    string,
};


const deleteActionSchema: Schema = {
    type: "object",
    properties: {
        // bigint range: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
        // see: https://www.postgresql.org/docs/current/datatype-numeric.html
        item_id: { type: "string", pattern: "^\\d+$", minLength: 1, maxLength: 20 }
    },
    required: ["item_id"]
};


async function deleteAction( data: IDeleteAction ): Promise<boolean> {

    try {

        if ( !ajv.validate(deleteActionSchema, data) ) {
            throw new Error("Schema validation failed" + ajv.errorsText());
        }

        const item_id = BigInt(data.item_id);
        if (item_id <= 0n || item_id > 9223372036854775807n) {
            throw new Error("item_id is out of range");
        }

        const resDelete = await deleteArticle(item_id);


        if (resDelete.success) {
            app.log.info(`Article with ID ${item_id} deleted successfully.`);
            return true;
        }

        app.log.error(`Failed to delete article with ID ${item_id}: ${resDelete.message}`);
        return false;

    }

    catch (error: any) {
        // TODO: debug error properly
        app.log.error(error);
        return false;
    }
}

export default deleteAction;
