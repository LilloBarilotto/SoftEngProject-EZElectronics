import db from "../db/db";
import { Cart, ProductInCart } from "../components/cart";
import { Category } from "../components/product";
import { CartNotFoundError } from "../errors/cartError";
import { Utility } from "../utilities";

/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {
    async deleteAllCarts(): Promise<void> {
        try {
            await db.run(`DELETE FROM carts`);
            await db.run(`DELETE FROM productsInCart`);
        } catch (error) {
            console.error('Error deleting data from database:', error);
            throw new Error('Failed to delete all carts and products in cart');
        }
    }

    async getCart(customer: string): Promise<Cart | null> {
        try {
            const cartRow = await new Promise<any>((resolve, reject) => {
                db.get(
                    `SELECT * FROM carts WHERE customer = ? AND paid = 0`,
                    [customer],
                    (err, row) => {
                        if (err) return reject(err);
                        resolve(row);
                    }
                );
            });

            if (!cartRow) {
                return new Cart(customer, false, "", 0, []);
            }
            const productsInCart = await new Promise<ProductInCart[]>((resolve, reject) => {
                db.all(
                    `SELECT * FROM productsInCart WHERE cartId = ?`,
                    [cartRow.id],
                    (err, rows: ProductInCart[]) => {
                        if (err) return reject(err);
                        resolve(rows);
                    }
                );
            });

            const cart = new Cart(cartRow.customer, cartRow.paid, cartRow.paymentDate, cartRow.total, []);
            cart.products = productsInCart.map(
                (r) => new ProductInCart(r.model, r.quantity, r.category, r.price)
            );

            return cart;
        } catch (error) {
            throw error;
        }
    }

    async clearCart(customer: string): Promise<void> {
        const cart = await this.getCart(customer);
        if (!cart || Utility.isEmpty(cart)) {
            throw new CartNotFoundError();
        }

        cart.products = [];
        cart.total = 0;
        await db.run(`DELETE FROM productsInCart WHERE cartId = ?`, [cart.id]);
        await db.run(`UPDATE carts SET total = ? WHERE id = ?`, [cart.total, cart.id]);
    }
}

export default CartDAO;
