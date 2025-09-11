/**
 * Parser for open-pocket. The purpose of this parser is to go to a
 * specific URL, and gather more information about the web page. For
 * example: excerpt, resolved title, word count, ect.
 *
 * If the original article redirects. For example, say it was
 * bit.ly/qdsq3 then the parser shall find out the final resolved url.
*/

export interface IParserResponse {
    resolved_url: string,
    resolved_title: string,
    excerpt: string,
    word_count: number,
    has_image: number,
    has_video: number,
    is_index: boolean,
    is_article: boolean,
    top_image_url: string,

    // metadata
    mime_type: string,
    content_length: string,
    encoding: string,
};

async function parser(url: string): Promise<IParserResponse> {

    return {
        resolved_url: url,
        resolved_title: "WIP",
        excerpt: "WIP",
        word_count: 0,
        has_image: 0,
        has_video: 0,
        is_index: false,
        is_article: false,
        top_image_url: "WIP",

        mime_type:      "Needs backend parser, schema upgrade | WIP",
        content_length: "Needs backend parser, schema upgrade | WIP",
        encoding:       "Needs backend parser, schema upgrade | WIP",
    }
}

export default parser;