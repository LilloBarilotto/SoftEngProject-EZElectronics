import { User } from "../components/user";
import ReviewDAO from "../dao/reviewDAO";
import ProductDAO from "../dao/productDAO";
import {ProductNotFoundError} from "../errors/productError";
import {NoReviewProductError} from "../errors/reviewError";
import {ProductReview} from "../components/review";

class ReviewController {
    private reviewDAO: ReviewDAO
    private productDAO: ProductDAO

    constructor() {
        this.reviewDAO = new ReviewDAO
        this.productDAO = new ProductDAO
    }

    /**
     * Adds a new review for a product
     * @param model The model of the product to review
     * @param user The username of the user who made the review
     * @param score The score assigned to the product, in the range [1, 5]
     * @param comment The comment made by the user
     * @returns A Promise that resolves to nothing
     */
    async addReview(model: string, user: User, score: number, comment: string) /**:Promise<void> */ { }

    /**
     * Returns all reviews for a product
     * @param model The model of the product to get reviews from
     * @returns A Promise that resolves to an array of ProductReview objects
     */
    async getProductReviews(model: string):Promise<ProductReview[]> {

        // if the model does not exist an error is thrown
        if(!await this.productDAO.existsByModel(model)) {
            throw new ProductNotFoundError();
        }

       return await this.reviewDAO.getAllByModel(model);
    }

    /**
     * Deletes the review made by a user for a product
     * @param model The model of the product to delete the review from
     * @param user The user who made the review to delete
     * @returns A Promise that resolves to nothing
     */
    async deleteReview(model: string, user: User):Promise<void>  {
        // if the model does not exist an error is thrown
        if(!await this.productDAO.existsByModel(model)) {
            throw new ProductNotFoundError();
        }

        const result = await this.reviewDAO.deleteByUser(model, user.username);

        // user has not reviewed this product
        if(result < 1 ){
            throw new NoReviewProductError();
        }
    }

    /**
     * Deletes all reviews for a product
     * @param model The model of the product to delete the reviews from
     * @returns A Promise that resolves to nothing
     */
    async deleteReviewsOfProduct(model: string) /**:Promise<void> */ { }

    /**
     * Deletes all reviews of all products
     * @returns A Promise that resolves to nothing
     */
    async deleteAllReviews() /**:Promise<void> */ { }
}

export default ReviewController;