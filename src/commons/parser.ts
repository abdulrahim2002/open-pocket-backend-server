/**
 * Parser for open-pocket. The purpose of this parser is to go to a
 * specific URL, and gather more information about the web page. For
 * example: excerpt, resolved title, word count, ect.
 *
 * If the original article redirects. For example, say it was
 * bit.ly/qdsq3 then the parser shall find out the final resolved url.
*/
import { extract }      from "@extractus/article-extractor";
import { StatusCodes }  from "http-status-codes";
// TODO: we can use metascrapper for some fields
// TODO: we can use also use metadata-scrapper

export interface IParserResponse {
    success: boolean,
    status: number,
    recommendedHttpResponseCode: number,
    message: string,
    data: undefined | {
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

        // domain 
        domain: string,
    },
};

// see possible values for "type" at: https://github.com/extractus/article-extractor/blob/main/src/utils/extractLdSchema.js
const articleLike = [
    "article",
    "advertisercontentarticle",
    "newsarticle",
    "analysisnewsarticle",
    "askpublicnewsarticle",
    "backgroundnewsarticle",
    "opinionnewsarticle",
    "reportagenewsarticle",
    "reviewnewsarticle",
    "report",
    "satiricalarticle",
    "scholarlyarticle",
    "medicalscholarlyarticle",
];

async function parser(url: string): Promise<IParserResponse> {

    try {
        const articleMetadata = await extract(url);
        if (!articleMetadata) {
            throw new Error("Unknown Failure"); // handled below
        }

        return {
            success: true,
            status: 0,
            message: "",
            recommendedHttpResponseCode: StatusCodes.OK,
            data: {
                resolved_url:   articleMetadata.url ?? "",
                resolved_title: articleMetadata.title ?? "",
                excerpt:        articleMetadata.description ?? "",
                word_count:     0,
                has_image:      (articleMetadata.image) ? 1 : 0,
                has_video:      0,     // TODO: cannot tell this reliably
                is_index:       false, // TODO: cannot tell this reliably
                is_article:     articleLike.includes(articleMetadata.type ?? ""),
                top_image_url:  articleMetadata.image ?? "",
                mime_type:      "Needs backend parser, schema upgrade | WIP",
                content_length: articleMetadata.content?.length.toString() ?? "0",
                encoding:       "Needs backend parser, schema upgrade | WIP",

                // source is the domain in most cases
                domain:         articleMetadata.source ?? "",
            }
        }
    }
    catch (error: any) {
        // TODO: investigate error
        return {
            success: false,
            status: 0,
            recommendedHttpResponseCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
            data: undefined
        }
    }
}

export default parser;
