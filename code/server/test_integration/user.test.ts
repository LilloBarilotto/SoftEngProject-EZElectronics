import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals";
import request from 'supertest';
import { app } from "../index";
import { cleanup } from "../src/db/cleanup";

const routePath = "/ezelectronics"; // Base route path for the API

const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" };
const customer1 = { username: "customer1", name: "customer", surname: "customer", password: "customer", role: "Customer" };
const manager = { username: "manager", name: "manager", surname: "manager", password: "manager", role: "Manager" };
const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" };
const admin1 = { username: "admin1", name: "admin1", surname: "admin1", password: "admin1", role: "Admin" };
const customer2 = { username: "customer2", name: "customer2", surname: "customer2", password: "customer2", role: "Customer" };

let customerCookie: string;
let customer1Cookie: string;
let customer2Cookie: string;
let adminCookie: string;
let managerCookie: string
let admin1Cookie: string;

// Helper function that logs in a user and returns the cookie
const login = async (userInfo: any) => {
    return new Promise<string>((resolve, reject) => {
        request(app)
            .post(`${routePath}/sessions`)
            .send(userInfo)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.header["set-cookie"][0]);
            });
    });
};

const postUser = async (userInfo: any) => {
    await request(app)
        .post(`${routePath}/users`)
        .send(userInfo)
        .expect(200);
};

// Before executing tests, clean the database, create users and log in
beforeAll(async () => {
    await cleanup();

    await postUser(manager);
    await postUser(customer);
    await postUser(customer1);
    await postUser(admin);
    await postUser(admin1);
    
    customerCookie = await login(customer);
    customer1Cookie = await login(customer1);
    adminCookie = await login(admin);
    admin1Cookie = await login(admin1);
    managerCookie = await login(manager);
});

// After executing tests, clean the database
afterAll(async () => {
    await cleanup();
});

describe("User tests", () => {
    
    describe("POST /users", () => {
        test("POST /users", async () => {
            const result =await request(app)
                .post(`${routePath}/users`)
                .send({ username: "newUser", name: "newUser", surname: "newUser", password: "newUser", role: "Customer" });
    
            expect(result.status).toBe(200);
        });

        test("POST /users - User already exists", async () => {
            await request(app)
                .post(`${routePath}/users`)
                .send({ username: "newUser", name: "newUser", surname: "newUser", password: "newUser", role: "Customer" })
                .expect(409);
        });
    });
    
    describe("GET /users", () => {
        test("GET /users", async () => {
            const result = await request(app)
                .get(`${routePath}/users`)
                .set("Cookie", adminCookie);
    
            expect(result.status).toBe(200);
            expect(result.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ username: "customer" }),
                    expect.objectContaining({ username: "customer1" }),
                    expect.objectContaining({ username: "manager" }),
                    expect.objectContaining({ username: "admin" }),
                    expect.objectContaining({ username: "newUser" })
                ])
            );
        });
    
        test("GET /users - Not Admin", async () => {
            await request(app)
                .get(`${routePath}/users`)
                .set("Cookie", managerCookie)
                .expect(401);
        });
    });

    describe("GET /users/:username", () => {    
        test("GET /users/:username", async () => {
            const result = await request(app)
                .get(`${routePath}/users/customer`)
                .set("Cookie", adminCookie);
    
            expect(result.status).toBe(200);
            expect(result.body).toEqual(expect.objectContaining({ username: "customer" }));
        });

        test ("GET /users/:username - Not Admin", async () => {
            await request(app)
                .get(`${routePath}/users/customer`)
                .set("Cookie", managerCookie)
                .expect(401);
        });
    });


    describe("DEL /users/:username", () => {

        test("DEL /users/:username - Not Authorized", async () => {
            await request(app)
                .del(`${routePath}/users/NotExistingUser`)
                .set("Cookie", managerCookie)
                .expect(401);
        });

        test("DEL /users/:username - User does not exist", async () => {
            await request(app)
                .del(`${routePath}/users/NotExistingUser`)
                .set("Cookie", adminCookie)
                .expect(404);
        });

        test("DEL /users/:username", async () => {
            await request(app)
                .del(`${routePath}/users/newUser`)
                .set("Cookie", adminCookie)
                .expect(200);
        });
    });

    describe("DEL /users", () => {
        test("DEL /users - Not Admin", async () => {
            await request(app)
                .del(`${routePath}/users`)
                .set("Cookie", managerCookie)
                .expect(401);
        });

        test("DEL /users", async () => {
            await request(app)
                .del(`${routePath}/users`)
                .set("Cookie", adminCookie)
                .expect(200);       
        });
    });

    describe("PATCH /users/:username", () => {

        test("PATCH /users/:username - Empty body", async () => {
            await request(app)
                .patch(`${routePath}/users/customer`)
                .set("Cookie", adminCookie)
                .send({})
                .expect(422);
        });

        test("PATCH /users/:username", async () => {
            await postUser(customer2);
            customer2Cookie = await login(customer2);

            const result = await request(app)
                .patch(`${routePath}/users/customer2`)
                .set("Cookie", customer2Cookie)
                .send({ name: "Patch", surname: "Patch", address: "Patch", birthdate: "2000-01-01" });

            expect(result.status).toBe(200);
            expect(result.body).toEqual({username: "customer2", name: "Patch", surname: "Patch", address: "Patch", birthdate: "2000-01-01", role: "Customer"});
        });

        test("PATCH /users/:username - Not Authorized", async () => {
            await postUser(customer);
            customerCookie = await login(customer);

            await request(app)
                .patch(`${routePath}/users/customer`)
                .set("Cookie", customer2Cookie)
                .send({ name: "Patch", surname: "Patch", address: "Patch", birthdate: "2000-01-01" })
                .expect(401);
        });
    });
});