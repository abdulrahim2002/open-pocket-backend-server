/**
 * @description add tags to an article. This is similar to how we add tags when creating
 * an article. We just insert new tags into the tags table. If we try to create a duplicate
 * tag, it will automatically be rejected sinc we have unique constraint.
 *
 * see: https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/send/#action-tags_add
 */
import createTag        from "@src/db/dbcontrollers/tags.createTag.js";
import { type Schema }  from "ajv";
import app              from "@src/app.js";
import ajv              from "@src/commons/ajv.js";


interface ITagsAddAction {
    user_id:    number,
    item_id:    string,
    tags:       string,
};


const tagsAddActionSchema: Schema = {
    type: "object",
    properties: {
        user_id: { type: "number" },
        item_id: { type: "string", pattern: "^\\d+$", minLength: 1, maxLength: 20 },
        tags:    { type: "string", default: "" },
    },
    required: ["user_id", "item_id", "tags"],
};


async function tagsAddAction( data: ITagsAddAction ): Promise<boolean> {

    try {

        if ( !ajv.validate(tagsAddActionSchema, data) ) {
            throw new Error("Schema validation failed" + ajv.errorsText());
        }

        const item_id = BigInt(data.item_id);
        if (item_id <= 0n || item_id > 9223372036854775807n) {
            throw new Error("item_id is out of range");
        }

        let allTagsAddedSuccessfully = true;

        for ( const tag of data.tags.split(",").map(t => t.trim()) ) {
            if (!tag.length) continue;

            const resCreateTag = await createTag({
                user_id: data.user_id,
                item_id: item_id,
                tag_name: tag,
            });

            if (!resCreateTag.success) {
                allTagsAddedSuccessfully = false;
                app.log.error(`Counldn't create tag: ${tag}`);
            }

        }

        return allTagsAddedSuccessfully;
    }

    catch (error: any) {
        // TODO: debug error properly
        app.log.error(error);
        return false;
    }
}

export default tagsAddAction;
