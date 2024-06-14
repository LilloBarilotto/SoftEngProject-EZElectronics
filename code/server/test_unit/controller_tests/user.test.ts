import { test, expect, jest , afterEach, describe} from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import {Role, User} from "../../src/components/user";
import {UnauthorizedUserError, BirtdateAfterCurrentDateError, UserNotFoundError} from "../../src/errors/userError";
import Authenticator from "../../src/routers/auth"
import exp from "constants";

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

describe("UpdateUser", () => {
    const userList = [
    new User("username3", "name3", "surname3", Role.CUSTOMER, "Via Amerigo 24", "2000-10-11"),
    new User("username4", "name4", "surname4", Role.CUSTOMER, "Via Amerigo 24", "2024-10-11"), //Error Date
    new User("username5", "name5", "surname5", Role.ADMIN, "Via Amerigo 24", "2000-10-11"),
    new User("username6", "name6", "surname6", Role.ADMIN, "Via Amerigo 24", "2000-10-11")
    ]

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("Should return the user updated", async () => {    // Request by itself Ok
        const controller = new UserController();

        const MockGetUserByUsername = jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(userList[0]); //Mock the getUserByUsername method of the DAO
        const MockUpdateUser = jest.spyOn(UserDAO.prototype, "updateUser").mockResolvedValueOnce(userList[0]); //Mock the updateUser method of the DAO

        const response = await controller.updateUserInfo(userList[0], userList[0].name, userList[0].surname, userList[0].address, userList[0].birthdate, userList[0].username); //Call the updateUser method of the controller

        expect(MockGetUserByUsername).toHaveBeenCalledTimes(1);
        expect(MockGetUserByUsername).toHaveBeenCalledWith(userList[0].username);
        expect(MockUpdateUser).toHaveBeenCalledTimes(1);
        expect(MockUpdateUser).toHaveBeenCalledWith(userList[0].username, userList[0].name, userList[0].surname, userList[0].address, userList[0].birthdate, userList[0].role);
        expect(response).toBe(userList[0]);
    });

    test("Should return the user updated | Admin change other NonAdmin", async () => {        // Request by Admin Ok
        const controller = new UserController();

        const MockGetUserByUsername = jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(userList[0]); //Mock the getUserByUsername method of the DAO
        const MockUpdateUser = jest.spyOn(UserDAO.prototype, "updateUser").mockResolvedValueOnce(userList[0]); //Mock the updateUser method of the DAO

        const response = await controller.updateUserInfo(userList[2], userList[0].name, userList[0].surname, userList[0].address, userList[0].birthdate, userList[0].username); //Call the updateUser method of the controller

        expect(MockGetUserByUsername).toHaveBeenCalledTimes(1);
        expect(MockGetUserByUsername).toHaveBeenCalledWith(userList[0].username);
        expect(MockUpdateUser).toHaveBeenCalledTimes(1);
        expect(MockUpdateUser).toHaveBeenCalledWith(userList[0].username, userList[0].name, userList[0].surname, userList[0].address, userList[0].birthdate, userList[0].role);
        expect(response).toBe(userList[0]);
    });

    test("Should return UserNotFoundError", async () => {
        const controller = new UserController();

        const MockGetUserByUsername = jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(undefined); //Mock the getUserByUsername method of the DAO
        const MockUpdateUser = jest.spyOn(UserDAO.prototype, "updateUser").mockResolvedValueOnce(userList[0]); //Mock the updateUser method of the DAO
        const response = controller.updateUserInfo(userList[2], userList[0].name, userList[0].surname, userList[0].address, userList[0].birthdate, userList[0].username); //Call the updateUser method of the controller

        expect(response).rejects.toThrow(UserNotFoundError);
        expect(MockGetUserByUsername).toHaveBeenCalledTimes(1);
        expect(MockUpdateUser).toHaveBeenCalledTimes(0);

    });

    test("Should return BirthDateAfterCurrentDate Error", async () =>{
        const controller = new UserController(); // User 1 have date error

        const MockGetUserByUsername = jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(undefined); //Mock the getUserByUsername method of the DAO
        const MockUpdateUser = jest.spyOn(UserDAO.prototype, "updateUser").mockResolvedValueOnce(userList[0]); //Mock the updateUser method of the DAO
        const response = controller.updateUserInfo(userList[2], userList[1].name, userList[1].surname, userList[1].address, userList[1].birthdate, userList[1].username);

        expect(response).rejects.toThrow(BirtdateAfterCurrentDateError);
        expect(MockGetUserByUsername).toHaveBeenCalledTimes(0);
        expect(MockUpdateUser).toHaveBeenCalledTimes(0);
    });

    test("Should return UnauthorizedUserError", async () =>{
        const controller = new UserController(); // Customer try to update another user

        const MockGetUserByUsername = jest.spyOn(UserDAO.prototype, "getUserByUsername").mockRejectedValueOnce(null); //Mock the getUserByUsername method of the DAO
        const MockUpdateUser = jest.spyOn(UserDAO.prototype, "updateUser").mockResolvedValueOnce(userList[2]); //Mock the updateUser method of the DAO
        const response = controller.updateUserInfo(userList[0], userList[2].name, userList[2].surname, userList[2].address, userList[2].birthdate, userList[2].username);

        expect(response).rejects.toThrow(UnauthorizedUserError);
        expect(MockGetUserByUsername).toHaveBeenCalledTimes(0);
        expect(MockUpdateUser).toHaveBeenCalledTimes(0);

    });

    test("Should return UnauthorizedUserError | Admin try to update other Admin", async () =>{
        const controller = new UserController(); // Admin try to update another Admin

        const MockGetUserByUsername = jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(userList[3]); //Mock the getUserByUsername method of the DAO
        const MockUpdateUser = jest.spyOn(UserDAO.prototype, "updateUser").mockResolvedValueOnce(userList[3]); //Mock the updateUser method of the DAO
        const response = controller.updateUserInfo(userList[2], userList[3].name, userList[3].surname, userList[3].address, userList[3].birthdate, userList[3].username);

        expect(response).rejects.toThrow(UnauthorizedUserError);
        expect(MockGetUserByUsername).toHaveBeenCalledTimes(1);
        expect(MockUpdateUser).toHaveBeenCalledTimes(0);

    });
});

describe("Delete All users (Non Admin)", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test("It should resolve true", async () => {

        jest.spyOn(UserDAO.prototype, "deleteAllNonAdminUsers").mockResolvedValueOnce(true);
        const controller = new UserController();

        const result = await controller.deleteAll();
        expect(result).toBe(true);
        expect(UserDAO.prototype.deleteAllNonAdminUsers).toHaveBeenCalledTimes(1);
    });

    test("It should reject", async () => {

        jest.spyOn(UserDAO.prototype, "deleteAllNonAdminUsers").mockResolvedValueOnce(false);
        const controller = new UserController();

        const result = controller.deleteAll();
        expect(result).rejects;
        expect(UserDAO.prototype.deleteAllNonAdminUsers).toHaveBeenCalledTimes(1);
    });
});

describe("Delete User", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    const userList : User[] = [
        new User("username1", "name1", "surname1", Role.ADMIN, "", ""),
        new User("username2", "name2", "surname2", Role.MANAGER, "", ""),
        new User("username3", "name3", "surname3", Role.CUSTOMER, "", ""),
        new User("username4", "name4", "surname4", Role.ADMIN, "", "")
    ]

    test("It should resolve true | Customer delete itself", async () => {
        const controller = new UserController();

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockResolvedValueOnce(true);
        jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(userList[2]);
        jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValueOnce(true);

        const result = await controller.deleteUser(userList[2], userList[2].username);

        expect(result).toBe(true);
        expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);
        expect(UserDAO.prototype.deleteUser).toHaveBeenCalledWith(userList[2].username);
        expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
        expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith(userList[2].username);
    });


    test("It should resolve true | Admin delete NonAdminUser", async () => {
        const controller = new UserController();

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockResolvedValueOnce(true);
        jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(userList[2]);
        jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValueOnce(true);

        const result = await controller.deleteUser(userList[0], userList[2].username);

        expect(result).toBe(true);
        expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);
        expect(UserDAO.prototype.deleteUser).toHaveBeenCalledWith(userList[2].username);
        expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
        expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith(userList[2].username);
    });

    test("It should reject with UnauthorizedUserError | Admin delete another Admin", async () => {
        const controller = new UserController();

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockResolvedValueOnce(true);
        jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(userList[3]);
        jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValueOnce(true);

        const result = controller.deleteUser(userList[0], userList[3].username);
        expect(result).rejects.toThrow(UnauthorizedUserError);
        expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(0);
        expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
    });

    test("It should reject with UnauthorizedUserError | NonAdminUser delete another User", async () => {
        const controller = new UserController();

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockResolvedValueOnce(true);
        jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(userList[2]);
        jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValueOnce(true);

        const result = controller.deleteUser(userList[2], userList[1].username);
        expect(result).rejects.toThrow(UnauthorizedUserError);
        expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(0);
        expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(0);
    });

    test("It should reject with UserNotFoundError", async () => {
        const controller = new UserController();

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockResolvedValueOnce(true);
        jest.spyOn(UserDAO.prototype, "getUserByUsername").mockRejectedValueOnce(new UserNotFoundError());
        jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValueOnce(true);

        const result = controller.deleteUser(userList[0], "nonExistingUser");
        expect(result).rejects.toThrow(UserNotFoundError);
        expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(0);
        expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
    });
});