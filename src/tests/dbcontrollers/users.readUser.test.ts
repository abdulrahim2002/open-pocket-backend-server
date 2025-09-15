import readUser         from "@src/db/dbcontrollers/users.readUser.js";
import createUser       from "@src/db/dbcontrollers/users.createUser.js";
import deleteUser       from "@src/db/dbcontrollers/users.deleteUser.js";
import usersSchema      from "@src/db/schemas/users.schema.js";
import OPSTATUS         from "@src/commons/opstatus.js";
import { StatusCodes }  from "http-status-codes";

const testUserForReadUser: typeof usersSchema.$inferInsert = {
    provider: "vitest",
    name: "testUser-readUser",
    email: "testUser-readUser@mail.com",
};

test("readUser-by-user_id", async () => {
    const resCreateUser = await createUser(testUserForReadUser);
    if (!resCreateUser.success) {
        throw new Error("Precondition failure: Cannot create the user in the first place");
    }

    const resReadUser = await readUser(resCreateUser.data!.user_id);

    // reverse the changes made
    await deleteUser(resCreateUser.data!.user_id);

    expect(resReadUser).toMatchObject({
        success: true,
        status: OPSTATUS.SUCCESS,
        recommendedHttpResponseCode: StatusCodes.OK,
        message: "User retrieved successfully",
        data: testUserForReadUser,
    });
});

test("readUser-by-email", async () => {
    const resCreateUser = await createUser(testUserForReadUser);
    if (!resCreateUser.success) {
        throw new Error("Precondition failure: Cannot create the user in the first place");
    }

    const resReadUser = await readUser(resCreateUser.data!.email);

    await deleteUser(resCreateUser.data!.user_id);

    expect(resReadUser).toMatchObject({
        success: true,
        status: OPSTATUS.SUCCESS,
        recommendedHttpResponseCode: StatusCodes.OK,
        message: "User retrieved successfully",
        data: testUserForReadUser,
    });
});
