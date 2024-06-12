import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../index"
import { cleanup } from "../src/db/cleanup"
import {body} from "express-validator";

const routePath = "/ezelectronics" //Base route path for the API

const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }
const customer1 = { username: "customer1", name: "customer", surname: "customer", password: "customer", role: "Customer" }
const manager = { username: "manager", name: "manager", surname: "manager", password: "manager", role: "Manager" }
const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" }
const product = {model: "iPhone13", category: "Smartphone", quantity: 5, details: "", sellingPrice: 200, arrivalDate: "2024-01-01"}

let customerCookie: string
let customer1Cookie: string
let adminCookie: string

const postUser = async (userInfo: any) => {
    await request(app)
        .post(`${routePath}/users`)
        .send(userInfo)
        .expect(200)
}

const postProduct = async (productInfo: any) => {
    await request(app)
        .post(`${routePath}/products`)
        .set("Cookie", adminCookie)
        .send(productInfo)
        .expect(200)
}

//Helper function that logs in a user and returns the cookie
//Can be used to log in a user before the tests or in the tests
const login = async (userInfo: any) => {
    return new Promise<string>((resolve, reject) => {
        request(app)
            .post(`${routePath}/sessions`)
            .send(userInfo)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res.header["set-cookie"][0])
            })
    })
}

//Before executing tests, we remove everything from our test database, create an Admin user and log in as Admin, saving the cookie in the corresponding variable
beforeAll(async () => {
    await cleanup();
    await postUser(customer);
    await postUser(customer1);
    await postUser(admin);
    customerCookie = await login(customer);
    customer1Cookie = await login(customer1);
    adminCookie = await login(admin);
    await postProduct(product);
})

//After executing tests, we remove everything from our test database
afterAll(async () => {
    await cleanup();
})

describe("Review routes integration tests", () => {
    describe("POST /reviews/:model", () => {
        test("It should return a 200 success code and add a new review", async () => {
            const body = {score: 5, comment: "A very cool smartphone!"};
            const result = await request(app)
                .post(`${routePath}/reviews/iPhone13`)
                .set("Cookie", customerCookie)
                .send(body)

            expect(result.status).toBe(200);

        })

        test("It should return a 404 error code if model does not represent an existing product in the database", async () => {
            const body = {score: 5, comment: "A very cool smartphone!"};
            const result = await request(app)
                .post(`${routePath}/reviews/iPhone14`)
                .set("Cookie", customerCookie)
                .send(body)

            expect(result.status).toBe(404);
        })

        test("It should return a 409 error code if there is an existing review for the product made by the customer", async () => {
            const body = {score: 5, comment: "A very cool smartphone!"};
            const result = await request(app)
                .post(`${routePath}/reviews/iPhone13`)
                .set("Cookie", customerCookie)
                .send(body)

            expect(result.status).toBe(409);
        })

        test("It should return a 422 error code if at least one request body parameter is empty/incorrect", async () => {
            await request(app)
                .post(`${routePath}/reviews/iPhone13`)
                .set("Cookie", customerCookie)
                .send({score: 5})
                .expect(422)
            await request(app)
                .post(`${routePath}/reviews/iPhone13`)
                .set("Cookie", customerCookie)
                .send({score: -3})
                .expect(422)
            await request(app)
                .post(`${routePath}/reviews/iPhone13`)
                .set("Cookie", customerCookie)
                .send({})
                .expect(422)
            await request(app)
                .post(`${routePath}/reviews/iPhone13`)
                .set("Cookie", customerCookie)
                .send({comment: "ok"})
                .expect(422)

        })
    })

    describe("GET /reviews/:model", () => {
        test("It should return a 200 success code", async () => {
            const result = await request(app)
                .get(`${routePath}/reviews/iPhone13`)
                .set("Cookie", customerCookie)
                .expect(200)

            let reviews = result.body;

            expect(reviews).toHaveLength(1);
            expect(reviews[0].score).toBe(5);
            expect(reviews[0].comment).toBe("A very cool smartphone!");

        })

        test("It should return a 404 error code if model does not represent an existing product in the database", async () => {
            await request(app)
                .get(`${routePath}/reviews/iPhone14`)
                .set("Cookie", customerCookie)
                .expect(404)
        })

        test("It should return a 401 error code if the user is unauthenticated", async () => {
            await request(app)
                .get(`${routePath}/reviews/iPhone14`)
                .expect(401)
        })
    })

    describe("DELETE /reviews/:model", () => {
        test("It should return a 200 success code", async () => {
            await request(app)
                .delete(`${routePath}/reviews/iPhone13`)
                .set("Cookie", customerCookie)
                .expect(200)
        })

        test("It should return a 404 error code if model does not represent an existing product in the database", async () => {
            await request(app)
                .delete(`${routePath}/reviews/iPhone14`)
                .set("Cookie", customerCookie)
                .expect(404)
        })

        test("It should return a 404 error code if the current user does not have a review for the product identified by model", async () => {
            await request(app)
                .delete(`${routePath}/reviews/iPhone13`)
                .set("Cookie", customerCookie)
                .expect(404)
        })

        test("It should return a 401 error code if the user is unauthenticated", async () => {
            await request(app)
                .delete(`${routePath}/reviews/iPhone13`)
                .expect(401)
        })

        test("It should return a 401 error code if the current user is not authorized", async () => {
            await request(app)
                .delete(`${routePath}/reviews/iPhone13`)
                .set("Cookie", adminCookie)
                .expect(401)
        })

    })

    describe("DELETE /reviews/:model/all", () => {
        test("It should return a 200 success code", async () => {
            const body = {score: 5, comment: "A very cool smartphone!"};
            await request(app)
                .post(`${routePath}/reviews/iPhone13`)
                .set("Cookie", customerCookie)
                .send(body)

            await request(app)
                .post(`${routePath}/reviews/iPhone13`)
                .set("Cookie", customer1Cookie)
                .send(body)

            await request(app)
                .delete(`${routePath}/reviews/iPhone13/all`)
                .set("Cookie", adminCookie)
                .expect(200)

        })

        test("It should return a 404 error code if model does not represent an existing product in the database", async () => {
            await request(app)
                .delete(`${routePath}/reviews/iPhone14/all`)
                .set("Cookie", adminCookie)
                .expect(404)
        })

        test("It should return a 401 error code if the current user is not authorized", async () => {
            await request(app)
                .delete(`${routePath}/reviews/iPhone13/all`)
                .set("Cookie", customerCookie)
                .expect(401)
        })
    })

    describe("DELETE /reviews", () => {
        test("It should return a 200 success code", async () => {
            const body = {score: 5, comment: "A very cool smartphone!"};
            await request(app)
                .post(`${routePath}/reviews/iPhone13`)
                .set("Cookie", customerCookie)
                .send(body)

            await request(app)
                .post(`${routePath}/reviews/iPhone13`)
                .set("Cookie", customer1Cookie)
                .send(body)

            await request(app)
                .delete(`${routePath}/reviews`)
                .set("Cookie", adminCookie)
                .expect(200)

        })

        test("It should return a 401 error code if the current user is not authorized", async () => {
            await request(app)
                .delete(`${routePath}/reviews/iPhone13/all`)
                .set("Cookie", customerCookie)
                .expect(401)
        })
    })
})