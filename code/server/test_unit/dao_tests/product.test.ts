import {expect,describe, afterEach,  jest, test} from "@jest/globals"

import ProductDAO from "../../src/dao/productDAO"
import db from "../../src/db/db"
import {Database} from "sqlite3"
import {Category, Product} from "../../src/components/product";
import {ProductAlreadyExistsError} from "../../src/errors/productError";

jest.mock("../../src/db/db.ts")

describe("createProduct", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    const productDAO = new ProductDAO();
    const product = new Product(100.50, "iPhone 13 Pro Max", Category.SMARTPHONE, "2024-05-19", "details", 55)
    
    test("resolves true if product is inserted", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
      
        const result = await productDAO.createProduct(product)
        expect(result).toBe(true)
    })

    test("throws ProductAlreadyExistsError if product is already present in DB", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error("UNIQUE constraint failed: products.model"))
            return {} as Database
        });
       
        await expect(productDAO.createProduct(product)).rejects.toThrow(ProductAlreadyExistsError)
    })
});

describe("updateProduct", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
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

describe("deleteAllProducts", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    test("resolves true if all products are deleted", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, callback) => {
            callback(null)
            return {} as Database
        });
        const productDAO = new ProductDAO()
        const result = await productDAO.deleteAllProducts()
        expect(result).toBe(true)
        expect(db.run).toHaveBeenCalledTimes(1)
        expect(db.run).toHaveBeenCalledWith("DELETE FROM products", expect.any(Function))
    })
});

describe("getProducts", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    const testProducts = [
        {
            model: "iPhone 13 Pro Max",
            sellingPrice: 100.50,
            category: Category.SMARTPHONE,
            arrivalDate: "2024-05-19",
            details: "best phone",
            quantity: 55
        },
        {
            model: "Banana phone",
            sellingPrice: 320,
            category: Category.SMARTPHONE,
            arrivalDate: "2024-03-17",
            details: "worst phone",
            quantity: 430
        }
    ];

    test("resolves an array of Product objects", async () => {
        const mockDB = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, testProducts);
            return {} as Database;
        });
        const productDAO = new ProductDAO();
        const result = await productDAO.getProducts(undefined, undefined);
        expect(result).toEqual(testProducts);
        expect(mockDB).toHaveBeenCalledTimes(1);
        expect(mockDB).toHaveBeenCalledWith("SELECT model, selling_price AS sellingPrice, category, arrival_date as arrivalDate, details, quantity FROM products", [], expect.any(Function));
    });

    test("resolves an array of Product objects filtered by category", async () => {
        const mockDB = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, testProducts);
            return {} as Database;
        });
        const productDAO = new ProductDAO();
        const result = await productDAO.getProducts("category", Category.SMARTPHONE);
        expect(result).toEqual(testProducts);
        expect(mockDB).toHaveBeenCalledTimes(1);
        expect(mockDB).toHaveBeenCalledWith("SELECT model, selling_price AS sellingPrice, category, arrival_date as arrivalDate, details, quantity FROM products WHERE category = ?;", [Category.SMARTPHONE], expect.any(Function));
    })

    test("resolves an array of Product objects filtered by model", async () => {
        const mockDB = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, testProducts);
            return {} as Database;
        });
        const productDAO = new ProductDAO();
        const result = await productDAO.getProducts("model", testProducts[0].model);
        expect(result).toEqual(testProducts);
        expect(mockDB).toHaveBeenCalledTimes(1);
        expect(mockDB).toHaveBeenCalledWith("SELECT model, selling_price AS sellingPrice, category, arrival_date as arrivalDate, details, quantity FROM products WHERE model = ?;", [testProducts[0].model], expect.any(Function));
    })
});

describe("getAvailableProducts", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    const testProducts = [
        {
            model: "iPhone 13 Pro Max",
            sellingPrice: 100.50,
            category: Category.SMARTPHONE,
            arrivalDate: "2024-05-19",
            details: "best phone",
            quantity: 55
        },
        {
            model: "Banana phone",
            sellingPrice: 320,
            category: Category.SMARTPHONE,
            arrivalDate: "2024-03-17",
            details: "worst phone",
            quantity: 430
        }
    ];

    test("resolves an array of Product objects", async () => {
        const mockDB = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, testProducts);
            return {} as Database;
        });
        const productDAO = new ProductDAO();
        const result = await productDAO.getAvailableProducts(undefined, undefined);
        expect(result).toEqual(testProducts);
        expect(mockDB).toHaveBeenCalledTimes(1);
        expect(mockDB).toHaveBeenCalledWith("SELECT model, selling_price AS sellingPrice, category, arrival_date as arrivalDate, details, quantity FROM products WHERE quantity > 0", [], expect.any(Function));
    });

    test("resolves an array of Product objects filtered by category", async () => {
        const mockDB = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, testProducts);
            return {} as Database;
        });
        const productDAO = new ProductDAO();
        const result = await productDAO.getAvailableProducts("category", Category.SMARTPHONE);
        expect(result).toEqual(testProducts);
        expect(mockDB).toHaveBeenCalledTimes(1);
        expect(mockDB).toHaveBeenCalledWith("SELECT model, selling_price AS sellingPrice, category, arrival_date as arrivalDate, details, quantity FROM products WHERE quantity > 0 AND category = ?;", [Category.SMARTPHONE], expect.any(Function));
    })

    test("resolves an array of Product objects filtered by model", async () => {
        const mockDB = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, testProducts);
            return {} as Database;
        });
        const productDAO = new ProductDAO();
        const result = await productDAO.getAvailableProducts("model", testProducts[0].model);
        expect(result).toEqual(testProducts);
        expect(mockDB).toHaveBeenCalledTimes(1);
        expect(mockDB).toHaveBeenCalledWith("SELECT model, selling_price AS sellingPrice, category, arrival_date as arrivalDate, details, quantity FROM products WHERE quantity > 0 AND model = ?;", [testProducts[0].model], expect.any(Function));
    })
});

describe("deleteProduct", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    test("resolves true if product is deleted", async () => {
        const mockDB = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
        const productDAO = new ProductDAO();
        const result = await productDAO.deleteProduct("iphone13")
        expect(result).toBe(true)
        expect(mockDB).toHaveBeenCalledTimes(1);
        expect(mockDB).toHaveBeenCalledWith("DELETE FROM products WHERE model = ?", ["iphone13"], expect.any(Function))
    });
});

describe("sellProduct", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    test("resolves true if product is sold", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
        const productDAO = new ProductDAO();
        const result = await productDAO.sellProduct("iPhone 13 Pro Max", 5);
        expect(result).toBe(true);
        expect(db.run).toBeCalledTimes(1);
        expect(db.run).toBeCalledWith("UPDATE products SET quantity = quantity - ? WHERE model = ?", [5, "iPhone 13 Pro Max"], expect.any(Function));
    });
});