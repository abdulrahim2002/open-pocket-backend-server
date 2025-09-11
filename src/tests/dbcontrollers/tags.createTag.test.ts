import createTag        from "@src/db/dbcontrollers/tags.createTag.js";
import usersSchema      from "@src/db/schemas/users.schema.js";
import tagsSchema       from "@src/db/schemas/tags.schema.js";
import createUser       from "@src/db/dbcontrollers/users.createUser.js";
import deleteUser       from "@src/db/dbcontrollers/users.deleteUser.js";
import { OPSTATUS }     from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";
import { StatusCodes }  from "http-status-codes";
import deleteTag        from "@src/db/dbcontrollers/tags.deleteTag.js";
import articlesSchema   from "@src/db/schemas/articles.schema.js";
import createArticle    from "@src/db/dbcontrollers/articles.createArticle.js";
import deleteArticle    from "@src/db/dbcontrollers/articles.deleteArticle.js";

const testUserForCreateTag: typeof usersSchema.$inferInsert = {
    provider:   "vitest",
    name:       "testUser-createTag",
    email:      "testUser-createTag@mail.com",
    hashed_password: "ohw98dh023h9dh3hd",
};

test("createTag", async () => {
    // create a test user
    const resCreateUser = await createUser(testUserForCreateTag);
    if (!resCreateUser.success) {
        throw new Error("Precondition Failure: Couldn't create a user in the first place");
    }

    const testArticleForCreateTag: typeof articlesSchema.$inferInsert = {
        user_id: resCreateUser.data!.user_id,
        status: 0,
        favorite: false,
        given_url: "https://example.com/",
        given_title: "The title that user provided in the request",
        resolved_title: "Sample Resolved Title",
        resolved_url: "https://sample-resolved-url.com/",
        domain_id: BigInt(1243525),
        origin_domain_id: BigInt(12542244),
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

    // create a test article
    const resCreateArticle = await createArticle(testArticleForCreateTag);
    if (!resCreateArticle.success) {
        throw new Error("Precondition Failure: Couldn't create related article in the first place");
    }

    // create a tag with user_id=user_id of newly created user
    const testTagForCreateTag: typeof tagsSchema.$inferInsert =  {
        tag_name: "vitest",
        user_id: resCreateUser.data!.user_id,
        item_id: resCreateArticle.data!.item_id,
    };

    const resCreateTag = await createTag(testTagForCreateTag);


    // delete the newly created tag. We only need the resCreateTag.data
    // so it is safe to delete.
    const resDelTag = await deleteTag(resCreateTag.data!.tag_id);
    if (!resDelTag.success) {
        throw new Error("We could not delete the created tag.");
    }

    // delete the created tag, to reverse operations
    const resDelUser = await deleteUser(resCreateUser.data!.user_id);
    if (!resDelUser) {
        throw new Error("We could not delete the test user.");
    }

    // delete the newly created article
    const resDelArticle = await deleteArticle(resCreateArticle.data!.item_id);
    if (!resDelArticle) {
        throw new Error("We could not delete the created article.");
    }

    expect(resCreateTag).toMatchObject({
        success: true,
        status: OPSTATUS.SUCCESS,
        message: "tag created successfully",
        recommendedHttpResponseCode: StatusCodes.CREATED,
        data: testTagForCreateTag,
    });
});
