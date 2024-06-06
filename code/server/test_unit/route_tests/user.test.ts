import {afterEach, expect, jest, test} from "@jest/globals"
import request from 'supertest'
import {app} from "../../index"

import UserController from "../../src/controllers/userController"
import {Role, User} from "../../src/components/user"
import Authenticator from "../../src/routers/auth"

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