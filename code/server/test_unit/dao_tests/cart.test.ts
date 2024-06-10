import {  beforeEach, describe, jest, afterEach, test, expect } from "@jest/globals";
import CartDAO from "./../../src/dao/cartDAO";
import db from "./../../src/db/db";
import { Cart } from "./../../src/components/cart";
import {Database} from "sqlite3"
import { CartNotFoundError } from "../../src/errors/cartError";
jest.mock("./../../src/db/db");

describe("CartDAO deleteAllCarts", () => {
    let dao: CartDAO;

    beforeEach(() => {
        dao = new CartDAO();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("Should delete all carts and products in cart", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            if (callback) callback(null);
            return {} as Database
        });

        await dao.deleteAllCarts();
        expect(db.run).toHaveBeenCalledTimes(2);
        expect(db.run).toHaveBeenCalledWith("DELETE FROM carts")
        expect(db.run).toHaveBeenCalledWith("DELETE FROM productsInCart")
    });
});

describe("CartDAO clearCart", () => {
    let dao: CartDAO;

    beforeEach(() => {
        dao = new CartDAO();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test("should clear the cart if it exists", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { id: 1, customer: "testuser", paid: false, paymentDate: "", total: 100 });
            return {} as Database
        });

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [{ cartId: 1, model: "product1", quantity: 1, category: "Electronics", price: 50 }]);
            return {} as Database
        });

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            if (callback) callback(null);
            return {} as Database
        });

        await dao.clearCart("testuser");
        expect(db.run).toHaveBeenCalled();
    });
});

describe("CartDAO getAllCarts", () => {
    let dao: CartDAO;
    afterEach(() => {
        jest.restoreAllMocks();
    });
    beforeEach(() => {
        dao = new CartDAO();

    });

    test("should retrieve all carts", async () => {
        const carts: Cart[] = [
            { customer: "testuser1", paid: false, paymentDate: "", total: 100, products: [] },
            { customer: "testuser2", paid: true, paymentDate: "2023-01-01T00:00:00.000Z", total: 200, products: [] },
        ];


        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, carts);
            return {} as Database
        });

        const result = await dao.getCartsAll();
        expect(result).toEqual([
            { customer: "testuser1", paid: false, paymentDate: "", total: 100, products: [] },
            { customer: "testuser2", paid: true, paymentDate: "2023-01-01T00:00:00.000Z", total: 200, products: [] },
        ]);
        expect(db.all).toHaveBeenCalledWith(`SELECT * FROM carts`, [], expect.any(Function));
    });

    test("should throw an error if retrieval fails", async () => {
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new Error("Failed to retrieve all carts"));
            return {} as Database
        });

        await expect(dao.getCartsAll()).rejects.toThrow("Failed to retrieve all carts");
    });
});