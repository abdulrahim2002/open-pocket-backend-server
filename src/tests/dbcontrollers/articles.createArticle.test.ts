import createArticle    from "@src/db/dbcontrollers/articles.createArticle.js";
import deleteArticle    from "@src/db/dbcontrollers/articles.deleteArticle.js";
import articlesSchema   from "@src/db/schemas/articles.schema.js";
import createUser       from "@src/db/dbcontrollers/users.createUser.js";
import deleteUser       from "@src/db/dbcontrollers/users.deleteUser.js";
import usersSchema      from "@src/db/schemas/users.schema.js";
import { OPSTATUS }     from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";
import { StatusCodes }  from "http-status-codes";


const testUserForCreateArticle: typeof usersSchema.$inferInsert = {
    provider:   "vitest",
    name:       "testUser-createArticle",
    email:      "testUser-createArticle@mail.com",
    hashed_password: "12odh8hr982h3h29",
};


test("createArticle", async () => {
    // first create a test user
    const resCreateUser = await createUser(testUserForCreateArticle);
    if (!resCreateUser.success) {
        throw new Error("Precondition Failure: Couldn't create a user in the first place");
    }

    // now create a new article belonging to test user created above
    const testArticleForCreateArticle: typeof articlesSchema.$inferInsert = {
        user_id: resCreateUser.data!.user_id, // very imp.
        status: 0,
        favorite: false,
        given_url: "https://givenurl.com",
        given_title: "Title supplied by the user",
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
        author_id: 12,
    };

    const resCreateArticle = await createArticle(testArticleForCreateArticle);

    // delete the article to reverse changes made
    await deleteArticle(resCreateArticle.data!.item_id);

    // delete the test user as well
    await deleteUser(resCreateUser.data!.user_id);

    expect(resCreateArticle).toMatchObject({
        success: true,
        status: OPSTATUS.SUCCESS,
        message: "article created successfully",
        recommendedHttpResponseCode: StatusCodes.CREATED,
        data: testArticleForCreateArticle,
    });
});
