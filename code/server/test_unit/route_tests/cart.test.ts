import {describe, beforeEach, test, expect, jest } from "@jest/globals";
import request from "supertest";
import { app } from "../../index"
import CartController from "../../src/controllers/cartController";
import { Cart } from "../../src/components/cart";
import { CartNotFoundError } from "../../src/errors/cartError";
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
