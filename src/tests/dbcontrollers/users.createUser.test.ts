import createUser       from "@src/db/dbcontrollers/users.createUser.js";
import deleteAll        from "@src/db/dbcontrollers/users.deleteAll.js";
import { OPSTATUS }     from "@src/db/dbcontrollers/IDbControllerResponse.js";
import { StatusCodes }  from "http-status-codes";

afterEach(async () => {
    await deleteAll();
});

const testUser = {
    provider: "vitest",
    name: "randomuser",
    email: "randomuser@mail.com",
}

test("Create a new user", async () => {
    const res = await createUser(testUser);

    expect(res).toMatchObject({
        success: true,
        status: OPSTATUS.SUCCESS,
        message: "User created successfully",
        recommendedHttpResponseCode: StatusCodes.CREATED,
        data: {
            // uid must be generated automatically
            provider: "vitest",
            name: "randomuser",
            email: "randomuser@mail.com",
        },
    });
});

const duplicateUser = {
    provider: "jest",
    name: "duplicateuser",
    email: "duplicateuser@mail.com",
}

test("Create duplicate user", async () => {
    await createUser(duplicateUser);
    // since email is unique attribute, this should fail
    const res2 = await createUser(duplicateUser);

    expect(res2).toMatchObject({
        success: false,
        status: OPSTATUS.UNIQUE_VIOLATION,
        recommendedHttpResponseCode: StatusCodes.CONFLICT,
        message: "User already exists",
    });
});