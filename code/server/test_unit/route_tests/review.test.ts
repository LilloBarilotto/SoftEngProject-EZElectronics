import { test, expect, jest } from "@jest/globals"
import Authenticator from "../../src/routers/auth";
import request from "supertest";
import { app } from "../../index";
import ReviewController from "../../src/controllers/reviewController";
import {Role} from "../../src/components/user";
import {ProductReview} from "../../src/components/review";
import {ProductNotFoundError} from "../../src/errors/productError";
import {NoReviewProductError} from "../../src/errors/reviewError";
import {ExistingReviewError} from "../../src/errors/reviewError";


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

describe("DELETE ezelectronics/reviews/:model", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    const testUser = {
        username: "Mario Rossi",
        name: "Mario",
        surname: "Rossi",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "2000-01-01"
    }


    test("should return a 401 response code if user is not customer", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) =>  res.status(401).json({ error: "User is not a customer", status: 401 }));

        const response = await request(app).delete(baseURL + "/model").send();

        expect(response.status).toBe(401);
    })

    test("should return 200 success code", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            req.user = testUser;
            return next();
        });
        jest.spyOn(ReviewController.prototype, "deleteReview").mockResolvedValueOnce();

        const response = await request(app).delete(baseURL + "/model").send();

        expect(response.status).toBe(200);
        expect(ReviewController.prototype.deleteReview).toHaveBeenCalledWith("model", testUser);
    })

    test("should return 404 error code if model does not exists", async() => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            req.user = testUser;
            return next();
        });
        jest.spyOn(ReviewController.prototype, "deleteReview").mockRejectedValue(new ProductNotFoundError);

        const response = await request(app).delete(baseURL + "/model").send();

        expect(response.status).toBe(404);
        expect(ReviewController.prototype.deleteReview).toHaveBeenCalledWith("model", testUser);
    })

    test("should return 404 error code if the current user does not have a review for the product identified by model", async() => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            req.user = testUser;
            return next();
        });
        jest.spyOn(ReviewController.prototype, "deleteReview").mockRejectedValue(new NoReviewProductError);

        const response = await request(app).delete(baseURL + "/model").send();

        expect(response.status).toBe(404);
        expect(ReviewController.prototype.deleteReview).toHaveBeenCalledWith("model", testUser);
    })
})

describe("DELETE ezelectronics/reviews", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should return a 401 response code if user is not a manage nor an admin", async () => {
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) =>  res.status(401).json({ error: "User is not an admin or manager", status: 401 }));

        const response = await request(app).delete(baseURL).send();

        expect(response.status).toBe(401);
    })

    test("should return 200 success code", async () => {
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
        jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValueOnce();

        const response = await request(app).delete(baseURL).send();

        expect(response.status).toBe(200);
    })
})

describe('POST /ezelectronics/:model', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should return a 401 response code if user is not a customer", async () => {
        const testReview = {
            score: 4,
            comment: "test"
        }
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => res.status(401).json({ error: "User is not a customer", status: 401 }));
        const response = await request(app).post(baseURL + "/model").send(testReview);
        expect(response.status).toBe(401);
    })

    test("A validation error should occur", async () => {

        const testReview = {
            score: 10,
            comment: "    "
        }

        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        const response = await request(app).post(baseURL + "/model").send(testReview);

        expect(response.status).toBe(422);
        expect(response.body.error).toContain("score");
        expect(response.body.error).toContain("comment");

    })

    test("should return 200 success code", async () => {

        const testUser = {
            username: "Mario Rossi",
            name: "Mario",
            surname: "Rossi",
            role: Role.CUSTOMER,
            address: "test",
            birthdate: "2000-01-01"
        }

        const testReview = {
            score: 5,
            comment: "test"
        }

        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            // TODO: insert user into request
            req.user = testUser;
            return next();
        });


        jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValueOnce();
        const response = await request(app).post(baseURL + "/model").send(testReview);
        expect(response.status).toBe(200);
        expect(ReviewController.prototype.addReview).toHaveBeenCalledWith("model", testUser, testReview.score, testReview.comment);
    })

    test("should return a 404 error if model does not exists", async () => {
        const testReview = {
            score: 5,
            comment: "test"
        }

        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(ReviewController.prototype, "addReview").mockRejectedValue(new ProductNotFoundError);
        const response = await request(app).post(baseURL + "/model").send(testReview);
        expect(response.status).toBe(404)
    })

    test("should return a 409 error if there is an existing review for the product made by the customer", async () => {
        const testReview = {
            score: 5,
            comment: "test"
        }

        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(ReviewController.prototype, "addReview").mockRejectedValue(new ExistingReviewError);
        const response = await request(app).post(baseURL + "/model").send(testReview);
        expect(response.status).toBe(409)
    })

});