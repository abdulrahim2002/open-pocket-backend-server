import createArticle    from "@src/db/dbcontrollers/articles.createArticle.js";
import deleteArticle    from "@src/db/dbcontrollers/articles.deleteArticle.js";
import articlesSchema   from "@src/db/schemas/articles.schema.js";
import { OPSTATUS }     from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";
import { StatusCodes }  from "http-status-codes";


const testArticleForCreateArticle: typeof articlesSchema.$inferInsert = {
    user_id: 123, // TODO: add foreign key constraint
    status: 0,
    favorite: false,
    resolved_title: "Sample Resolved Title",
    resolved_url: "https://sample-resolved-url.com/",
    excerpt: "sample excerpt describing the item in detail",
    is_article: true,
    is_index: false,
    has_video: 0,
    has_image: 0,
    word_count: 123,
    time_added: new Date(),
    time_updated: new Date(),
    top_image_url: "https://topimage.io/image.png/",
    author_name: "sample-author",
};


test("createArticle", async () => {
    const resCreateArticle = await createArticle(testArticleForCreateArticle);

    // delete the article to reverse changes made
    await deleteArticle(resCreateArticle.data!.item_id);

    expect(resCreateArticle).toMatchObject({
        success: true,
        status: OPSTATUS.SUCCESS,
        message: "article created successfully",
        recommendedHttpResponseCode: StatusCodes.CREATED,
        data: testArticleForCreateArticle,
    });
});