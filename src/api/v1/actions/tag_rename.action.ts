/**
 * @description rename a tag from `old_tag` -> `new_tag`
 *
 * see: https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/send/#action-tag_rename
 */
import renameTag        from "@src/db/dbcontrollers/tags.renameTag.js";
import { type Schema }  from "ajv";
import app              from "@src/app.js";
import ajv              from "@src/commons/ajv.js";


interface ITagRename {
    user_id:    number,
    old_tag:    string,
    new_tag:    string,
};


const tagRenameSchema: Schema = {
    type: "object",
    properties: {
        user_id: { type: "number" },
        old_tag: { type: "string" },
        new_tag: { type: "string" },
    },
    required: ["user_id", "old_tag", "new_tag"],
};


async function tagRenameAction( data: ITagRename ): Promise<boolean> {

    try {

        if ( !ajv.validate(tagRenameSchema, data) ) {
            throw new Error("Schema validation failed" + ajv.errorsText());
        }

        const resRename = await renameTag(data.user_id, data.old_tag, data.new_tag);

        return resRename.success;
    }

    catch (error: any) {
        // TODO: debug error properly
        app.log.error(error);
        return false;
    }
}

export default tagRenameAction;
