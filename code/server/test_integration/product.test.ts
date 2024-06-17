import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../index"
import { cleanup, cleanProducts } from "../src/db/cleanup"
import dayjs from "dayjs";

const routePath = "/ezelectronics" //Base route path for the API
const manager = { username: "manager", name: "manager", surname: "manager", password: "manager", role: "Manager" }
const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }
const product = {model: "iPhone13", category: "Smartphone", quantity: 5, details: "", sellingPrice: 200, arrivalDate: dayjs().subtract(10, "day").format("YYYY-MM-DD")}
let managerCookie: string
let customerCookie: string

const postUser = async (userInfo: any) => {
    await request(app)
        .post(`${routePath}/users`)
        .send(userInfo)
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

const getProducts = async () => {
    return new Promise<any>((resolve, reject) => {
        request(app)
            .get(`${routePath}/products`)
            .expect(200)
            .set("Cookie", managerCookie)
            .end((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res.body)
            })
    })
}

const postProduct = async (productInfo: any) => {
    return new Promise<any>((resolve, reject) => {
        request(app)
            .post(`${routePath}/products`)
            .expect(200)
            .set("Cookie", managerCookie)
            .send(productInfo)
            .end((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res.body)
            })
    })
}

beforeAll(async () => {
    await cleanup();
    await postUser(manager);
    await postUser(customer);
});

beforeEach(async () => {
    await cleanProducts();
    managerCookie = await login(manager);
    customerCookie = await login(customer);
});

afterAll(async () => {
    await cleanup();
});

afterEach(async () => {
    await cleanProducts();
});

describe("Product routes integration tests", () => {
    describe("POST /ezelectronics/products",  () => {
        test("It should return a 401 status code", async () => {
            const body = {model:"iPhone 13", category:"Smartphone", quantity:5, details:"Best phone out there!!!", sellingPrice:1500, arrivalDate:"2024-01-01"};
            const result = await request(app)
                .post(`${routePath}/products`)
                .send(body)

            const products = await getProducts();

            expect(result.status).toBe(401);
            expect(products.length).toBe(0);
        });

        test("It should return a 200 status code", async () => {
            const body = {model:"iPhone 13", category:"Smartphone", quantity:5, details:"Best phone out there!!!", sellingPrice:1500, arrivalDate:"2024-01-01"};
            const result = await request(app)
                .post(`${routePath}/products`)
                .set("Cookie", managerCookie)
                .send(body)

            const products = await getProducts();

            expect(result.status).toBe(200);
            expect(products.length).toBe(1);
            expect(products[0]).toStrictEqual(body);
        });

        test("It should return a 200 status code with empty arrivalDate", async () => {
            // @ts-ignore
            const body = {model:"iPhone 13", category:"Smartphone", quantity:5, details:"Best phone out there!!!", sellingPrice:1500, arrivalDate:""};
            const result = await request(app)
                .post(`${routePath}/products`)
                .set("Cookie", managerCookie)
                .send(body)

            const products = await getProducts();

            expect(result.status).toBe(200);
            expect(products.length).toBe(1);
            expect(products[0]).toStrictEqual({...body, ...{arrivalDate: dayjs().format("YYYY-MM-DD")}});
        });

        test("It should return a 409 status code", async () => {
            const body = {model:"iPhone 13", category:"Smartphone", quantity:5, details:"Best phone out there!!!", sellingPrice:1500, arrivalDate:"2024-01-01"};

            // We only care about the second insertion since we already tested the first one
            let result;
            for (let i = 0; i < 2; i++) {
                result = await request(app)
                    .post(`${routePath}/products`)
                    .set("Cookie", managerCookie)
                    .send(body);
            }

            const products = await getProducts();

            expect(result.status).toBe(409);
            expect(products.length).toBe(1);
            expect(products[0]).toStrictEqual(body);
        });
    });

    describe("PATCH /ezelectronics/products/:model",  () => {
        test("It should return a 401 status code", async () => {
            const body = {quantity: 10, changeDate: dayjs().subtract(1, "day").format("YYYY-MM-DD")};
            await postProduct(product);
            const result = await request(app)
                .patch(`${routePath}/products/${product.model}`)
                .send(body);

            const products = await getProducts();

            expect(result.status).toBe(401);
            expect(products.length).toBe(1);
        });

        test("It should return a 200 status code", async () => {
            const body = {quantity: 10, changeDate: dayjs().subtract(1, "day").format("YYYY-MM-DD")};
            await postProduct(product);
            const result = await request(app)
                .patch(`${routePath}/products/${product.model}`)
                .set("Cookie", managerCookie)
                .send(body);

            const products = await getProducts();

            expect(result.status).toBe(200);
            expect(products.length).toBe(1);
            expect(products[0].quantity).toBe(body.quantity + product.quantity);
        });

        test("It should return a 200 status code with empty changeDate", async () => {
            const body = {quantity: 10, changeDate: ""};
            await postProduct(product);
            const result = await request(app)
                .patch(`${routePath}/products/${product.model}`)
                .set("Cookie", managerCookie)
                .send(body);

            const products = await getProducts();

            expect(result.status).toBe(200);
            expect(products.length).toBe(1);
            expect(products[0].quantity).toBe(body.quantity + product.quantity);
        });

        test("It should return a 400 status code if changeDate is after today", async () => {
            const body = {quantity: 10, changeDate: dayjs().add(1, "day").format("YYYY-MM-DD")};
            await postProduct(product);
            const result = await request(app)
                .patch(`${routePath}/products/${product.model}`)
                .set("Cookie", managerCookie)
                .send(body);

            const products = await getProducts();

            expect(result.status).toBe(400);
            expect(products.length).toBe(1);
            expect(products[0].quantity).toBe(product.quantity);
        });

        test("It should return a 400 status code if changeDate is before arrivalDate", async () => {
            const body = {quantity: 10, changeDate: dayjs(product.arrivalDate).subtract(1, "day").format("YYYY-MM-DD")};
            await postProduct(product);
            const result = await request(app)
                .patch(`${routePath}/products/${product.model}`)
                .set("Cookie", managerCookie)
                .send(body);

            const products = await getProducts();

            expect(result.status).toBe(400);
            expect(products.length).toBe(1);
            expect(products[0].quantity).toBe(product.quantity);
        });
    });

    describe("PATCH /ezelectronics/products/:model/sell",  () => {
        test("It should return a 401 status code", async () => {
            const body = {quantity: 5, sellingDate: dayjs().subtract(1, "day").format("YYYY-MM-DD")};
            const result = await request(app)
                .patch(`${routePath}/products/${product.model}/sell`)
                .send(body);

            expect(result.status).toBe(401);
        });

        test("It should return a 200 status code", async () => {
            const body = {quantity: 5, sellingDate: dayjs().subtract(1, "day").format("YYYY-MM-DD")};
            await postProduct(product);
            const result = await request(app)
                .patch(`${routePath}/products/${product.model}/sell`)
                .set("Cookie", managerCookie)
                .send(body);

            const products = await getProducts();

            expect(result.status).toBe(200);
            expect(products.length).toBe(1);
            expect(products[0].quantity).toBe(product.quantity - body.quantity);
        });

        test("It should return a 200 status code with empty sellingDate", async () => {
            const body = {quantity: 5, sellingDate: ""};
            await postProduct(product);
            const result = await request(app)
                .patch(`${routePath}/products/${product.model}/sell`)
                .set("Cookie", managerCookie)
                .send(body);

            const products = await getProducts();

            expect(result.status).toBe(200);
            expect(products.length).toBe(1);
            expect(products[0].quantity).toBe(product.quantity - body.quantity);
        });

        test("It should return a 404 status code", async () => {
            const body = {quantity: 5, sellingDate: dayjs().subtract(1, "day").format("YYYY-MM-DD")};
            const result = await request(app)
                .patch(`${routePath}/products/randomModel/sell`)
                .set("Cookie", managerCookie)
                .send(body);

            expect(result.status).toBe(404);
        });

        test("It should return a 409 status code", async () => {
            const body = {quantity: product.quantity + 1, sellingDate: dayjs().subtract(1, "day").format("YYYY-MM-DD")};
            await postProduct(product);
            const result = await request(app)
                .patch(`${routePath}/products/${product.model}/sell`)
                .set("Cookie", managerCookie)
                .send(body);

            const products = await getProducts();

            expect(result.status).toBe(409);
            expect(products.length).toBe(1);
            expect(products[0].quantity).toBe(product.quantity);
        });

        test("It should return a 400 status code", async () => {
            const body = {quantity: product.quantity + 1, sellingDate: dayjs(product.arrivalDate).subtract(1, "day").format("YYYY-MM-DD")};
            await postProduct(product);
            const result = await request(app)
                .patch(`${routePath}/products/${product.model}/sell`)
                .set("Cookie", managerCookie)
                .send(body);

            const products = await getProducts();

            expect(result.status).toBe(400);
            expect(products.length).toBe(1);
            expect(products[0].quantity).toBe(product.quantity);
        });
    });

    describe("GET /ezelectronics/products",  () => {
        test("It should return a 401 status code", async () => {
            const result = await request(app)
                .get(`${routePath}/products`)

            expect(result.status).toBe(401);
        });

        test("It should return a 200 status code", async () => {
            const secondProduct = {...product, model: "iPhone 12", category: "Laptop"};
            await postProduct(product);
            await postProduct(secondProduct);
            const result = await request(app)
                .get(`${routePath}/products`)
                .set("Cookie", managerCookie)

            const products = result.body;

            expect(result.status).toBe(200);
            expect(products.length).toBe(2);
            expect(products).toStrictEqual([product, secondProduct]);
        });

        test("It should return a 200 status code with model filter", async () => {
            const secondProduct = {...product, model: "iPhone 12", category: "Laptop"};
            await postProduct(product);
            await postProduct(secondProduct);
            const result = await request(app)
                .get(`${routePath}/products?grouping=model&model=iPhone13`)
                .set("Cookie", managerCookie)

            const products = result.body;

            expect(result.status).toBe(200);
            expect(products.length).toBe(1);
            expect(products).toStrictEqual([product]);
        });

        test("It should return a 200 status code with category filter", async () => {
            const secondProduct = {...product, model: "iPhone 12", category: "Laptop"};
            await postProduct(product);
            await postProduct(secondProduct);
            const result = await request(app)
                .get(`${routePath}/products?grouping=category&category=Laptop`)
                .set("Cookie", managerCookie)

            const products = result.body;

            expect(result.status).toBe(200);
            expect(products.length).toBe(1);
            expect(products).toStrictEqual([secondProduct]);
        });
    });

    describe("GET /ezelectronics/products/available",  () => {
        test("It should return a 401 status code", async () => {
            const result = await request(app)
                .get(`${routePath}/products/available`)

            expect(result.status).toBe(401);
        });

        test("It should return a 200 status code", async () => {
            const secondProduct = {...product, model: "iPhone 12", category: "Laptop"};
            await postProduct(product);
            await postProduct(secondProduct);
            const result = await request(app)
                .get(`${routePath}/products/available`)
                .set("Cookie", customerCookie)

            const products = result.body;

            expect(result.status).toBe(200);
            expect(products.length).toBe(2);
            expect(products).toStrictEqual([product, secondProduct]);
        });

        test("It should return a 200 status code with model filter", async () => {
            const secondProduct = {...product, model: "iPhone 12", category: "Laptop"};
            await postProduct(product);
            await postProduct(secondProduct);
            const result = await request(app)
                .get(`${routePath}/products/available?grouping=model&model=iPhone13`)
                .set("Cookie", customerCookie)

            const products = result.body;

            expect(result.status).toBe(200);
            expect(products.length).toBe(1);
            expect(products).toStrictEqual([product]);
        });

        test("It should return a 200 status code with category filter", async () => {
            const secondProduct = {...product, model: "iPhone 12", category: "Laptop"};
            await postProduct(product);
            await postProduct(secondProduct);
            const result = await request(app)
                .get(`${routePath}/products/available?grouping=category&category=Laptop`)
                .set("Cookie", customerCookie)

            const products = result.body;

            expect(result.status).toBe(200);
            expect(products.length).toBe(1);
            expect(products).toStrictEqual([secondProduct]);
        });
    });

    describe("DELETE /ezelectronics/products/:model",  () => {
        test("It should return a 401 status code", async () => {
            const result = await request(app)
                .delete(`${routePath}/products/${product.model}`)

            expect(result.status).toBe(401);
        });

        test("It should return a 200 status code", async () => {
            await postProduct(product);
            const result = await request(app)
                .delete(`${routePath}/products/${product.model}`)
                .set("Cookie", managerCookie)

            const products = await getProducts();

            expect(result.status).toBe(200);
            expect(result.body).toStrictEqual({});
            expect(products.length).toBe(0);
        });

        test("It should return a 404 status code", async () => {
            await postProduct(product);
            const result = await request(app)
                .delete(`${routePath}/products/randomModel`)
                .set("Cookie", managerCookie)

            const products = await getProducts();

            expect(result.status).toBe(404);
            expect(products.length).toBe(1);
        });
    });
});