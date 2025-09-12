/**
 * Parser for open-pocket. The purpose of this parser is to go to a
 * specific URL, and gather more information about the web page. For
 * example: title, description etc.
 *
 * If the original article redirects. For example, say it was bit.ly/qdsq3, 
 * then the parser shall find out the final resolved url
*/
import metascraper              from "metascraper";
import metascraperTitle         from "metascraper-title";
import metascraperDescription   from "metascraper-description";
import metascraperImage         from "metascraper-image"; 
import metascraperVideo         from "metascraper-video";

const scraper = metascraper([
    metascraperTitle(),
    metascraperDescription(),
    metascraperImage(),
    metascraperVideo(),
]);

import { StatusCodes }  from "http-status-codes";

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
    }
};

async function parser(url: string): Promise<IParserResponse> {

    try {
        const   controller = new AbortController(),
                // TODO: make parser timeout configurable
                trigger = setTimeout( () => controller.abort(), 5000 );

        const response = await fetch(url, {
            signal: controller.signal,
            redirect: "follow",
        });

        clearTimeout(trigger);

        const articleMetadata = await scraper({ 
            url: url, 
            html: await response.text(),
            validateUrl: true 
        });

        return {
            success: true,
            status: 0,
            message: "",
            recommendedHttpResponseCode: StatusCodes.OK,
            data: {
                resolved_url:   response.url,
                resolved_title: articleMetadata.title ?? "",
                excerpt:        articleMetadata.description ?? "",
                word_count:     -1,    // TODO: cannot tell this reliably
                has_image:      (articleMetadata.image) ? 1 : 0,
                has_video:      (articleMetadata.video) ? 1 : 0,
                is_index:       false, // TODO: cannot tell this reliably
                is_article:     false, // TODO: cannot tell this reliably
                top_image_url:  articleMetadata.image ?? "",
                mime_type:      response.headers.get("content-type")?.split(";")[0] ?? "",
                content_length: response.headers.get("content-length") ?? "",
                encoding:       response.headers.get("content-type")?.split(";")[1]?.split("=")[1] ?? "",
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
