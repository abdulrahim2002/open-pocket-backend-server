import createArticle    from "@src/db/dbcontrollers/articles.createArticle.js";
import deleteArticle    from "@src/db/dbcontrollers/articles.deleteArticle.js";
import articlesSchema   from "@src/db/schemas/articles.schema.js";
import { OPSTATUS }     from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";
import { StatusCodes }  from "http-status-codes";

const testArticleForDeleteArticle: typeof articlesSchema.$inferInsert = {
    user_id: 123,
    status: 0,
    favorite: false,
    resolved_title: "Sample Resolved Title",
    resolved_url: "https://sample-resolved-url.com/",
    excerpt: "sample excerpt describing the item in detail",
    is_article: true,
    is_index: false,
    has_video: false,
    has_image: false,
    word_count: 123,
    time_added: new Date(),
    time_updated: new Date(),
    top_image_url: "https://topimage.io/image.png/",
    author_name: "sample-author",
};


test("deleteArticle", async () => {
    // create an article first
    const resCreateArticle = await createArticle(testArticleForDeleteArticle);
    if (!resCreateArticle.success) {
        throw new Error("Precondition Failure: Couldn't create article in the first place");
    }

    const testArticleItem_id = resCreateArticle.data!.item_id;
    const resDeleteArticle = await deleteArticle(testArticleItem_id);

    expect(resDeleteArticle).toMatchObject({
        success: true,
        status: OPSTATUS.SUCCESS,
        message: `article with item_id: ${testArticleItem_id}, deleted successfully`,
        recommendedHttpResponseCode: StatusCodes.OK,
        data: testArticleForDeleteArticle,
    });
});