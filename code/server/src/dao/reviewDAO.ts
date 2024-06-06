import db from "../db/db";
import {ProductReview} from "../components/review";

/**
 * A class that implements the interaction with the database for all review-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ReviewDAO {

    static create(review: ProductReview): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                const sql = "INSERT INTO reviews (model, user, score, date, comment) VALUES (?, ?, ?, ?, ?)";
                db.run(sql, [review.model, review.user, review.score, review.date, review.comment], function (err) {
                    if(err) reject(err);
                    if(this.changes !== 1){
                        resolve(false);
                    }
                    resolve(true);
                } )
            } catch (err) {
                reject(err);
            }
        })
    }

    /**
     * Get all reviews by the model
     * @param model
     * @returns list of reviews
     */
    static getAllByModel(model: string): Promise<ProductReview[]>{
        return new Promise<ProductReview[]>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM reviews WHERE model = ?";
                db.all(sql, [model], (err, rows:ProductReview[] | undefined) => {
                    if(err) return reject(err);
                    if(!rows) {
                        resolve([]);
                    }

                    const reviews  = rows.map(
                        (row) => {
                            return new ProductReview(row.model, row.user, row.score, row.date, row.comment);
                        });
                    resolve(reviews);
                })

            } catch (err){
                reject(err);
            }
        })
    }
}

export default ReviewDAO;