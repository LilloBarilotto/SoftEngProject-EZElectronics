import {  beforeEach, describe, jest, afterEach, test, expect } from "@jest/globals";
import CartDAO from "./../../src/dao/cartDAO";
import db from "./../../src/db/db";
import { Cart } from "./../../src/components/cart";
import {Database} from "sqlite3"
jest.mock("./../../src/db/db");

describe("CartDAO getCart", () => {
    let dao: CartDAO;
    afterEach(() => {
        jest.restoreAllMocks();
    });
    beforeEach(() => {
        dao = new CartDAO();
        
    });

    test("Should return a cart if it exists", async () => {
        const cartRow = { id: 1, customer: "testuser", paid: false, paymentDate: "", total: 100 };
        const productRows = [{ cartId: 1, model: "product1", quantity: 2, category: "Electronics", price: 50 }];

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, cartRow);
            return {} as Database
        });

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, productRows);
            return {} as Database
        });

        const cart = await dao.getCart("testuser");
        expect(cart).toEqual({
            customer: "testuser",
            paid: false,
            paymentDate: "",
            total: 100,
            products: [{ model: "product1", quantity: 2, category: "Electronics", price: 50 }]
        });
    });

    test("Should return empty cart object if the cart does not exist", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, null);
            return {} as Database
        });

        const cart = await dao.getCart("testuser");
        expect(cart).toEqual({customer: "testuser", paid: false, paymentDate: "",total: 0,products: []});
    });
});
