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


interface ITagsRemove {
    user_id:    number,
    item_id:    string,
    tags:       string,
};


const tagsRemoveSchema: Schema = {
    type: "object",
    properties: {
        user_id: { type: "number" },
        item_id: { type: "string", pattern: "^\\d+$", minLength: 1, maxLength: 20 },
        tags:    { type: "string", default: "" },
    },
    required: ["user_id", "item_id", "tags"],
};


async function tagsRemoveAction( data: ITagsRemove ): Promise<boolean> {

    try {

        if ( !ajv.validate(tagsRemoveSchema, data) ) {
            throw new Error("Schema validation failed" + ajv.errorsText());
        }

        const item_id = BigInt(data.item_id);
        if (item_id <= 0n || item_id > 9223372036854775807n) {
            throw new Error("item_id is out of range");
        }

        const resRemoveTags = await deleteTags(
            item_id,
            data.user_id,
            data.tags.split(",").map(t => t.trim())
        );

        return resRemoveTags.success;
    }

    catch (error: any) {
        // TODO: debug error properly
        app.log.error(error);
        return false;
    }
}

export default tagsRemoveAction;
