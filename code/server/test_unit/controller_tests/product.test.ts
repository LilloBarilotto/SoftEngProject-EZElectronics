import {afterEach, describe, expect, jest, test} from "@jest/globals";
import ProductController from "../../src/controllers/productController"
import ProductDAO from "../../src/dao/productDAO";
import {Category, Product} from "../../src/components/product";
import {
    ChangeDateAfterCurrentDateError,
    ChangeDateBeforeArrivalDateError,
    ProductNotFoundError,
    EmptyProductStockError,
    LowProductStockError
} from "../../src/errors/productError";
import * as MockDate from "mockdate";
import dayjs from "dayjs";
import {DateError} from "../../src/utilities";

jest.mock("../../src/dao/productDAO")

describe("registerProducts", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    const testProduct = new Product(
        100.50,
        "iPhone 13 Pro Max",
        Category.SMARTPHONE,
        "2024-05-19",
        "details",
        55);

    test("should return true", async () => {
        jest.spyOn(ProductDAO.prototype, "createProduct").mockResolvedValueOnce(true);
        const controller = new ProductController();
        const response = await controller.registerProducts(
            testProduct.model,
            testProduct.category,
            testProduct.quantity,
            testProduct.details,
            testProduct.sellingPrice,
            testProduct.arrivalDate);

        expect(ProductDAO.prototype.createProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.createProduct).toHaveBeenCalledWith(testProduct);
        expect(response).toBe(true);
    });

    test("should replace arrivalDate if null", async () => {
        jest.spyOn(ProductDAO.prototype, "createProduct").mockResolvedValueOnce(true);
        const controller = new ProductController();
        const response = await controller.registerProducts(
            testProduct.model,
            testProduct.category,
            testProduct.quantity,
            testProduct.details,
            testProduct.sellingPrice,
            null);

        expect(ProductDAO.prototype.createProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.createProduct).toHaveBeenCalledWith({...testProduct, ...{arrivalDate: dayjs().format("YYYY-MM-DD")}});
        expect(response).toBe(true);
    });
})

describe("deleteAllProducts", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test("should return true", async () => {
        jest.spyOn(ProductDAO.prototype, "deleteAllProducts").mockResolvedValueOnce(true);
        const controller = new ProductController();
        const response = await controller.deleteAllProducts();

        expect(ProductDAO.prototype.deleteAllProducts).toHaveBeenCalledTimes(1);
        expect(response).toBe(true);
    });
});

describe("changeProductQuantity", () => {
    afterEach(() => {
        jest.clearAllMocks();
        MockDate.reset();
    });

    const testProduct = new Product(
        100.50,
        "iPhone 13 Pro Max",
        Category.SMARTPHONE,
        "2024-05-19",
        "details",
        55);

    test("should return new quantity", async () => {
        jest.spyOn(ProductDAO.prototype, "getProduct")
            .mockResolvedValueOnce(testProduct)
            .mockResolvedValueOnce({...testProduct, ...{quantity: 10 + testProduct.quantity}});
        jest.spyOn(ProductDAO.prototype, "updateProduct").mockResolvedValueOnce(true);

        const controller = new ProductController();
        const response = await controller.changeProductQuantity(
            testProduct.model,
            10,
            "2024-05-29");

        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(2);
        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith(testProduct.model);
        expect(ProductDAO.prototype.updateProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.updateProduct).toHaveBeenCalledWith(testProduct.model, 10, "2024-05-29");
        expect(response).toBe(10 + testProduct.quantity);
    });

    test("should throw ProductNotFoundError", async () => {
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(undefined);
        const controller = new ProductController();
        await expect(controller.changeProductQuantity(
            testProduct.model,
            10,
            "2024-05-29")).rejects.toThrow(ProductNotFoundError);
    });

    test("should throw ChangeDateAfterCurrentDateError", async () => {
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(testProduct);
        MockDate.set("2024-05-29");
        const controller = new ProductController();
        await expect(controller.changeProductQuantity(
            testProduct.model,
            10,
            "2024-05-30")).rejects.toThrow(ChangeDateAfterCurrentDateError);
        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.updateProduct).toHaveBeenCalledTimes(0);
    });

    test("should throw ChangeDateBeforeArrivalDateError", async () => {
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(testProduct);
        const controller = new ProductController();
        const wrongDate = dayjs(testProduct.arrivalDate).subtract(1, "day").format("YYYY-MM-DD");
        await expect(controller.changeProductQuantity(
            testProduct.model,
            10,
            wrongDate)).rejects.toThrow(ChangeDateBeforeArrivalDateError);
        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.updateProduct).toHaveBeenCalledTimes(0);
    });
});

describe("getProducts", () => {
    afterEach(() => {
        jest.clearAllMocks();
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

    test("should return an array of products", async () => {
        jest.spyOn(ProductDAO.prototype, "getProducts").mockResolvedValueOnce(testProducts);
        const controller = new ProductController();
        const response = await controller.getProducts(null, null, null);

        expect(ProductDAO.prototype.getProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProducts).toHaveBeenCalledWith(null, null);
        expect(response).toEqual(testProducts);
    });

    test("should filter by category", async () => {
        jest.spyOn(ProductDAO.prototype, "getProducts").mockResolvedValueOnce(testProducts);
        const controller = new ProductController();
        const response = await controller.getProducts("category", Category.SMARTPHONE, null);

        expect(ProductDAO.prototype.getProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProducts).toHaveBeenCalledWith("category", Category.SMARTPHONE);
        expect(response).toEqual(testProducts);
    });

    test("should filter by model", async () => {
        jest.spyOn(ProductDAO.prototype, "getProducts").mockResolvedValueOnce(testProducts);
        const controller = new ProductController();
        const response = await controller.getProducts("model", testProducts[0].model, null);

        expect(ProductDAO.prototype.getProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProducts).toHaveBeenCalledWith("model", testProducts[0].model);
        expect(response).toEqual(testProducts);
    });

    test("should return an empty array", async () => {
        jest.spyOn(ProductDAO.prototype, "getProducts").mockResolvedValueOnce([]);
        const controller = new ProductController();
        const response = await controller.getProducts(null, null, null);

        expect(ProductDAO.prototype.getProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProducts).toHaveBeenCalledWith(null, null);
        expect(response).toEqual([]);
    });

    test("should throw ProductNotFoundError", async () => {
        jest.spyOn(ProductDAO.prototype, "getProducts").mockResolvedValueOnce([]);
        const controller = new ProductController();

        await expect(controller.getProducts("model", null, testProducts[0].model)).rejects.toThrow(ProductNotFoundError);

        expect(ProductDAO.prototype.getProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProducts).toHaveBeenCalledWith("model", testProducts[0].model);
    });
});

describe("getAvailableProducts", () => {
    afterEach(() => {
        jest.clearAllMocks();
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

    test("should return an array of products", async () => {
        jest.spyOn(ProductDAO.prototype, "getAvailableProducts").mockResolvedValueOnce(testProducts);
        const controller = new ProductController();
        const response = await controller.getAvailableProducts(null, null, null);

        expect(ProductDAO.prototype.getAvailableProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getAvailableProducts).toHaveBeenCalledWith(null, null);
        expect(response).toEqual(testProducts);
    });

    test("should filter by category", async () => {
        jest.spyOn(ProductDAO.prototype, "getAvailableProducts").mockResolvedValueOnce(testProducts);
        const controller = new ProductController();
        const response = await controller.getAvailableProducts("category", Category.SMARTPHONE, null);

        expect(ProductDAO.prototype.getAvailableProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getAvailableProducts).toHaveBeenCalledWith("category", Category.SMARTPHONE);
        expect(response).toEqual(testProducts);
    });

    test("should filter by model", async () => {
        jest.spyOn(ProductDAO.prototype, "getAvailableProducts").mockResolvedValueOnce(testProducts);
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(testProducts[0]);
        const controller = new ProductController();
        const response = await controller.getAvailableProducts("model", testProducts[0].model, null);

        expect(ProductDAO.prototype.getAvailableProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getAvailableProducts).toHaveBeenCalledWith("model", testProducts[0].model);
        expect(response).toEqual(testProducts);
    });

    test("should return an empty array", async () => {
        jest.spyOn(ProductDAO.prototype, "getAvailableProducts").mockResolvedValueOnce([]);
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(testProducts[0]);
        const controller = new ProductController();
        const response = await controller.getAvailableProducts(null, null, null);

        expect(ProductDAO.prototype.getAvailableProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getAvailableProducts).toHaveBeenCalledWith(null, null);
        expect(response).toEqual([]);
    });

    test("should throw ProductNotFoundError", async () => {
        jest.spyOn(ProductDAO.prototype, "getAvailableProducts").mockResolvedValueOnce([]);
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(null);
        const controller = new ProductController();

        await expect(controller.getAvailableProducts("model", null, testProducts[0].model)).rejects.toThrow(ProductNotFoundError);

        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith(testProducts[0].model);
    });
});

describe("deleteProduct", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const testProduct = new Product(
        100.50,
        "iPhone 13 Pro Max",
        Category.SMARTPHONE,
        "2024-05-19",
        "details",
        55);

    test("should return true", async () => {
        jest.spyOn(ProductDAO.prototype, "deleteProduct").mockResolvedValueOnce(true);
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(testProduct);

        const controller = new ProductController();
        const response = await controller.deleteProduct(testProduct.model);

        expect(ProductDAO.prototype.deleteProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.deleteProduct).toHaveBeenCalledWith(testProduct.model);
        expect(response).toBe(true);
    });

    test("should throw ProductNotFoundError", async () => {
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(undefined);

        const controller = new ProductController();
        await expect(controller.deleteProduct(testProduct.model)).rejects.toThrow(ProductNotFoundError);

        expect(ProductDAO.prototype.deleteProduct).toHaveBeenCalledTimes(0);
    });
});

describe("sellProduct", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    const testProduct = new Product(
        100.50,
        "iPhone 13 Pro Max",
        Category.SMARTPHONE,
        "2024-05-19",
        "details",
        55);

    test("should return the new quantity of the product", async () => {
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(testProduct);
        jest.spyOn(ProductDAO.prototype, "sellProduct").mockResolvedValueOnce(true);
        const controller = new ProductController();
        const response = await controller.sellProduct(testProduct.model, 5, dayjs(testProduct.arrivalDate).add(1, "day").format("YYYY-MM-DD"));

        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith(testProduct.model);
        expect(ProductDAO.prototype.sellProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.sellProduct).toHaveBeenCalledWith(testProduct.model, 5);
        expect(response).toBe(50);
    });

    test("should throw ProductNotFoundError", async () => {
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(null);
        jest.spyOn(ProductDAO.prototype, "sellProduct").mockResolvedValueOnce(true);
        const controller = new ProductController();
        await expect(controller.sellProduct(testProduct.model, 5, dayjs(testProduct.arrivalDate).add(1, "day").format("YYYY-MM-DD"))).rejects.toThrow(ProductNotFoundError);

        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith(testProduct.model);
        expect(ProductDAO.prototype.sellProduct).toHaveBeenCalledTimes(0);
    });

    test("should throw DateError", async () => {
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce(testProduct);
        jest.spyOn(ProductDAO.prototype, "sellProduct").mockResolvedValueOnce(true);
        const controller = new ProductController();
        await expect(controller.sellProduct(testProduct.model, 5, dayjs(testProduct.arrivalDate).subtract(1, "day").format("YYYY-MM-DD"))).rejects.toThrow(DateError);

        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith(testProduct.model);
        expect(ProductDAO.prototype.sellProduct).toHaveBeenCalledTimes(0);
    });

    test("should throw EmptyProductStockError", async () => {
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce({...testProduct, quantity: 0});
        jest.spyOn(ProductDAO.prototype, "sellProduct").mockResolvedValueOnce(true);
        const controller = new ProductController();
        await expect(controller.sellProduct(testProduct.model, 5, dayjs(testProduct.arrivalDate).add(1, "day").format("YYYY-MM-DD"))).rejects.toThrow(EmptyProductStockError);

        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith(testProduct.model);
        expect(ProductDAO.prototype.sellProduct).toHaveBeenCalledTimes(0);
    });

    test("should throw LowProductStockError", async () => {
        jest.spyOn(ProductDAO.prototype, "getProduct").mockResolvedValueOnce({...testProduct, quantity: 3});
        jest.spyOn(ProductDAO.prototype, "sellProduct").mockResolvedValueOnce(true);
        const controller = new ProductController();
        await expect(controller.sellProduct(testProduct.model, 5, dayjs(testProduct.arrivalDate).add(1, "day").format("YYYY-MM-DD"))).rejects.toThrow(LowProductStockError);

        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProduct).toHaveBeenCalledWith(testProduct.model);
        expect(ProductDAO.prototype.sellProduct).toHaveBeenCalledTimes(0);
    });
});