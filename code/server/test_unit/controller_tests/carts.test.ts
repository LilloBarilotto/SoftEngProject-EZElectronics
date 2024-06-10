import {describe, afterEach, test, expect, jest } from "@jest/globals";
import CartController from "./../../src/controllers/cartController";
import CartDAO from "./../../src/dao/cartDAO";
import { CartNotFoundError } from "./../../src/errors/cartError";
import { User, Role  } from "./../../src/components/user";
import {Cart} from "./../../src/components/cart"

jest.mock("./../../src/dao/cartDAO");

describe("CartController getCart", () => {
   
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Should return a cart if it exists", async () => {
        const user: User = {
            username: "testuser", role: Role.CUSTOMER,
            name: "test",
            surname: "test",
            address: "test",
            birthdate: "test"
        };
        const controller : CartController =  new CartController;
        const cart: Cart = { customer: "testuser", paid: false, paymentDate: "", total: 100, products: [] };

        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValue(cart);

        const result = await controller.getCart(user);
        expect(result).toEqual(cart);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(user.username);
    });

    test("should return an empty Cart if the cart does not exist", async () => {
        const user: User = {
            username: "testuser", role: Role.CUSTOMER,
            name: "test",
            surname: "test",
            address: "test",
            birthdate: "test"
        };
        const controller : CartController =  new CartController;
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValue({customer: "testuser", paid: false, paymentDate: "",total: 0,products: []});

        const result =  await  controller.getCart(user);
        expect(result).toEqual({customer: "testuser", paid: false, paymentDate: "",total: 0,products: []})
        expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(user.username);
    });
});
