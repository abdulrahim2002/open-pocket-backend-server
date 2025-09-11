/**
 * Parser for open-pocket. The purpose of this parser is to go to a
 * specific URL, and gather more information about the web page. For
 * example: excerpt, resolved title, word count, ect.
 *
 * If the original article redirects. For example, say it was
 * bit.ly/qdsq3 then the parser shall find out the final resolved url.
*/
export interface IParserResponse {
    success: boolean,
    status: number,
    message: string,
    data: {
        // final URL after following redirect
        resolved_url: string,
        // automatically found title in resolved_url article
        resolved_title: string,
        // excerpet if found
        excerpt: string,
        // numebr of words in the article
        word_count: number,
        // weather the article has image
        has_image: number,
        // weather the article has video
        has_video: number,
        // weather the page is an index page
        is_index: boolean,
        // weather the page is an article
        is_article: boolean,
        // URL of the first image found in the page body (article) if any
        top_image_url: string,
        // mime type of the page
        mime_type: string,
        // content length of the page
        content_length: string,
        // encoding of the page
        encoding: string,
    }
};

async function parser(url: string): Promise<IParserResponse> {

    return {
        success: true,
        status: 0,
        message: "",
        data: {
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
}

export default parser;
