import Authenticator from "../../src/routers/auth";
import request from "supertest";
import { app } from "../../index";
import ReviewController from "../../src/controllers/reviewController";
import {ProductReview} from "../../src/components/review";
import {ProductNotFoundError} from "../../src/errors/productError";

const baseURL = "/ezelectronics/reviews";

describe ("GET /ezelectronics/reviews/:model", () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const testList: ProductReview[] = [
        new ProductReview(
            "iPhone 13 Pro Max",
            "Mario Rossi",
            5,
            "2024-05-21",
            "ok"
        ),
        new ProductReview(
            "iPhone 13 Pro Max",
            "Luca Rossi",
            5,
            "2024-05-22",
            "ok"
        ),
        new ProductReview(
            "iPhone 13 Pro Max",
            "Mario Verdi",
            5,
            "2024-05-23",
            "ok"
        )
    ];

    test("should return a 401 response code if user is not authenticated", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => res.status(401).json({ error: "Unauthenticated user", status: 401 }));

        const response = await request(app).get(baseURL + "/model").send();

        expect(response.status).toBe(401);
    })

    test("should return 200 success code", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValueOnce(testList);

        const response = await request(app).get(baseURL + "/model").send();

        expect(response.status).toBe(200);
        expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledWith("model");
        expect(response.body).toEqual(testList);
    })

    test("should return a 404 error code if if model does not exists", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
        jest.spyOn(ReviewController.prototype, "getProductReviews").mockRejectedValue(new ProductNotFoundError);

        const response = await request(app).get(baseURL + "/model").send();

        expect(response.status).toBe(404);
    })
})