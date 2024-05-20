import { test, expect, jest } from "@jest/globals"
import ProductController from "../../src/controllers/productController"
import ProductDAO from "../../src/dao/productDAO";
import {Category, Product} from "../../src/components/product";

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