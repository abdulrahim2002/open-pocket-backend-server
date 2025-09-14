/**
 * @description remove tags on an article. to do this, we can simply remove all tags
 * in the given list
 *
 * see: https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/send/#action-tags_remove
 */
import deleteTags       from "@src/db/dbcontrollers/tags.deleteTags.js";
import { type Schema }  from "ajv";
import app              from "@src/app.js";
import ajv              from "@src/commons/ajv.js";


interface ITagsClear {
    user_id:    number,
    item_id:    string,
};


const tagsClearSchema: Schema = {
    type: "object",
    properties: {
        user_id: { type: "number" },
        item_id: { type: "string", pattern: "^\\d+$", minLength: 1, maxLength: 20 },
        tags:    { type: "string", default: "" },
    },
    required: ["user_id", "item_id", "tags"],
};


async function tagsClearAction( data: ITagsClear ): Promise<boolean> {

    try {

        if ( !ajv.validate(tagsClearSchema, data) ) {
            throw new Error("Schema validation failed" + ajv.errorsText());
        }

        const item_id = BigInt(data.item_id);
        if (item_id <= 0n || item_id > 9223372036854775807n) {
            throw new Error("item_id is out of range");
        }

        const resRemoveTags = await deleteTags(
            item_id,
            data.user_id,
        );

        return resRemoveTags.success;
    }

    catch (error: any) {
        // TODO: debug error properly
        app.log.error(error);
        return false;
    }
}

export default tagsClearAction;
