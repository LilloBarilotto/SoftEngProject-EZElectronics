import {describe, afterEach, beforeEach, test, expect, jest } from "@jest/globals";
import CartController from "./../../src/controllers/cartController";
import CartDAO from "./../../src/dao/cartDAO";
import { CallTracker } from "assert";
import { User, Role  } from "./../../src/components/user";
import {Cart} from "./../../src/components/cart"
import { CartNotFoundError, EmptyCartError, ProductNotInCartError } from "./../../src/errors/cartError";
import { Category, Product } from "../../src/components/product";
import ProductController from "../../src/controllers/productController";
import { EmptyProductStockError, ProductNotFoundError } from "../../src/errors/productError";

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

describe("CartController clearCart", () => {
    let controller : CartController;
    afterEach(() => {
        jest.clearAllMocks();
    })
    beforeEach(()=>{
        controller = new CartController();
    })

    test("should clear the cart if it exists", async () => {
        const user: User = {
            username: "testuser", role: Role.CUSTOMER,
            name: "test",
            surname: "test",
            address: "test",
            birthdate: "test"
        };
        const cart: Cart = { customer: "testuser", paid: false, paymentDate: "", total: 100, products: [] };
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValue(cart);
        jest.spyOn(CartDAO.prototype, "clearCart").mockResolvedValue();

        const result = await controller.clearCart(user);
        expect(result).toBe(true);
        expect(CartDAO.prototype.clearCart).toHaveBeenCalledWith(user.username);
    });

    test("should throw CartNotFoundError if the cart does not exist", async () => {
        const user: User = {
            username: "testuser", role: Role.CUSTOMER,
            name: "test",
            surname: "test",
            address: "test",
            birthdate: "test"
        };

        jest.spyOn(CartDAO.prototype, "clearCart").mockRejectedValue(new CartNotFoundError());

        await expect(controller.clearCart(user)).rejects.toThrow(CartNotFoundError);
        expect(CartDAO.prototype.clearCart).toHaveBeenCalledWith(user.username);
    });
});

describe("CartController getCartsAll", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });


    test("should retrieve all carts", async () => {
        const carts: Cart[] = [
            { customer: "testuser1", paid: false, paymentDate: "", total: 100, products: [] },
            { customer: "testuser2", paid: true, paymentDate: "2023-01-01T00:00:00.000Z", total: 200, products: [] },
        ];
        const controller: CartController =  new CartController;
        jest.spyOn(CartDAO.prototype, "getCartsAll").mockResolvedValue(carts);

        const result = await controller.getAllCarts();
        expect(result).toEqual(carts);
        expect(CartDAO.prototype.getCartsAll).toHaveBeenCalled();
    });

    test("should throw an error if retrieval fails", async () => {
        jest.spyOn(CartDAO.prototype, "getCartsAll").mockRejectedValue(new Error("Failed to retrieve all carts"));
        const controller: CartController =  new CartController;
        await expect(controller.getAllCarts()).rejects.toThrow("Failed to retrieve all carts");
        expect(CartDAO.prototype.getCartsAll).toHaveBeenCalled();
    });
});

describe("CartController getAllCarts", () => {
    const user: User = {
        username: "testuser", role: Role.CUSTOMER,
        name: "test",
        surname: "test",
        address: "test",
        birthdate: "test"
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should retrieve all paid carts for a specific customer", async () => {
        const controller: CartController =  new CartController;
        const carts: Cart[] = [
            { customer: "testuser", paid: true, paymentDate: "2023-01-01T00:00:00.000Z", total: 100, products: [] },
            { customer: "testuser", paid: true, paymentDate: "2023-02-01T00:00:00.000Z", total: 200, products: [] },
        ];

        jest.spyOn(CartDAO.prototype, "getAllCarts").mockResolvedValue(carts);

        const result = await controller.getCustomerCarts(user);
        expect(result).toEqual(carts);
        expect(CartDAO.prototype.getAllCarts).toHaveBeenCalledWith(user.username);
    });
    test("should throw an error if retrieval fails", async () => {
        const controller: CartController =  new CartController;
        jest.spyOn(CartDAO.prototype, "getAllCarts").mockRejectedValue(new Error("Failed to retrieve carts"));

        await expect(controller.getCustomerCarts(user)).rejects.toThrow("Failed to retrieve carts");
        expect(CartDAO.prototype.getAllCarts).toHaveBeenCalledWith(user.username);
    });
});

describe("CartController checkoutCart", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });


    test("should checkout the cart if it exists and has products", async () => {
        const controller : CartController =  new CartController;
        const user: User = {
            username: "testuser", role: Role.CUSTOMER,
            name: "test",
            surname: "test",
            address: "test",
            birthdate: "test"
        };
        const cart: Cart = { customer: "testuser", paid: false, paymentDate: "", total: 120,
            products: [{model: "iphone14", quantity: 1, category: Category.SMARTPHONE, price: 120}] };

        jest.spyOn(ProductController.prototype, "getProducts")
            .mockResolvedValue([{sellingPrice: 120, model: "iphone14", category: Category.SMARTPHONE, arrivalDate: null, details: null, quantity: 12 }]);
        jest.spyOn(ProductController.prototype, "sellProduct")
        .mockResolvedValue(1);
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValue(cart);
        jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValue();

        const result = await controller.checkoutCart(user);
        expect(result).toBe(true);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(user.username);
        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledWith(user.username);
    });

    test("should throw CartNotFoundError if the cart does not exist", async () => {
        const user: User = {
            username: "testuser", role: Role.CUSTOMER,
            name: "test",
            surname: "test",
            address: "test",
            birthdate: "test"
        };
        const controller : CartController =  new CartController;
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValue(null);

        await expect(controller.checkoutCart(user)).rejects.toThrow(CartNotFoundError);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(user.username);
        expect(CartDAO.prototype.checkoutCart).not.toHaveBeenCalled();
    });

    test("should throw EmptyCartError if the cart is empty", async () => {
        const user: User = {
            username: "testuser", role: Role.CUSTOMER,
            name: "test",
            surname: "test",
            address: "test",
            birthdate: "test"
        };
        const cart: Cart = { customer: "testuser", paid: false, paymentDate: "", total: 100, products: [] };
        const controller : CartController =  new CartController;
        jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValue(cart);

        await expect(controller.checkoutCart(user)).rejects.toThrow(EmptyCartError);
        expect(CartDAO.prototype.getCart).toHaveBeenCalledWith(user.username);
        expect(CartDAO.prototype.checkoutCart).not.toHaveBeenCalled();
    });
});

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

describe("CartController addToCart", () => {
    let controller: CartController;

    beforeEach(() => {
        controller = new CartController();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should add a product to the cart if the cart exists", async () => {
        const user: User = {
            username: "testuser", role: Role.CUSTOMER,
            name: "test",
            surname: "test",
            address: "test",
            birthdate: "test"
        };
        const productController =  new ProductController();
        const productModel = "product1";
        const productDetails = [{ model: "product1", category: Category.APPLIANCE, sellingPrice: 50, quantity: 1, arrivalDate: "2024-05-19", details: "details" }];

        jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValue(productDetails);
        jest.spyOn(CartDAO.prototype, "addProductToCart").mockResolvedValue();

        const result = await controller.addToCart(user, productModel);
        expect(result).toBe(true);
        expect(CartDAO.prototype.addProductToCart).toHaveBeenCalledWith(user.username, expect.any(Object));
    });

    test("should throw an error if the product does not exist", async () => {
        const user: User = {
            username: "testuser", role: Role.CUSTOMER,
            name: "test",
            surname: "test",
            address: "test",
            birthdate: "test"
        };
        const productModel = "nonexistent";

        jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValue([]);

        await expect(controller.addToCart(user, productModel)).rejects.toThrow(ProductNotFoundError);
    });
});

describe("CartController getAllCarts", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const user: User = {
        username: "testuser", role: Role.CUSTOMER,
        name: "test",
        surname: "test",
        address: "test",
        birthdate: "test"
    };


    test("should remove one product unit from the cart", async () => {
        const controller: CartController =  new CartController;
        jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockResolvedValue();

        const result = await controller.removeProductFromCart(user, "product1");
        expect(result).toBe(true);
        expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledWith(user.username, "product1");
    });

    test("should throw CartNotFoundError if the cart does not exist", async () => {
        const controller: CartController =  new CartController;
        jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockRejectedValue(new CartNotFoundError());

        await expect(controller.removeProductFromCart(user, "product1")).rejects.toThrow(CartNotFoundError);
        expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledWith(user.username, "product1");
    });

    test("should throw ProductNotInCartError if the product is not in the cart", async () => {
        const controller: CartController =  new CartController;
        jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockRejectedValue(new ProductNotInCartError());

        await expect(controller.removeProductFromCart(user, "product1")).rejects.toThrow(ProductNotInCartError);
        expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledWith(user.username, "product1");
    });

    test("should throw an error if removal fails", async () => {
        const controller: CartController =  new CartController;
        jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockRejectedValue(new Error("Failed to remove product"));

        await expect(controller.removeProductFromCart(user, "product1")).rejects.toThrow("Failed to remove product");
        expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledWith(user.username, "product1");
    });
});