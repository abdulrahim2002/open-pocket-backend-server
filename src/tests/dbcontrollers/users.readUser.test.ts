import readUser         from "@src/db/dbcontrollers/users.readUser.js";
import createUser       from "@src/db/dbcontrollers/users.createUser.js";
import { usersSchema }  from "@src/db/schemas/users.schema.js";
import { OPSTATUS } from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";
import { StatusCodes } from "http-status-codes";

const testUserForReadUser: typeof usersSchema.$inferInsert = {
    provider: "vitest",
    name: "testUser-readUser",
    email: "testUser-readUser@mail.com",
}

test("readUser", async () => {
    const res1 = await createUser(testUserForReadUser);
    if (!res1.success) {
        throw new Error("Precondition failure: Cannot create the user in the first place");
    }

    const res2 = await readUser(res1.data!.user_id);

    expect(res2).toMatchObject({
        success: true,
        status: OPSTATUS.SUCCESS,
        recommendedHttpResponseCode: StatusCodes.OK,
        message: "User retrieved successfully",
        data: testUserForReadUser,
    });
});