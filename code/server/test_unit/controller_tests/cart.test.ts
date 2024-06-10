import {describe, afterEach, beforeEach, test, expect, jest } from "@jest/globals";
import CartDAO from "./../../src/dao/cartDAO";
import { CallTracker } from "assert";

import CartController from "./../../src/controllers/cartController";

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
