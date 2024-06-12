import db from "../db/db";
import { Cart, ProductInCart } from "../components/cart";
import { Category } from "../components/product";
import { CartNotFoundError, EmptyCartError, ProductNotInCartError } from "../errors/cartError";
import { Utility } from "../utilities";

/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {
    async deleteAllCarts(): Promise<void> {
        try {
            await db.run(`DELETE FROM carts`);
            await db.run(`DELETE FROM  product_in_cart`);
        } catch (error) {
           
            throw new Error('Failed to delete all carts and products in cart');
        }
    }

    async getCart(customer: string): Promise<Cart | null> {
       
        try {
            const cartRow = await new Promise<Cart>((resolve, reject) => {
                db.get(
                    `SELECT * FROM carts WHERE customer = ? AND paid = 0`,
                    [customer],
                    (err, row: Cart) => {
                        if (err) return reject(err);
                        resolve(row);
                    }
                );
            });
            
            if (!cartRow) {
              
                return new Cart(customer, false, "", 0, []);
            }
          
           
            const productsInCart =  await this.getProductsIncart(cartRow.id);
           
            if(!productsInCart){
               
                return cartRow;
            }
            
            const cart = new Cart( cartRow.customer, cartRow.paid, cartRow.paymentDate, cartRow.total, [], cartRow.id);
            cart.products = productsInCart.map(
                (r) => new ProductInCart(r.model, r.quantity, undefined, undefined)
            );
          
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async getProductsIncart(cartId: number):Promise<ProductInCart[]>{
        
        return new Promise<ProductInCart[]>((resolve, reject) => {
            db.all(
                `SELECT * FROM product_in_cart WHERE cart_id = ?`,
                [cartId],
                (err, rows: ProductInCart[]) => {
                    if (err) return reject(err);
                    resolve(rows);
                }
            );
        });
    }
    async addProductToCart(customer: string, product: ProductInCart): Promise<void> {
        let cart = await this.getCart(customer);
        if(Utility.isEmpty(cart)){
           
            cart = await this.createCart(customer);
        }
        const existingProduct = cart.products.find((p) => p.model === product.model);
        if (existingProduct) {
            existingProduct.quantity += 1;
            await db.run(
                `UPDATE  product_in_cart SET quantity = ? WHERE cart_id = ? AND model = ?`,
                [existingProduct.quantity, cart.id, product.model]
            );
        } else {
            cart.products.push(product);
            await db.run(
                `INSERT INTO  product_in_cart (cart_id, model, quantity) VALUES (?, ?, ?)`,
                [cart.id, product.model, product.quantity]
            );
        }
        cart.total += product.price;
        await db.run(`UPDATE carts SET total = ? WHERE id = ?`, [cart.total, cart.id]);
    }

    async clearCart(customer: string): Promise<void> {
        const cart = await this.getCart(customer);
        if (!cart || Utility.isEmpty(cart)) {
            throw new CartNotFoundError();
        }

        cart.products = [];
        cart.total = 0;
        await db.run(`DELETE FROM  product_in_cart WHERE cart_id = ?`, [cart.id]);
        await db.run(`UPDATE carts SET total = ? WHERE id = ?`, [cart.total, cart.id]);
    }

    async getCartsAll(): Promise<Cart[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM carts`, [], async (err, rows: Cart[]) => {
                if (err) {
                    return reject(err);
                }
                const carts: Cart[] = rows.map(row => new Cart(row.customer, row.paid, row.paymentDate, row.total, [], row.id));
                for(let i =0;i<carts.length;i++){
                    carts[i].products =  await this.getProductsIncart(carts[i].id);
                }
                resolve(carts);
            });
        });
    }

    async getAllCarts(username: String): Promise<Cart[]> {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT carts.*, users.username FROM carts JOIN users ON carts.customer = users.username WHERE carts.paid = 1 AND users.username = ?`,
                [username],
                async (err, rows: any[]) => {
                    if (err) {
                        return reject(err);
                    }
                    try {
                        const carts: Cart[] = [];
                        for (const row of rows) {
                            const cart = new Cart(row.customer, row.paid, row.paymentDate, row.total, []);
                            const productsInCart = await new Promise<ProductInCart[]>((resolve, reject) => {
                                db.all(
                                    `SELECT * FROM  product_in_cart WHERE cart_id = ?`,
                                    [row.id],
                                    (err, productRows: ProductInCart[]) => {
                                        if (err) return reject(err);
                                        resolve(productRows);
                                    }
                                );
                            });
                            cart.products = productsInCart.map(
                                (r) => new ProductInCart(r.model, r.quantity, r.category, r.price)
                            );
                            carts.push(cart);
                        }
                        resolve(carts);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    async checkoutCart(customer: string): Promise<void> {
        const cart = await this.getCart(customer);
        if (!cart || Utility.isEmpty(cart)) {
            throw new CartNotFoundError();
        }

        if (cart.products.length === 0) {
            throw new EmptyCartError();
        }

        cart.paid = true;
        cart.paymentDate = new Date().toISOString();
        await db.run(
            `UPDATE carts SET paid = ?, payment_date = ? WHERE id = ?`,
            [cart.paid, cart.paymentDate, cart.id]
        );
    }

    async createCart(customer: string): Promise<Cart> {
        const newCart = new Cart(customer, false, "", 0, []);
        await db.run(
            `INSERT INTO carts (customer, paid, payment_date, total) VALUES (?, ?, ?, ?)`,
            [newCart.customer, newCart.paid, newCart.paymentDate, newCart.total]
        );

        const cart =  await this.getCart(customer);
        return cart;
    }


 

    async removeProductFromCart(customer: string, productModel: string, price: number): Promise<void> {
        const cart = await this.getCart(customer);
        if (!cart || Utility.isEmpty(cart)) {
            throw new CartNotFoundError();
        }
        const productIndex = cart.products.findIndex((p) => p.model === productModel);
        if (productIndex === -1) {
            throw new ProductNotInCartError();
        }

        const product = cart.products[productIndex];
        if (product.quantity > 1) {
            product.quantity -= 1;
            await db.run(
                `UPDATE  product_in_cart SET quantity = ? WHERE cart_id = ? AND model = ?`,
                [product.quantity, cart.id, product.model]
            );
        } else {
            cart.products.splice(productIndex, 1);
            await db.run(`DELETE FROM  product_in_cart WHERE cart_id = ? AND model = ?`, [cart.id, product.model]);
        }
        cart.total -= price;
        await db.run(`UPDATE carts SET total = ? WHERE id = ?`, [cart.total, cart.id]);
    }
}

export default CartDAO;
