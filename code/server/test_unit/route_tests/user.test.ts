import { test, expect, jest , afterEach, describe} from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"

import UserController from "../../src/controllers/userController"

import { User, Role } from "../../src/components/user"
import Authenticator from "../../src/routers/auth"
import {UserNotFoundError} from "../../src/errors/userError"

const baseURL = "/ezelectronics"

//Example of a unit test for the POST ezelectronics/users route
//The test checks if the route returns a 200 success code
//The test also expects the createUser method of the controller to be called once with the correct parameters

test("It should return a 200 success code", async () => {
    const testUser = { //Define a test user object sent to the route
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: "Manager"
    }
    jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
    const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
    expect(response.status).toBe(200) //Check if the response status is 200
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
    //Check if the createUser method has been called with the correct parameters
    expect(UserController.prototype.createUser).toHaveBeenCalledWith(testUser.username,
        testUser.name,
        testUser.surname,
        testUser.password,
        testUser.role)
})

describe("GET /ezelectronics/users", () => {
    const userList : User[] = [
        new User("username1", "name1", "surname1", Role.ADMIN, "", ""),
        new User("username2", "name2", "surname2", Role.MANAGER, "", ""),
        new User("username3", "name3", "surname3", Role.CUSTOMER, "", "")
    ]

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should return a 401 response code if user is not Admin", async () => {
        jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce(userList); //Mock the getUsers method of the controller
        jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => res.status(401).json({ error: "User is not an admin", status: 401 }));
        const response = await request(app).get(baseURL + "/users").send();
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "User is not an admin", status: 401 });
        expect(UserController.prototype.getUsers).toHaveBeenCalledTimes(0);
    })

    test("should return a 200 success code", async () => {
        jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce(userList); //Mock the getUsers method of the controller
        jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
        const response = await request(app).get(baseURL + "/users").send(); //Send a GET request to the route
        expect(response.status).toBe(200); //Check if the response status is 200
        expect(UserController.prototype.getUsers).toHaveBeenCalledTimes(1); //Check if the getUsers method has been called once
        expect(response.body).toEqual(userList); //Check if the response body is equal to the list of users
    });

})


describe("POST /sessions", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test("A validation error should occur", async () => {
        const testCredentials= {
            username: "   ",
            password: "   "
        };
        const response = await request(app).post(baseURL + "/sessions").send(testCredentials);

        expect(response.status).toBe(422);
        expect(response.body.error).toContain("username");
        expect(response.body.error).toContain("password");
    })
})

describe("DELETE /sessions/current", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test("Unauthenticated user", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) =>  res.status(401).json({ error: "Unauthenticated user", status: 401 }))
        const response = await request(app).delete(baseURL + "/sessions/current").send();

        expect(response.status).toBe(401);
    })
})

describe("GET /sessions/current", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test("Unauthenticated user", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) =>  res.status(401).json({ error: "Unauthenticated user", status: 401 }))
        const response = await request(app).get(baseURL + "/sessions/current").send();

        expect(response.status).toBe(401);
    })
})

describe("GET /ezelectronics/users/:username", () => {
    const userList : User[] = [
        new User("username1", "name1", "surname1", Role.ADMIN, "", ""),
        new User("username2", "name2", "surname2", Role.MANAGER, "", ""),
        new User("username3", "name3", "surname3", Role.CUSTOMER, "", "")
    ]

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("should return a 200 success code", async () => {
        jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(userList[0]); //Mock the getUserByUsername method of the controller
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());

        const response = await request(app).get(baseURL + "/users/username1"); //Send a GET request to the route

        expect(response.status).toBe(200); //Check if the response status is 200
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(1); //Check if the getUserByUsername method has been called once
        expect(response.body).toEqual(userList[0]);
    })

    test("should return a 401 unauthorized code if not LoggedIn", async () => {
        jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(userList[0]); //Mock the getUserByUsername method of the controller
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => res.status(401).json({ error: "Unauthenticated user", status: 401 }));

        const response = await request(app).get(baseURL + "/users/username1"); //Send a GET request to the route

        expect(response.status).toBe(401); //Check if the response status is 401
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(0); //Check if the getUserByUsername method has not been called
        expect(response.body).toEqual({ error: "Unauthenticated user", status: 401 });
    });

    test("should return a 404 if user does not exist", async () => {
        jest.spyOn(UserController.prototype, "getUserByUsername").mockRejectedValueOnce(new UserNotFoundError);
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());

        const response = await request(app).get(baseURL + "/users/username4"); //Send a GET request to the route

        expect(response.status).toBe(404); //Check if the response status is 404
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(1); //Check if the getUserByUsername method has been called once
        expect(response.body).toEqual({ error: "The user does not exist", status: 404 });
    });

});


describe("GET /ezelectronics/users/roles/:role", () => {

    const userList : User[] = [
        new User("username3", "name3", "surname3", Role.CUSTOMER, "", ""),
        new User("username4", "name4", "surname4", Role.CUSTOMER, "", "")
    ];

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("should return a 401 response code if user is not Admin", async () => {
        jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce(userList); //Mock the getUsersByRole method of the controller
        jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => res.status(401).json({ error: "User is not an admin", status: 401 }));
        const response = await request(app).get(baseURL + "/users/roles/Customer").send();
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "User is not an admin", status: 401 });
        expect(UserController.prototype.getUsersByRole).toHaveBeenCalledTimes(0);
    });

    test("should return a 200 success code", async () => {
        jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce(userList); //Mock the getUsersByRole method of the controller
        jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
        const response = await request(app).get(baseURL + "/users/roles/Customer").send(); //Send a GET request to the route
        expect(response.status).toBe(200); //Check if the response status is 200
        expect(UserController.prototype.getUsersByRole).toHaveBeenCalledTimes(1); //Check if the getUsersByRole method has been called once
        expect(response.body).toEqual(userList); //Check if the response body is equal to the list of users
    });

    test("should return a 422 response code if the role is not valid", async () => {
        jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce(userList); //Mock the getUsersByRole method of the controller
        jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next());
        const response = await request(app).get(baseURL + "/users/roles/InvalidRole").send(); //Send a GET request to the route
        expect(response.status).toBe(422); //Check if the response status is 422
        expect(UserController.prototype.getUsersByRole).toHaveBeenCalledTimes(0); //Check if the getUsersByRole method has not been called
    });
});


describe("PATCH /ezelectronics/users/:username", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    const userList = [
        new User("username3", "name3", "surname3", Role.CUSTOMER, "Via Amerigo 24", "2000-10-11"),
        new User("username4", "name4", "surname4", Role.CUSTOMER, "Via Amerigo 24", "2024-10-11"), //Error Date
        new User("username5", "name5", "surname5", Role.ADMIN, "Via Amerigo 24", "2000-10-11"),
        new User("username6", "name6", "surname6", Role.ADMIN, "Via Amerigo 24", "2000-10-11")
        ]

    test("should return a 401 unauthorized code if not LoggedIn", async () => {
        jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(userList[0]); //Mock the getUserByUsername method of the controller
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => res.status(401).json({ error: "Unauthenticated user", status: 401 }));

        const response = await request(app).patch(baseURL + "/users/username1").send(); //Send a PATCH request to the route

        expect(response.status).toBe(401); //Check if the response status is 401
        expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(0); //Check if the getUserByUsername method has not been called
        expect(response.body).toEqual({ error: "Unauthenticated user", status: 401 });
    });
});