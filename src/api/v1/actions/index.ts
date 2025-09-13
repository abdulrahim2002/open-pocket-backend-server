import addAction from "@src/api/v1/actions/add.action.js";

const actionMap: { [key: string]: Function } = {
    add: addAction,
};

export default actionMap;
