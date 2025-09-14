import addAction        from "@src/api/v1/actions/add.action.js";
import archiveAction    from "@src/api/v1/actions/archive.action.js";
import readdAction      from "@src/api/v1/actions/readd.action.js";
import favoriteAction   from "@src/api/v1/actions/favorite.action.js";
import unFavoriteAction from "@src/api/v1/actions/unfavorite.action.js";
import deleteAction     from "@src/api/v1/actions/delete.action.js";
import tagsAddAction    from "@src/api/v1/actions/tags_add.action.js";

const actionMap: { [key: string]: Function } = {
    "add":      addAction,
    "archive":  archiveAction,
    "readd":    readdAction,
    "favorite": favoriteAction,
    "unfavorite": unFavoriteAction,
    "delete":   deleteAction,
    "tags_add": tagsAddAction,
};

export default actionMap;
