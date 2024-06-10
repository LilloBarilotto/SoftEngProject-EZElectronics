import {describe, afterEach, beforeEach, test, expect, jest } from "@jest/globals";
import CartDAO from "./../../src/dao/cartDAO";
import { CallTracker } from "assert";
import CartController from "./../../src/controllers/cartController";
import { CartNotFoundError } from "./../../src/errors/cartError";
import { User, Role  } from "./../../src/components/user";
import {Cart} from "./../../src/components/cart"
jest.mock("./../../src/dao/cartDAO");

describe("CartController deleteAllCarts", () => {
    let controller : CartController;
    afterEach(() => {
        jest.clearAllMocks();
    })
    beforeEach(()=>{
        controller = new CartController();
    })

    test("should delete all carts", async () => {
        jest.spyOn(CartDAO.prototype, "deleteAllCarts").mockResolvedValue();

        const result = await controller.deleteAllCarts();
        expect(result).toBe(true);
        expect(CartDAO.prototype.deleteAllCarts).toHaveBeenCalled();
    });

    test("should throw an error if deletion fails", async () => {
        jest.spyOn(CartDAO.prototype, "deleteAllCarts").mockRejectedValue(new Error("Failed to delete all carts"));

        await expect(controller.deleteAllCarts()).rejects.toThrow("Failed to delete all carts");
    });
});

describe("CartController clearCart", () => {
    let controller : CartController;
    afterEach(() => {
        jest.clearAllMocks();
    })
    beforeEach(()=>{
        controller = new CartController();
    })

    test("should clear the cart if it exists", async () => {
        const user: User = {
            username: "testuser", role: Role.CUSTOMER,
            name: "test",
            surname: "test",
            address: "test",
            birthdate: "test"
        };
        const cart: Cart = { customer: "testuser", paid: false, paymentDate: "", total: 100, products: [] };
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValue(cart);
        jest.spyOn(CartDAO.prototype, "clearCart").mockResolvedValue();

        const result = await controller.clearCart(user);
        expect(result).toBe(true);
        expect(CartDAO.prototype.clearCart).toHaveBeenCalledWith(user.username);
    });

    test("should throw CartNotFoundError if the cart does not exist", async () => {
        const user: User = {
            username: "testuser", role: Role.CUSTOMER,
            name: "test",
            surname: "test",
            address: "test",
            birthdate: "test"
        };

        jest.spyOn(CartDAO.prototype, "clearCart").mockRejectedValue(new CartNotFoundError());

        await expect(controller.clearCart(user)).rejects.toThrow(CartNotFoundError);
        expect(CartDAO.prototype.clearCart).toHaveBeenCalledWith(user.username);
    });
});

describe("CartController getAllCarts", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });


    test("should retrieve all carts", async () => {
        const carts: Cart[] = [
            { customer: "testuser1", paid: false, paymentDate: "", total: 100, products: [] },
            { customer: "testuser2", paid: true, paymentDate: "2023-01-01T00:00:00.000Z", total: 200, products: [] },
        ];
        const controller: CartController =  new CartController;
        jest.spyOn(CartDAO.prototype, "getCartsAll").mockResolvedValue(carts);

        const result = await controller.getAllCarts();
        expect(result).toEqual(carts);
        expect(CartDAO.prototype.getCartsAll).toHaveBeenCalled();
    });

    test("should throw an error if retrieval fails", async () => {
        jest.spyOn(CartDAO.prototype, "getCartsAll").mockRejectedValue(new Error("Failed to retrieve all carts"));
        const controller: CartController =  new CartController;
        await expect(controller.getAllCarts()).rejects.toThrow("Failed to retrieve all carts");
        expect(CartDAO.prototype.getCartsAll).toHaveBeenCalled();
    });
});
