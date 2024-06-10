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
