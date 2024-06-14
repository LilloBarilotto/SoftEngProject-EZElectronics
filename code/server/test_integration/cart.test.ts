import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals";
import request from 'supertest';
import { app } from "../index";
import { cleanup } from "../src/db/cleanup";
import dayjs from "dayjs";
import CartDAO from "../src/dao/cartDAO";
import { Cart } from "../src/components/cart";

const routePath = "/ezelectronics"; // Base route path for the API

const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" };
const customer1 = { username: "customer1", name: "customer", surname: "customer", password: "customer", role: "Customer" };
const manager = { username: "manager", name: "manager", surname: "manager", password: "manager", role: "Manager" };
const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" };
const product = {model: "iPhone13", category: "Smartphone", quantity: 5, details: "", sellingPrice: 200, arrivalDate: "2024-01-01"};
const product2 = {model: "macbook", category: "Smartphone", quantity: 5, details: "", sellingPrice: 200, arrivalDate: "2024-01-01"};


let customerCookie: string;
let customer1Cookie: string;
let adminCookie: string;
let managerCookie: string

const postUser = async (userInfo: any) => {
    await request(app)
        .post(`${routePath}/users`)
        .send(userInfo)
        .expect(200);
};

const postProduct = async (productInfo: any) => {
    await request(app)
        .post(`${routePath}/products`)
        .set("Cookie", adminCookie)
        .send(productInfo)
        .expect(200);
};
const sellProduct =  async (model: string, body: any) => {
    await request(app)
    .patch(`${routePath}/products/${model}/sell`)
    .set("Cookie", managerCookie)
    .send(body)
    .expect(200);
};

const addProductToCart = async (body: any) => {
    await request(app)
        .post(`${routePath}/carts`)
        .set("Cookie", customerCookie)
        .send(body)
        .expect(200);
};

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

// Before executing tests, clean the database, create users and log in
beforeAll(async () => {
    await cleanup();
    await postUser(manager);
    await postUser(customer);
    await postUser(customer1);
    
    await postUser(admin);
    customerCookie = await login(customer);
    customer1Cookie = await login(customer1);
    adminCookie = await login(admin);
    managerCookie = await login(manager);
    await postProduct(product);
});


// After executing tests, clean the database
afterAll(async () => {
    await cleanup();
});

describe("Cart routes integration tests", () => {
    describe("GET /carts", () => {
        test("It should return an empty cart for a new customer", async () => {
            const result = await request(app)
                .get(`${routePath}/carts`)
                .set("Cookie", customerCookie);

            expect(result.status).toBe(200);
            expect(result.body).toEqual({customer: customer.username, paid: false, paymentDate: null, total: 0, products: []});
        });
    });

    describe("POST /carts", () => {
        test("It should add a product to the cart", async () => {
            const body = {model: product2.model};
            await postProduct(product2)
            const result = await request(app)
                .post(`${routePath}/carts`)
                .set("Cookie", customerCookie)
                .send(body);

            expect(result.status).toBe(200);

            const cartResult = await request(app)
                .get(`${routePath}/carts`)
                .set("Cookie", customerCookie);
            expect(cartResult.status).toBe(200);
        });

        test("It should return a 404 error if model does not represent an existing product", async () => {
            const body = {model: "NonExistentModel"};
            const result = await request(app)
                .post(`${routePath}/carts`)
                .set("Cookie", customerCookie)
                .send(body);

            expect(result.status).toBe(404);
        });

        test("It should return a 409 error if model represents a product whose available quantity is 0", async () => {
            await postProduct({model: "OutOfStock", category: "Smartphone", quantity: 10, details: "", sellingPrice: 100, arrivalDate: "2024-01-01"});
            await sellProduct("OutOfStock",{quantity: 10, sellingDate: dayjs().subtract(1, "day").format("YYYY-MM-DD")})
            const body = {model: "OutOfStock"};
            const result = await request(app)
                .post(`${routePath}/carts`)
                .set("Cookie", customerCookie)
                .send(body);

            expect(result.status).toBe(409);
        });
    });

    describe("PATCH /ezelectronics/carts", () => {
        test("Should simulate payment for the cart", async () => {
            
            await request(app)
                .post(`${routePath}/carts`)
                .set("Cookie", customerCookie)
                .send({ model: product.model })
                .expect(200);

            const res = await request(app)
                .get(`${routePath}/carts`)
                .set("Cookie", customerCookie)
                .expect(200);

            await request(app)
                .patch(`${routePath}/carts`)
                .set("Cookie", customerCookie)
                .expect(200);
        });

        test("It should return a 404 error if there is no information about an unpaid cart in the database", async () => {
            const result = await request(app)
                .patch(`${routePath}/carts`)
                .set("Cookie", customer1Cookie);
            expect(result.status).toBe(404);
        });

        test("It should return a 400 error if there is an unpaid cart but the cart contains no product", async () => {
            const cart: Cart = { customer: "customer1", paid: false, paymentDate: "", total: 100, products: [] };

            jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValue(cart);
            const result = await request(app)
                .patch(`${routePath}/carts`)
                .set("Cookie", customer1Cookie);

            expect(result.status).toBe(400);
        });

        test("It should return a 409 error if there is at least one product in the cart whose available quantity in the stock is 0", async () => {
            await postProduct({model: "OutOfStock2", category: "Smartphone", quantity: 10, details: "", sellingPrice: 100, arrivalDate: "2024-01-01"});
            const body = {model: "OutOfStock2"};
            await request(app)
                .post(`${routePath}/carts`)
                .set("Cookie", customerCookie)
                .send(body)
                .expect(200);
            await sellProduct("OutOfStock2",{quantity: 10, sellingDate: dayjs().subtract(1, "day").format("YYYY-MM-DD")})
            const result = await request(app)
                .patch(`${routePath}/carts`)
                .set("Cookie", customerCookie);

            expect(result.status).toBe(409);
        });

        test("It should return a 409 error if there is at least one product in the cart whose quantity is higher than the available quantity in the stock", async () => {
            const body = {model: "iPhone13"};
            await request(app)
                .post(`${routePath}/carts`)
                .set("Cookie", customerCookie)
                .send(body);
            await request(app)
                .post(`${routePath}/carts`)
                .set("Cookie", customerCookie)
                .send(body);
            await request(app)
                .post(`${routePath}/carts`)
                .set("Cookie", customerCookie)
                .send(body);
            await request(app)
                .post(`${routePath}/carts`)
                .set("Cookie", customerCookie)
                .send(body);
            await request(app)
                .post(`${routePath}/carts`)
                .set("Cookie", customerCookie)
                .send(body);
            await request(app)
                .post(`${routePath}/carts`)
                .set("Cookie", customerCookie)
                .send(body);

            const result = await request(app)
                .patch(`${routePath}/carts`)
                .set("Cookie", customerCookie);

            expect(result.status).toBe(409);
        });
    });

    describe("GET /carts/history", () => {
        test("It should return the history of past orders", async () => {
            const result = await request(app)
                .get(`${routePath}/carts/history`)
                .set("Cookie", customerCookie);
            expect(result.status).toBe(200);
            expect(result.body).toEqual([{
                    customer: "customer",
                    paid: true,
                    total: expect.any(Number),
                    paymentDate: expect.any(String),
                    products: expect.any(Array)
                }])
        });
    });

    describe("DELETE /carts/products/:model", () => {
        test("It should remove a product from the cart", async () => {
            await addProductToCart({model:"iPhone13"})
            const result = await request(app)
                .delete(`${routePath}/carts/products/iPhone13`)
                .set("Cookie", customerCookie);

            expect(result.status).toBe(200);
        });

        test("It should return a 404 error if the product is not in the cart", async () => {
            const result = await request(app)
                .delete(`${routePath}/carts/products/iPhone14`)
                .set("Cookie", customerCookie);

            expect(result.status).toBe(404);
        });
    });

    describe("DELETE /carts/current", () => {
        test("It should empty the current cart", async () => {
            const result = await request(app)
                .delete(`${routePath}/carts/current`)
                .set("Cookie", customerCookie);

            expect(result.status).toBe(200);

            const cartResult = await request(app)
                .get(`${routePath}/carts`)
                .set("Cookie", customerCookie);

            expect(cartResult.status).toBe(200);
            expect(cartResult.body).toMatchObject({
                customer: "customer1",
                paid: false,
                paymentDate: null,
                total: 0,
                products: []
            });
        });

        test("It should return a 404 error if there is no information about an unpaid cart for the user", async () => {
            const result = await request(app)
                .delete(`${routePath}/carts/current`)
                .set("Cookie", customer1Cookie);
                console.log(result.body);
            expect(result.status).toBe(404);
        });
    });

    describe("DELETE /carts", () => {
        test("It should delete all existing carts of all users", async () => {
            const result = await request(app)
                .delete(`${routePath}/carts`)
                .set("Cookie", adminCookie);

            expect(result.status).toBe(200);
        });

        test("It should return a 401 error if the user is not Admin or Manager", async () => {
            const result = await request(app)
                .delete(`${routePath}/carts`)
                .set("Cookie", customerCookie);

            expect(result.status).toBe(401);
        });
    });

    describe("GET /carts/all", () => {
       
        test("It should return a 401 error if the user is not Admin or Manager", async () => {
            const result = await request(app)
                .get(`${routePath}/carts/all`)
                .set("Cookie", customerCookie);

            expect(result.status).toBe(401);
        });
        test("It should return all carts of all users", async () => {
            const result = await request(app)
                .get(`${routePath}/carts/all`)
                .set("Cookie", adminCookie);            
            expect(result.status).toBe(200);
            expect(result.body).toEqual(expect.any(Array));
        });

    });
});
