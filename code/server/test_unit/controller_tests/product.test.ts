import { test, expect, jest } from "@jest/globals"
import ProductController from "../../src/controllers/productController"
import ProductDAO from "../../src/dao/productDAO";
import {Category, Product} from "../../src/components/product";
import {
    ChangeDateAfterCurrentDateError,
    ChangeDateBeforeArrivalDateError,
    ProductNotFoundError
} from "../../src/errors/productError";
import * as MockDate from "mockdate";
import dayjs from "dayjs";

jest.mock("../../src/dao/productDAO")

describe("registerProducts", () => {
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