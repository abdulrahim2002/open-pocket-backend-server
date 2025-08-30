import createTag        from "@src/db/dbcontrollers/tags.createTag.js";
import { usersSchema }  from "@src/db/schemas/users.schema.js";
import tagsSchema       from "@src/db/schemas/tags.schema.js";
import createUser       from "@src/db/dbcontrollers/users.createUser.js";
import deleteUser       from "@src/db/dbcontrollers/users.deleteUser.js";
import { OPSTATUS }     from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";
import { StatusCodes }  from "http-status-codes";
import deleteTag        from "@src/db/dbcontrollers/tags.deleteTag.js";


const testUserForCreateTag: typeof usersSchema.$inferInsert = {
    provider:   "vitest",
    name:       "testUser-createTag",
    email:      "testUser-createTag@mail.com",
};

test("createTag", async () => {
    // step 1: create a test user
    const resCreateUser = await createUser(testUserForCreateTag);
    if (!resCreateUser.success) {
        throw new Error("Precondition Failure: Couldn't create a user in the first place");
    }

    // create a tag with user_id=user_id of newly created user
    const testTagForCreateTag: typeof tagsSchema.$inferInsert =  {
        tag_name: "vitest",
        user_id: resCreateUser.data!.user_id,
        article_id: 123,
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

    expect(resCreateTag).toMatchObject({
        success: true,
        status: OPSTATUS.SUCCESS,
        message: "tag create successfully",
        recommendedHttpResponseCode: StatusCodes.CREATED,
        data: testTagForCreateTag,
    });
});
