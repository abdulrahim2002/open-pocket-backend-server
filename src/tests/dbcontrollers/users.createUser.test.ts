import createUser       from "@src/db/dbcontrollers/users.createUser.js";
import deleteUser from "@src/db/dbcontrollers/users.deleteUser.js";
import { OPSTATUS }     from "@src/db/dbcontrollers/commons/IDbControllerResponse.js";
import { StatusCodes }  from "http-status-codes";


const testUserForCreateUserAPI = {
    provider:   "vitest",
    name:       "createUser-single",
    email:      "createUser-single@mail.com",
};

test("createUser-single", async () => {
    const res = await createUser(testUserForCreateUserAPI);

    // delete the user to reverse the change
    if (res.success) {
        await deleteUser(res.data!.user_id);
    }

    expect(res).toMatchObject({
        success: true,
        status: OPSTATUS.SUCCESS,
        message: "User created successfully",
        recommendedHttpResponseCode: StatusCodes.CREATED,
        data: testUserForCreateUserAPI,
    });
});

const testUserForDuplicateChecking = {
    provider:   "vitest",
    name:       "testUserForDuplicateChecking",
    email:      "testUserForDuplicateChecking@mail.com",
};

test("createUser-duplicate-user", async () => {
    const res1 = await createUser(testUserForDuplicateChecking);
    // since email is unique attribute, this should fail
    const res2 = await createUser(testUserForDuplicateChecking);

    // delete user to reverse change
    if (res1.success) {
        await deleteUser(res1.data!.user_id);
    }
    else {
        throw new Error("Precondition failure. Couldn't create the user in the first place!");
    }

    expect(res2).toMatchObject({
        success: false,
        status: OPSTATUS.UNIQUE_VIOLATION,
        recommendedHttpResponseCode: StatusCodes.CONFLICT,
        message: "User already exists",
    });
});