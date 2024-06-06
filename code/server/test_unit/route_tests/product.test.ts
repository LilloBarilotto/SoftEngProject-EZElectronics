import { test, expect, jest } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"

import ProductController from "../../src/controllers/productController"
import {Category} from "../../src/components/product";
import Authenticator from "../../src/routers/auth";
import {
    ChangeDateAfterCurrentDateError, ChangeDateBeforeArrivalDateError,
    ProductAlreadyExistsError,
    ProductNotFoundError
} from "../../src/errors/productError";
import dayjs from "dayjs";
const baseURL = "/ezelectronics"

describe("POST /ezelectronics/products", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    const testProduct = { //Define a test user object sent to the route
        sellingPrice: 100.50,
        model: "iPhone 13 Pro Max",
        category: Category.SMARTPHONE,
        arrivalDate: "2024-05-19",
        details: "details",
        quantity: 55
    }

    test("should return a 200 success code", async () => {
        jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce(true)
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => next())
        const response = await request(app).post(baseURL + "/products").send(testProduct)
        expect(response.status).toBe(200)
        expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(1)
        expect(ProductController.prototype.registerProducts).toHaveBeenCalledWith(
            testProduct.model,
            testProduct.category,
            testProduct.quantity,
            testProduct.details,
            testProduct.sellingPrice,
            testProduct.arrivalDate
        )
    })

    test("should return a 401 response code if user is not a manager", async () => {
        jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce(true)
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => res.status(401).json({ error: "User is not a manager", status: 401 }))
        const response = await request(app).post(baseURL + "/products").send(testProduct)
        expect(response.status).toBe(401)
        expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(0)
    })

    test("should return a 409 response code if the product already exists", async () => {
        jest.spyOn(ProductController.prototype, "registerProducts").mockRejectedValue(new ProductAlreadyExistsError)
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => next())
        const response = await request(app).post(baseURL + "/products").send(testProduct)
        expect(response.status).toBe(409)
        expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(1)
        expect(ProductController.prototype.registerProducts).toHaveBeenCalledWith(
            testProduct.model,
            testProduct.category,
            testProduct.quantity,
            testProduct.details,
            testProduct.sellingPrice,
            testProduct.arrivalDate
        )
    })

    // This test checks if the route returns a 422 response code if any of the fields is invalid
    it.each([
        {key: "model", value: undefined},
        {key: "model", value: ""},
        {key: "category", value: undefined},
        {key: "category", value: "invalid"},
        {key: "quantity", value: undefined},
        {key: "quantity", value: -1},
        {key: "quantity", value: 0},
        {key: "sellingPrice", value: undefined},
        {key: "sellingPrice", value: -1.0},
        {key: "sellingPrice", value: 0.0}
    ])("return a 422 response code if %s is invalid", async (invalidField) => {
        jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce(true)
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => next())
        const productWithInvalidField = {...testProduct, ...{[invalidField.key]: invalidField.value}}
        const response = await request(app).post(baseURL + "/products").send(productWithInvalidField)
        expect(response.status).toBe(422)
        expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(0)
    })

    // The check for the arrivalDate require a bit more logic to mock the dayjs method.
    test("should return a 422 response code if the arrivalDate is after today", async () => {
        jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce(true)
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => next())
        jest.spyOn(dayjs.prototype, "isBefore").mockReturnValueOnce(true)
        const productWithInvalidField = {...testProduct, ...{arrivalDate: "2025-05-19"}}
        const response = await request(app).post(baseURL + "/products").send(productWithInvalidField)
        expect(response.status).toBe(422)
        expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(0)
    })
});

describe("PATCH /ezelectronics/products/:model", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    const testBody = {
        quantity: 10,
        changeDate: "2024-05-29"
    }

    test("should return a 200 success code with changeDate", async () => {
        jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValueOnce(100)
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => next())
        const response = await request(app).patch(baseURL + "/products/iphone13").send(testBody)
        expect(response.status).toBe(200)
        expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledTimes(1)
        expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledWith(
            "iphone13",
            testBody.quantity,
            testBody.changeDate
        );
    });

    test("should return a 200 success code without changeDate", async () => {
        jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValueOnce(100)
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => next())
        const response = await request(app).patch(baseURL + "/products/iphone13").send({...testBody, ...{changeDate: undefined}})
        expect(response.status).toBe(200)
        expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledTimes(1)
        expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledWith(
            "iphone13",
            testBody.quantity,
            undefined
        );
    });

    test("should return a 404 response code if the product does not exist", async () => {
        jest.spyOn(ProductController.prototype, "changeProductQuantity").mockRejectedValue(new ProductNotFoundError)
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => next())
        const response = await request(app).patch(baseURL + "/products/iphone13").send(testBody)
        expect(response.status).toBe(404)
        expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledTimes(1)
        expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledWith(
            "iphone13",
            testBody.quantity,
            testBody.changeDate
        );
    });

    it.each([
        ChangeDateAfterCurrentDateError,
        ChangeDateBeforeArrivalDateError
    ])("return a 400 response code if %s is thrown", async (exc) => {
        jest.spyOn(ProductController.prototype, "changeProductQuantity").mockRejectedValue(new exc)
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req: any, res: any, next: any) => next())
        const response = await request(app).patch(baseURL + "/products/iphone13").send(testBody)
        expect(response.status).toBe(400)
        expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledTimes(1)
        expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledWith(
            "iphone13",
            testBody.quantity,
            testBody.changeDate
        );
    });
});
