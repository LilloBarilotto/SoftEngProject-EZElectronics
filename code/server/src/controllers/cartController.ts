import { LowProductStockError } from "../errors/productError";
import { User } from "../components/user";
import { Cart, ProductInCart } from "../components/cart";
import CartDAO from "../dao/cartDAO";
import { CartNotFoundError, ProductInCartError, ProductNotInCartError, EmptyCartError } from "../errors/cartError";
import ProductController from "./productController";
import { EmptyProductStockError, ProductNotFoundError } from "../errors/productError";
import { Utility } from "../utilities";
/**
 * Represents a controller for managing shopping carts.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class CartController {
    private dao: CartDAO
    private productController: ProductController

    constructor() {
        this.dao = new CartDAO
        this.productController = new ProductController();
    }

    /**
     * Adds a product to the user's cart. If the product is already in the cart, the quantity should be increased by 1.
     * If the product is not in the cart, it should be added with a quantity of 1.
     * If there is no current unpaid cart in the database, then a new cart should be created.
     * @param user - The user to whom the product should be added.
     * @param productId - The model of the product to add.
     * @returns A Promise that resolves to `true` if the product was successfully added.
     */
    async addToCart(user: User, productModel: string): Promise<boolean> {
        const products =  await this.productController.getAvailableProducts("model", null, productModel);

        if (products.length === 0) {
            throw new ProductNotFoundError();
        }

        const productDetails = products[0];  // Assuming the first product is the desired one

        const product = new ProductInCart(productDetails.model, 1, productDetails.category, productDetails.sellingPrice);
        try {
            await this.dao.addProductToCart(user.username, product);
            return true;
        } catch (error) {
            throw error;
        }
    }


    /**
     * Retrieves the current cart for a specific user.
     * @param user - The user for whom to retrieve the cart.
     * @returns A Promise that resolves to the user's cart or an empty one if there is no current cart.
     */
    async getCart(user: User): Promise<Cart> {
            const cart = await this.dao.getCart(user.username);
            if (!cart) {
                throw new CartNotFoundError();
            }
            return cart;
    }

    /**
     * Checks out the user's cart. We assume that payment is always successful, there is no need to implement anything related to payment.
     * @param user - The user whose cart should be checked out.
     * @returns A Promise that resolves to `true` if the cart was successfully checked out.
     * 
     */


    async checkoutCart(user: User): Promise<boolean> {
        try {
            const cart = await this.dao.getCart(user.username);
            if (!cart || Utility.isEmpty(cart)) {
                throw new CartNotFoundError();
            }
            if (cart.products.length === 0) {
                throw new EmptyCartError();
            }

            for (const productInCart of cart.products) {
                const product = await this.productController.getProducts("model", null, productInCart.model);
                if (!product || product.length === 0) {
                    throw new Error(`Product ${productInCart.model} not found`);
                }
                const availableProduct = product[0];
                if (availableProduct.quantity === 0) {
                    throw new EmptyProductStockError();
                }
                if (productInCart.quantity > availableProduct.quantity) {
                    throw new LowProductStockError();
                }
            }

            await this.dao.checkoutCart(user.username);
            return true;
        } catch (error) {
            if (error instanceof CartNotFoundError || error instanceof EmptyCartError || error instanceof EmptyProductStockError || error instanceof LowProductStockError) {
                throw error;
            }
            throw new Error("Unexpected error during checkout");
        }
    }


    /**
     * Retrieves all paid carts for a specific customer.
     * @param user - The customer for whom to retrieve the carts.
     * @returns A Promise that resolves to an array of carts belonging to the customer.
     * Only the carts that have been checked out should be returned, the current cart should not be included in the result.
     */
    async getCustomerCarts(user: User): Promise<Cart[]> {
        return await this.dao.getAllCarts(user.username);
    }

    /**
     * Removes one product unit from the current cart. In case there is more than one unit in the cart, only one should be removed.
     * @param user The user who owns the cart.
     * @param product The model of the product to remove.
     * @returns A Promise that resolves to `true` if the product was successfully removed.
     */
    async removeProductFromCart(user: User, product: string) /**Promise<Boolean> */ { }


    /**
     * Removes all products from the current cart.
     * @param user - The user who owns the cart.
     * @returns A Promise that resolves to `true` if the cart was successfully cleared.
     */
    async clearCart(user: User): Promise<boolean> {
        await this.dao.clearCart(user.username);
        return true;
    }
    /**
     * Deletes all carts of all users.
     * @returns A Promise that resolves to `true` if all carts were successfully deleted.
     */
    async deleteAllCarts(): Promise<boolean> {
        try {
            await this.dao.deleteAllCarts();
            return true;
        } catch (error) {
            throw new Error("Failed to delete all carts");
        }
    }

    /**
     * Retrieves all carts in the database.
     * @returns A Promise that resolves to an array of carts.
     */
    async getAllCarts(): Promise<Cart[]> {
        try {
            const carts = await this.dao.getCartsAll();
            return carts;
        } catch (error) {
            throw new Error("Failed to retrieve all carts");
        }
    }
}

export default CartController