import {describe, afterEach, test, expect, jest } from "@jest/globals";
import request from "supertest";
import { app } from "../../index"
import CartController from "../../src/controllers/cartController";
import { Cart } from "../../src/components/cart";
import { CartNotFoundError } from "../../src/errors/cartError";
import Authenticator from "../../src/routers/auth";
const baseURL = "/ezelectronics"

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
