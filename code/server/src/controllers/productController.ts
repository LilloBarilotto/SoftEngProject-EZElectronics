import ProductDAO from "../dao/productDAO";
import {Category, Product} from "../components/product";
import dayjs from "dayjs";
import {
    ChangeDateAfterCurrentDateError,
    ChangeDateBeforeArrivalDateError,
    ProductNotFoundError,
    EmptyProductStockError,
    LowProductStockError
} from "../errors/productError";
import {DateError} from "../utilities";

/**
 * Represents a controller for managing products.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class ProductController {
    private dao: ProductDAO

    constructor() {
        this.dao = new ProductDAO
    }

    /**
     * Registers a new product concept (model, with quantity defining the number of units available) in the database.
     * @param model The unique model of the product.
     * @param category The category of the product.
     * @param quantity The number of units of the new product.
     * @param details The optional details of the product.
     * @param sellingPrice The price at which one unit of the product is sold.
     * @param arrivalDate The optional date in which the product arrived.
     * @returns A Promise that resolves to nothing.
     */
    async registerProducts(model: string, category: string, quantity: number, details: string | null, sellingPrice: number, arrivalDate: string | null) /**:Promise<void> */ {
        const categoryEnum = category as Category
        const product = new Product(sellingPrice, model, categoryEnum, arrivalDate ?? dayjs().format("YYYY-MM-DD"), details, quantity)

        return this.dao.createProduct(product)
    }

    /**
     * Increases the available quantity of a product through the addition of new units.
     * @param model The model of the product to increase.
     * @param newQuantity The number of product units to add. This number must be added to the existing quantity, it is not a new total.
     * @param changeDate The optional date in which the change occurred.
     * @returns A Promise that resolves to the new available quantity of the product.
     */
    async changeProductQuantity(model: string, newQuantity: number, changeDate: string | null) : Promise<number> {
        const product = await this.dao.getProduct(model);
        const date = changeDate === null ? dayjs() : dayjs(changeDate);

        if (product === undefined) {
            throw new ProductNotFoundError();
        }
        if (date.isAfter(dayjs())) {
            throw new ChangeDateAfterCurrentDateError();
        }
        if (date.isBefore(dayjs(product.arrivalDate))) {
            throw new ChangeDateBeforeArrivalDateError();
        }

        await this.dao.updateProduct(model, newQuantity, date.format("YYYY-MM-DD"));

        return (await this.dao.getProduct(model)).quantity;
    }

    /**
     * Decreases the available quantity of a product through the sale of units.
     * @param model The model of the product to sell
     * @param quantity The number of product units that were sold.
     * @param sellingDate The optional date in which the sale occurred.
     * @returns A Promise that resolves to the new available quantity of the product.
     */
    async sellProduct(model: string, quantity: number, sellingDate: string | null): Promise<number> {
        const product = await this.dao.getProduct(model);
        const sellingDateParsed = sellingDate ?? dayjs().format("YYYY-MM-DD");

        if (!product) {
            throw new ProductNotFoundError();
        }

        if (dayjs(sellingDateParsed).isBefore(product.arrivalDate, "day")) {
            throw new DateError();
        }

        if (product.quantity === 0) {
            throw new EmptyProductStockError();
        }

        if (product.quantity < quantity) {
            throw new LowProductStockError();
        }

        await this.dao.sellProduct(model, quantity);
        return product.quantity - quantity;
    }

    /**
     * Returns all products in the database, with the option to filter them by category or model.
     * @param grouping An optional parameter. If present, it can be either "category" or "model".
     * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
     * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
     * @returns A Promise that resolves to an array of Product objects.
     */
    async getProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
        // Select the first not null value or undefined
        const filterValue = category ?? model ?? null;
        const products = await this.dao.getProducts(grouping, filterValue);
        if (grouping === "model" && products.length === 0) {
            throw new ProductNotFoundError();
        }
        return products;
    }

    /**
     * Returns all available products (with a quantity above 0) in the database, with the option to filter them by category or model.
     * @param grouping An optional parameter. If present, it can be either "category" or "model".
     * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
     * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
     * @returns A Promise that resolves to an array of Product objects.
     */
    async getAvailableProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
        // Select the first not null value or undefined
        const filterValue = category ?? model ?? null;
        const products = await this.dao.getAvailableProducts(grouping, filterValue);
        if (grouping === "model" && products.length === 0) {
            throw new ProductNotFoundError();
        }
        return products;
    }

    /**
     * Deletes all products.
     * @returns A Promise that resolves to `true` if all products have been successfully deleted.
     */
    async deleteAllProducts(): Promise <Boolean> {
        return this.dao.deleteAllProducts();
    }


    /**
     * Deletes one product, identified by its model
     * @param model The model of the product to delete
     * @returns A Promise that resolves to `true` if the product has been successfully deleted.
     */
    async deleteProduct(model: string): Promise <Boolean> {
        if (await this.dao.getProduct(model) === undefined) {
            throw new ProductNotFoundError();
        }

        return this.dao.deleteProduct(model);
    }

}

export default ProductController;