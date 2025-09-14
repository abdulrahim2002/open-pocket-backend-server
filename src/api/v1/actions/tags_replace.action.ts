/**
 * @description First, remove all tags for an item. Then reassign given tags to the item.
 * This action is composed of 2 actions. tags_clear, and tags_add
 *
 * see: https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/send/#action-tags_replace
 */
import tagsClearAction  from "@src/api/v1/actions/tags_clear.action.js";
import tagsAddAction    from "@src/api/v1/actions/tags_add.action.js";
import app              from "@src/app.js";

interface ITagsReplace {
    user_id:    number,
    item_id:    string,
    tags:       string,
};

async function tagsReplaceAction( data: ITagsReplace ): Promise<boolean> {

    try {
        const resTagsClear = await tagsClearAction({
            user_id: data.user_id,
            item_id: data.item_id,
        });

        if (!resTagsClear) {
            return false;
        }

        const resTagsAdd = await tagsAddAction(data);

        return resTagsAdd;
    }

    catch (error: any) {
        // TODO: debug error properly
        app.log.error(error);
        return false;
    }
}

export default tagsReplaceAction;
