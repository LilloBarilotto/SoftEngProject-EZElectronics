import {describe, beforeEach, test, expect, jest, afterEach} from "@jest/globals";
import request from "supertest";
import { app } from "../../index"
import CartController from "../../src/controllers/cartController";
import { Cart } from "../../src/components/cart";
import { CartNotFoundError,  EmptyCartError } from "../../src/errors/cartError";
import Authenticator from "../../src/routers/auth";
const baseURL = "/ezelectronics"



describe("CartRoutes DELETE /carts", () => {
    let controller: CartController;

    beforeEach(() => {
        controller = new CartController();
    });

    //TODO: add other tests

    test("should return 401 for unauthorized access", async () => {
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => res.status(401).json({ error: "User is not an admin or manager", status: 401 }))

        const response = await request(app).delete(baseURL + "/carts");
        expect(response.status).toBe(401);
    });
});

describe("CartRoutes DELETE /carts/current", () => {


    test("should clear the current cart", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(CartController.prototype, "clearCart").mockResolvedValue(true);

        const response = await request(app)
            .delete(baseURL +  "/carts/current");
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    test("should return 404 if the cart does not exist", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(CartController.prototype, "clearCart").mockRejectedValue(new CartNotFoundError());

        const response = await request(app)
            .delete(baseURL + "/carts/current");
        expect(response.status).toBe(404);
        expect(response.body).toEqual( {"error": "Cart not found", "status": 404});
    });

    test("should return 401 for unauthorized access", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => res.status(401).json({ error: "User is not a Customer", status: 401 }))
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => next())
        const response = await request(app).delete(baseURL + "/carts/current");
        expect(response.status).toBe(401);
    });
});

describe("CartRoutes GET /carts", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should retrieve all carts", async () => {
        const carts: Cart[] = [
            { customer: "testuser1", paid: false, paymentDate: "", total: 100, products: [] },
            { customer: "testuser2", paid: true, paymentDate: "2023-01-01T00:00:00.000Z", total: 200, products: [] },
        ];

        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValue(carts);

        const response = await request(app)
            .get(baseURL  + "/carts/all")
            .send();
        expect(response.status).toBe(200);
        expect(response.body).toEqual(carts);
    });

    test("should return 503 if retrieval fails", async () => {
        jest.spyOn(CartController.prototype, "getAllCarts").mockRejectedValue(new Error("Failed to retrieve all carts"));
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => next())
        const response = await request(app)
            .get(baseURL + "/carts/all")
            .send();
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: "Internal Server Error", status: 503 });
    });

    test("should return 401 for unauthorized access", async () => {
        const response = await request(app).get(baseURL + "/carts/all");
        expect(response.status).toBe(401);
    });
});

describe("CartRoutes GET /carts", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should retrieve the history of the logged in customer's carts", async () => {
        const carts: Cart[] = [
            { customer: "testuser", paid: true, paymentDate: "2023-01-01T00:00:00.000Z", total: 100, products: [] },
            { customer: "testuser", paid: true, paymentDate: "2023-02-01T00:00:00.000Z", total: 200, products: [] },
        ];
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(CartController.prototype, "getCustomerCarts").mockResolvedValue(carts);

        const response = await request(app)
            .get(baseURL + "/carts/history")
            .send({ username: "testuser" });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(carts);
    });

    test("should return 500 if retrieval fails", async () => {

        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => next())

        const response = await request(app)
            .get(baseURL + "/carts/history")
            .send({ username: "testuser" });
        expect(response.status).toBe(503);
    });

    test("should return 401 for unauthorized access", async () => {
        const response = await request(app).get(baseURL + "/carts/history");
        expect(response.status).toBe(401);
    });
});

describe("CartRoutes PATCH /carts", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });


    test("should checkout the cart", async () => {

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValue(true);

        const response = await request(app)
            .patch(baseURL + "/carts")
            .send({ username: "testuser" });
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    test("should return 404 if the cart does not exist", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValue(new CartNotFoundError());

        const response = await request(app)
            .patch(baseURL + "/carts")
            .send({ username: "testuser" });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Cart not found", status: 404 });
    });

    test("should return 400 if the cart is empty", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValue(new EmptyCartError());

        const response = await request(app)
            .patch(baseURL + "/carts")
            .send({ username: "testuser" });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Cart is empty", status: 400 });
    });

    test("should return 401 for unauthorized access", async () => {
        const response = await request(app).patch(baseURL + "/carts");
        expect(response.status).toBe(401);
    });
});

describe("CartRoutes GET /carts", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test("should return a cart if it exists", async () => {
        const cart: Cart = { customer: "testuser", paid: false, paymentDate: "", total: 100, products: [] };
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(CartController.prototype, "getCart").mockResolvedValue(cart);
        console.log("test in process");
        const response = await request(app).get(baseURL + "/carts");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(cart);
    });
    test("should return any empty cart if the cart does not exist", async () => {
        const cart: Cart = { customer: "testuser", paid: false, paymentDate: "", total: 0, products: [] };
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(CartController.prototype, "getCart").mockRejectedValue(new CartNotFoundError());
        const response = await request(app).get(baseURL + "/carts");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Cart not found", status : 404});
    });

    test("should return 404 if none of cart does not exist", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(CartController.prototype, "getCart").mockRejectedValue(new CartNotFoundError());
        const response = await request(app).get(baseURL + "/carts");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Cart not found", status : 404});
    });

    test("should return 401 for unauthorized access", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req: any, res: any, next: any) => res.status(401).json({ error: "User is not a Customer", status: 401 }))
        const response = await request(app).get(baseURL + "/carts");
        expect(response.status).toBe(401);
    });
});
