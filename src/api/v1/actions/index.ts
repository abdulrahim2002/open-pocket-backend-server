import addAction        from "@src/api/v1/actions/add.action.js";
import archiveAction    from "@src/api/v1/actions/archive.action.js";
import readdAction      from "@src/api/v1/actions/readd.action.js";
import favoriteAction   from "@src/api/v1/actions/favorite.action.js";
import unFavoriteAction from "@src/api/v1/actions/unfavorite.action.js";
import deleteAction     from "@src/api/v1/actions/delete.action.js";
import tagsAddAction    from "@src/api/v1/actions/tags_add.action.js";
import tagsRemoveAction from "@src/api/v1/actions/tags_remove.js";
import tagsClearAction  from "@src/api/v1/actions/tags_clear.action.js";
import tagsReplaceAction from "@src/api/v1/actions/tags_replace.action.js";
import tagRenameAction  from "@src/api/v1/actions/tag_rename.action.js";
import tagDeleteAction  from "@src/api/v1/actions/tag_delete.action.js";

const actionMap: { [key: string]: Function } = {
    "add":          addAction,
    "archive":      archiveAction,
    "readd":        readdAction,
    "favorite":     favoriteAction,
    "unfavorite":   unFavoriteAction,
    "delete":       deleteAction,
    "tags_add":     tagsAddAction,
    "tags_remove":  tagsRemoveAction,
    "tags_clear":   tagsClearAction,
    "tags_replace": tagsReplaceAction,
    "tag_rename":   tagRenameAction,
    "tag_delete":   tagDeleteAction,
};

export default actionMap;
