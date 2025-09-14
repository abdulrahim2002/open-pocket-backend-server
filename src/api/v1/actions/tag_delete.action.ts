/**
 * @description delete a tag with tag_name=`tag`
 *
 * see: https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/send/#action-tag_delete
 */
import deleteTagByName  from "@src/db/dbcontrollers/tags.deleteTagByName.js";
import { type Schema }  from "ajv";
import app              from "@src/app.js";
import ajv              from "@src/commons/ajv.js";


interface ITagDelete {
    user_id:    number,
    tag:        string,
};


const tagDeleteSchema: Schema = {
    type: "object",
    properties: {
        user_id: { type: "number" },
        tag:     { type: "string" },
    },
    required: ["user_id", "tag"],
};


async function tagDeleteAction( data: ITagDelete ): Promise<boolean> {

    try {

        if ( !ajv.validate(tagDeleteSchema, data) ) {
            throw new Error("Schema validation failed" + ajv.errorsText());
        }

        const resDeleteTagByName = await deleteTagByName(data.user_id, data.tag);
        return resDeleteTagByName.success;
    }

    catch (error: any) {
        // TODO: debug error properly
        app.log.error(error);
        return false;
    }
}

export default tagDeleteAction;
