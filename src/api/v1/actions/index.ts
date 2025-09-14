import addAction    from "@src/api/v1/actions/add.action.js";
import archiveAction from "@src/api/v1/actions/archive.action.js";

const actionMap: { [key: string]: Function } = {
    add: addAction,
    archive: archiveAction,
};

export default actionMap;
