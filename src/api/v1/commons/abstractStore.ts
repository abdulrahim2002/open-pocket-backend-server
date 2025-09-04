/**
 * In order to store refresh tokens, we need a key value store on the server side.
 * This is typically done through solutions like reddis. However, we are currently
 * just starting, out. And it is better to store it on server for now. The interface
 * must however, define all kinds of methods that are typical of a key-value store
 * And in case we need a real session store in the future, it should be a drop in
 * replacement.
 **/
interface IMapEntry {
    user_id: string,
    email: string,
}

export default new Map<string, IMapEntry>();
