/**
 * @description Rename a tag. From `old_tagname` -> `new_tagname`
 **/
import db               from "@src/db/index.js";
import app              from "@src/app.js";
import { eq, and }      from "drizzle-orm";
import tagsSchema       from "@src/db/schemas/tags.schema.js";
import { StatusCodes }  from "http-status-codes";
import houndError       from "@src/db/dbcontrollers/commons/errorHounder.js";
import OPSTATUS         from "@src/commons/opstatus.js";
import IDbControllerResponse from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";

async function renameTag(user_id: number, old_tagname: string, new_tagname: string):
                Promise<IDbControllerResponse<boolean|undefined>> {

    try {
        const resRename = await  db.update(tagsSchema)
                                        .set({
                                            tag_name: new_tagname,
                                        })
                                        .where(
                                            and(
                                                eq(tagsSchema.tag_name, old_tagname),
                                                eq(tagsSchema.user_id, user_id)
                                            )
                                         )
                                        .returning();

        app.log.info(`Tag with name: ${old_tagname} updated to ${new_tagname}`);

        if (!resRename.length) {
            throw new Error("May be the tag didn't existed or something else went wrong!");
        }

        return {
            success:        true,
            status:         OPSTATUS.SUCCESS,
            recommendedHttpResponseCode: StatusCodes.OK,
            message:       `${resRename.length} tags updated`,
            data:           true,
        }

    }
    catch (error: any) {
        app.log.error(error);
        return houndError(error);
    }
}

export default renameTag;
