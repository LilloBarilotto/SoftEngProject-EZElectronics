import { test, expect, jest , afterEach, describe} from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import {Role, User} from "../../src/components/user";
import {UnauthorizedUserError} from "../../src/errors/userError";

jest.mock("../../src/dao/userDAO")

//Example of a unit test for the createUser method of the UserController
//The test checks if the method returns true when the DAO method returns true
//The test also expects the DAO method to be called once with the correct parameters

test("It should return true", async () => {
    const testUser = { //Define a test user object
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: "Manager"
    }
    jest.spyOn(UserDAO.prototype, "createUser").mockResolvedValueOnce(true); //Mock the createUser method of the DAO
    const controller = new UserController(); //Create a new instance of the controller
    //Call the createUser method of the controller with the test user object
    const response = await controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);

    //Check if the createUser method of the DAO has been called once with the correct parameters
    expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
    expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(testUser.username,
        testUser.name,
        testUser.surname,
        testUser.password,
        testUser.role);
    expect(response).toBe(true); //Check if the response is true
});

describe("getUsers", () => {

    const userList : User[] = [
        new User("username1", "name1", "surname1", Role.ADMIN, "", ""),
        new User("username2", "name2", "surname2", Role.MANAGER, "", ""),
        new User("username3", "name3", "surname3", Role.CUSTOMER, "", "")
    ]

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });


    //Example of a unit test for the getUsers method of the UserController
    //The test checks if the method returns the list of users when the DAO method returns the list of users
    //The test also expects the DAO method to be called once
    test("It should return an array of users", async () => {
        jest.spyOn(UserDAO.prototype, "getUsers").mockResolvedValueOnce(userList); //Mock the getUsers method of the DAO
        const controller = new UserController(); //Create a new instance of the controller
        const response = await controller.getUsers(); //Call the getUsers method of the controller

        //Check if the getUsers method of the DAO has been called once
        expect(UserDAO.prototype.getUsers).toHaveBeenCalledTimes(1);
        expect(response).toEqual(userList); //Check if the response is equal to the list of users
    });
});

describe("getUserByUsername", () => {
    const userList : User[] = [
        new User("username1", "name1", "surname1", Role.ADMIN, "", ""),
        new User("username2", "name2", "surname2", Role.MANAGER, "", ""),
        new User("username3", "name3", "surname3", Role.CUSTOMER, "", "")
    ]

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("Should return the user with the given username", async () => {    // Request by itself Ok
        const controller = new UserController();

        const MockGetUserByUsername = jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(userList[2]); //Mock the getUserByUsername method of the DAO
        const response = await controller.getUserByUsername(userList[2], "username3"); //Call the getUserByUsername method of the controller

        expect(MockGetUserByUsername).toHaveBeenCalledTimes(1);
        expect(MockGetUserByUsername).toHaveBeenCalledWith("username3");
        expect(response).toBe(userList[2]);

    });

    test("Should return the user with the given username", async () => {        // Request by Admin Ok
        const controller = new UserController();

        const MockGetUserByUsername = jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(userList[2]); //Mock the getUserByUsername method of the DAO
        const response = await controller.getUserByUsername(userList[0], userList[2].username); //Call the getUserByUsername method of the controller

        expect(MockGetUserByUsername).toHaveBeenCalledTimes(1);
        expect(MockGetUserByUsername).toHaveBeenCalledWith(userList[2].username);
        expect(response).toBe(userList[2]);

    });

    test("Should return UnauthorizedUserError", async () => { //  Request by Customer about other user info
        const controller = new UserController();

        const MockGetUserByUsername = jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(userList[0]); //Mock the getUserByUsername method of the DAO
        const response = controller.getUserByUsername(userList[2], "username1"); //Call the getUserByUsername method of the controller

        expect(response).rejects.toThrow(UnauthorizedUserError);
        expect(MockGetUserByUsername).toHaveBeenCalledTimes(0);
    });

    test("Should return UnauthorizedUserError", async () => { //  Request by Manager about other user info
        const controller = new UserController();

        const MockGetUserByUsername =jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(userList[0]); //Mock the getUserByUsername method of the DAO
        const response = controller.getUserByUsername(userList[1], "username1"); //Call the getUserByUsername method of the controller

        expect(response).rejects.toThrow(UnauthorizedUserError);
        expect(MockGetUserByUsername).toHaveBeenCalledTimes(0);
    });

});


describe("getUsersByRole", () => {

    const userList : User[] = [
        new User("username3", "name3", "surname3", Role.CUSTOMER, "", ""),
        new User("username4", "name4", "surname4", Role.CUSTOMER, "", "")
    ]

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });


    //Example of a unit test for the getUsers method of the UserController
    //The test checks if the method returns the list of users when the DAO method returns the list of users
    //The test also expects the DAO method to be called once
    test("It should return an array of users", async () => {
        const MockGetUsersByRole = jest.spyOn(UserDAO.prototype, "getUsersByRole").mockResolvedValueOnce(userList); //Mock the getUsersByRole method of the DAO 
        const controller = new UserController(); //Create a new instance of the controller
        const response = await controller.getUsersByRole("Customer"); //Call the getUsers method of the controller

        //Check if the getUsers method of the DAO has been called once
        expect(MockGetUsersByRole).toHaveBeenCalledTimes(1);
        expect(response).toEqual(userList); //Check if the response is equal to the list of users
    });
});