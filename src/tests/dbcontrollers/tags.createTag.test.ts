import createTag        from "@src/db/dbcontrollers/tags.createTag.js";
import { usersSchema }  from "@src/db/schemas/users.schema.js";
import { tagsSchema }   from "@src/db/schemas/tags.schema.js";
import createUser       from "@src/db/dbcontrollers/users.createUser.js";
import { OPSTATUS }     from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";
import { StatusCodes }  from "http-status-codes";


const testUserForCreateTag: typeof usersSchema.$inferInsert = {
    provider:   "vitest",
    name:       "test-user-for-create-tag",
    email:      "test-user-for-create-tag",
};

test("createTag", async () => {
    // first create a test user
    const res1 = await createUser(testUserForCreateTag);
    if (!res1.success) {
        throw new Error("Precondition Failure: Couldn't create a user in the first place");
    }

    // create a tag with user_id = user_id of newly created user
    const testTagForCreateTag: typeof tagsSchema.$inferInsert =  {
        tag_name: "vitest",
        user_id: res1.data!.user_id, // assuming it is present here
        article_id: 123,
    };

    const res2 = await createTag(testTagForCreateTag);

    expect(res2).toMatchObject({
        success: true,
        status: OPSTATUS.SUCCESS,
        message: "tag create successfully",
        recommendedHttpResponseCode: StatusCodes.CREATED,
        data: testTagForCreateTag,
    });
});
