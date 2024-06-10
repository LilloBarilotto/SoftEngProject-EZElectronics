import db from "../db/db";
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
    
}

export default CartDAO