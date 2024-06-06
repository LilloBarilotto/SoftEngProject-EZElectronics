import {Product} from "../components/product";
import db from "../db/db";
import {ProductAlreadyExistsError} from "../errors/productError";

/**
 * A class that implements the interaction with the database for all product-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ProductDAO {
    /**
     * Creates a new product in the database.
     * @param product
     * @returns A promise that resolves to true if the product has been created.
     */
    createProduct(product: Product): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const sql = "INSERT INTO products (model, selling_price, category, arrival_date, details, quantity) VALUES (?, ?, ?, ?, ?, ?)";
                db.run(sql, [product.model, product.sellingPrice, product.category, product.arrivalDate, product.details, product.quantity], (err: Error | null) => {
                    if (err) {
                        if (err.message.includes("UNIQUE constraint failed: products.model")) reject(new ProductAlreadyExistsError)
                        reject(err)
                    }
                    resolve(true)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    updateProduct(model: String, quantity: number, changeDate: String): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const sql = "UPDATE products SET quantity = quantity + ?, arrival_date = ? WHERE model = ?";
                db.run(sql, [quantity, changeDate, model], (err: Error | null) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(true)
                })
            } catch (error) {
                reject(error)
            }
        });
    }

    getProduct(model: String): Promise<Product> {
        return new Promise<Product>((resolve, reject) => {
            try {
                const sql = "SELECT model, selling_price AS sellingPrice, category, arrival_date AS arrivalDate, details, quantity FROM products WHERE model = ?";
                db.get(sql, [model], (err: Error | null, row: Product | undefined) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(row)
                })
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
     * Search product by model
     * @param model
     * @returns A promise that resolves to true if the product exists
     */
    existsByModel(model: string): Promise<boolean> {
        return new  Promise((resolve, reject) => {
            try {
                const sql = "SELECT * FROM products WHERE model = ?";
                db.get(sql, [model], (err, row) => {
                    if(err) {
                        reject(err)
                    }
                    if (row !== null) resolve(true)
                    resolve(false)
                })
            } catch (error){
                reject(error)
            }
        })
    }

}

export default ProductDAO