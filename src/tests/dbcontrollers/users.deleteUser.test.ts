import usersSchema      from "@src/db/schemas/users.schema.js";
import createUser       from "@src/db/dbcontrollers/users.createUser.js";
import deleteUser       from "@src/db/dbcontrollers/users.deleteUser.js";
import OPSTATUS         from "@src/commons/opstatus.js";
import { StatusCodes }  from "http-status-codes";

const testUserDeleteAPI: typeof usersSchema.$inferInsert = {
    provider:   "vitest",
    name:       "testUserDeleteAPI",
    email:      "testUserDeleteAPI@mail.com",
};

test("Delete a user", async () => {
    // to test deleting a user, create a user first
    const res = await createUser(testUserDeleteAPI);
    if (!res.success) {
        throw new Error("Pre-condition failed, could not create user");
    }

    const res2  = await deleteUser(res.data!.user_id);

    expect(res2).toMatchObject({
        success: true,
        status: OPSTATUS.SUCCESS,
        recommendedHttpResponseCode: StatusCodes.OK,
        message: `Deleted User with user_id: ${res.data!.user_id} successfully`,
        data: testUserDeleteAPI,
    });
});
