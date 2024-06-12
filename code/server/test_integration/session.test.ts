import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../index"
import { cleanup } from "../src/db/cleanup"
import {body} from "express-validator";

const routePath = "/ezelectronics" //Base route path for the API
const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }


const postUser = async (userInfo: any) => {
    await request(app)
        .post(`${routePath}/users`)
        .send(userInfo)
        .expect(200)
}

beforeAll(async () => {
    await cleanup();
    await postUser(customer);
})

afterAll(async () => {
    await cleanup();
})

describe("Session routes integration tests", () => {
    describe("POST /ezelectronics/sessions",  () => {
       test("It should return a 200 status code", async () => {
           const body = {username:"customer", password:"customer"};
           const result = await request(app)
               .post(`${routePath}/sessions`)
               .send(body)

           expect(result.status).toBe(200);
       })

        test("It should return a 401 status code if the username does not exist", async () => {
            const body = {username:"test", password:"customer"};
            const result = await request(app)
                .post(`${routePath}/sessions`)
                .send(body)

            expect(result.status).toBe(401);
        })

        test("It should return a 401 status code if the password provided does not match the one in the database", async () => {
            const body = {username:"customer", password:"test"};
            const result = await request(app)
                .post(`${routePath}/sessions`)
                .send(body)

            expect(result.status).toBe(401);
        })
    })

    describe("DELETE /ezelectronics/sessions/current",  () => {

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

        test("It should return a 200 status code", async () => {
            let customerCookie = await login(customer);
            const result = await request(app)
                .delete(`${routePath}/sessions/current`)
                .set("Cookie", customerCookie)
                .expect(200);
        })
    })

    describe("GET /ezelectronics/sessions/current",  () => {

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

        test("It should return a 200 status code", async () => {
            let customerCookie = await login(customer);
            const result = await request(app)
                .get(`${routePath}/sessions/current`)
                .set("Cookie", customerCookie)
                .expect(200);
        })
    })

})