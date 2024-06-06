import {expect, jest, test} from "@jest/globals"

import ProductDAO from "../../src/dao/productDAO"
import db from "../../src/db/db"
import {Database} from "sqlite3"
import {Category, Product} from "../../src/components/product";
import {ProductAlreadyExistsError} from "../../src/errors/productError";

jest.mock("../../src/db/db.ts")

describe("createProduct", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("resolves true if product is inserted", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
        const productDAO = new ProductDAO()
        const product = new Product(100.50, "iPhone 13 Pro Max", Category.SMARTPHONE, "2024-05-19", "details", 55)
        const result = await productDAO.createProduct(product)
        expect(result).toBe(true)
    })

    test("throws ProductAlreadyExistsError if product is already present in DB", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error("UNIQUE constraint failed: products.model"))
            return {} as Database
        });
        const productDAO = new ProductDAO()
        const product = new Product(100.50, "iPhone 13 Pro Max", Category.SMARTPHONE, "2024-05-19", "details", 55)
        await expect(productDAO.createProduct(product)).rejects.toThrow(ProductAlreadyExistsError)
    })
});

describe("updateProduct", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("resolves true if product is updated", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });
        const productDAO = new ProductDAO();
        const result = await productDAO.updateProduct("model", 10, "2024-05-29");
        expect(result).toBe(true);
    });

    test("throws exception if DB error", async () => {
        const DB_ERROR_MESSAGE = "This is a DB exception!";
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error(DB_ERROR_MESSAGE));
            return {} as Database;
        });
        const productDAO = new ProductDAO();
        await expect(productDAO.updateProduct("model", 10, "2024-05-29")).rejects.toThrow(DB_ERROR_MESSAGE);
    });
});





