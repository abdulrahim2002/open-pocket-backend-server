import createArticle    from "@src/db/dbcontrollers/articles.createArticle.js";
import deleteArticle    from "@src/db/dbcontrollers/articles.deleteArticle.js";
import articlesSchema   from "@src/db/schemas/articles.schema.js";
import usersSchema      from "@src/db/schemas/users.schema.js";
import createUser       from "@src/db/dbcontrollers/users.createUser.js";
import deleteUser       from "@src/db/dbcontrollers/users.deleteUser.js";
import { OPSTATUS }     from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";
import { StatusCodes }  from "http-status-codes";

const testUserForDeleteArticle: typeof usersSchema.$inferInsert = {
    provider:   "vitest",
    name:       "testUser-deleteArticle",
    email:      "testUser-deleteArticle@mail.com",
    hashed_password: "9q8h9d8q98h398r9",
};

test("deleteArticle", async () => {
    // create a test user first
    const resCreateUser = await createUser(testUserForDeleteArticle);
    if (!resCreateUser.success) {
        throw new Error("Precondition Failure, could not create a user in the first place");
    }

    // create article refering to created user
    const testArticleForDeleteArticle: typeof articlesSchema.$inferInsert =  {
        user_id: resCreateUser.data!.user_id, // very imp.
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


    // create an article now
    const resCreateArticle = await createArticle(testArticleForDeleteArticle);
    if (!resCreateArticle.success) {
        throw new Error("Precondition Failure: Couldn't create article in the first place");
    }

    // delete the created article
    const testArticleItem_id = resCreateArticle.data!.item_id;
    const resDeleteArticle = await deleteArticle(testArticleItem_id);

    // delete the created user
    await deleteUser(resCreateUser.data!.user_id);

    expect(resDeleteArticle).toMatchObject({
        success: true,
        status: OPSTATUS.SUCCESS,
        message: `article with item_id: ${testArticleItem_id}, deleted successfully`,
        recommendedHttpResponseCode: StatusCodes.OK,
        data: testArticleForDeleteArticle,
    });
});