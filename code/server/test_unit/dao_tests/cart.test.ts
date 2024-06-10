import {  beforeEach, describe, jest, afterEach, test, expect } from "@jest/globals";
import CartDAO from "./../../src/dao/cartDAO";
import db from "./../../src/db/db";
import {Database} from "sqlite3"
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
