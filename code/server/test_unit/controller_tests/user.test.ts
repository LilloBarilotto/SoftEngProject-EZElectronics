import { test, expect, jest , afterEach} from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import { User, Role } from "../../src/components/user";

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