import {afterEach, expect, jest, test, describe} from "@jest/globals"
import UserDAO from "../../src/dao/userDAO"
import crypto from "crypto"
import db from "../../src/db/db"
import {Database} from "sqlite3"

import {Role, User} from "../../src/components/user"
import {UserNotFoundError} from "../../src/errors/userError"


jest.mock("crypto")
jest.mock("../../src/db/db.ts")

//Example of unit test for the createUser method
//It mocks the database run method to simulate a successful insertion and the crypto randomBytes and scrypt methods to simulate the hashing of the password
//It then calls the createUser method and expects it to resolve true

test("It should resolve true", async () => {
    const userDAO = new UserDAO()
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null)
        return {} as Database
    });
    const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
        return (Buffer.from("salt"))
    })
    const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (password, salt, keylen) => {
        return Buffer.from("hashedPassword")
    })
    const result = await userDAO.createUser("username", "name", "surname", "password", "role")
    expect(result).toBe(true)
    mockRandomBytes.mockRestore()
    mockDBRun.mockRestore()
    mockScrypt.mockRestore()


})

describe("getUsers", () => {

    const userList : User[] = [
        new User("username1", "name1", "surname1", Role.ADMIN, "", ""),
        new User("username2", "name2", "surname2", Role.MANAGER, "", ""),
        new User("username3", "name3", "surname3", Role.CUSTOMER, "", "")
    ]

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test("It should return an array of users with the userList", async () => {
        const userDAO = new UserDAO()
        const mockDBGet = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, userList)
            return {} as Database
        });
        const result = await userDAO.getUsers()
        expect(result).toEqual(userList)

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

    test("It should return the user with the specified username", async () => {
        const userDAO = new UserDAO()
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, userList[0])
            return {} as Database
        })

        const result = await userDAO.getUserByUsername(userList[0].username)
        
        expect(result).toEqual(userList[0])
        expect(mockDBGet).toHaveBeenCalledTimes(1);
        expect(mockDBGet).toHaveBeenCalledWith("SELECT * FROM users WHERE username = ?", [userList[0].username], expect.any(Function))
    })

    test("It should reject with an 'UserNotFoundError' if the user does not exist", async () => {
        const userDAO = new UserDAO()
        const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, undefined)
            return {} as Database
        })
        
        await expect(userDAO.getUserByUsername("username4")).rejects.toThrow(UserNotFoundError)
        
        expect(mockDBGet).toHaveBeenCalledTimes(1);
        expect(mockDBGet).toHaveBeenCalledWith("SELECT * FROM users WHERE username = ?", ["username4"], expect.any(Function))
    })
});