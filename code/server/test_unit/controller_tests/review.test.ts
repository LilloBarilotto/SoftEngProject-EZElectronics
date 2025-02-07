import {jest, test} from "@jest/globals"
import ProductDAO from "../../src/dao/productDAO";
import ReviewDAO from "../../src/dao/reviewDAO";
import ReviewController from "../../src/controllers/reviewController";
import {ExistingReviewError} from "../../src/errors/reviewError";
import {ProductNotFoundError} from "../../src/errors/productError";
import {ProductReview} from "../../src/components/review";
import {Role, User} from "../../src/components/user";
import {NoReviewProductError} from "../../src/errors/reviewError";
import * as MockDate from "mockdate";

jest.mock("../../src/dao/reviewDAO")
jest.mock("../../src/dao/productDAO");


describe("getProductReviews", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const controller = new ReviewController();
    const testModel = "iPhone 13 Pro Max";
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



    test("should throw ProductNotFoundError", async () => {
        jest.spyOn(ProductDAO.prototype, "existsByModel").mockResolvedValueOnce(false);

        const response =  controller.getProductReviews(testModel);

        await expect(response).rejects.toThrow(new ProductNotFoundError());
        expect(ProductDAO.prototype.existsByModel).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.existsByModel).toHaveBeenCalledWith(testModel);
    })

    test("should return a list of reviews", async () => {
        jest.spyOn(ProductDAO.prototype, "existsByModel").mockResolvedValueOnce(true);
        jest.spyOn(ReviewDAO.prototype, "getAllByModel").mockResolvedValueOnce(testList);

        const response = await controller.getProductReviews(testModel);

        expect(response).toStrictEqual(testList);
        expect(ProductDAO.prototype.existsByModel).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.existsByModel).toHaveBeenCalledWith(testModel);
        expect(ReviewDAO.prototype.getAllByModel).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.getAllByModel).toHaveBeenCalledWith(testModel);
    })
})

describe("deleteReview", () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    const controller = new ReviewController();
    const testModel = "iPhone 13 Pro Max";
    const testUser = {
        username: "Mario Rossi",
        name: "Mario",
        surname: "Rossi",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "2000-01-01"
    };


    test("should throw ProductNotFoundError", async () => {
        jest.spyOn(ProductDAO.prototype, "existsByModel").mockResolvedValueOnce(false);

        const response = controller.deleteReview(testModel, testUser);

        await expect(response).rejects.toThrow(new ProductNotFoundError());
        expect(ProductDAO.prototype.existsByModel).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.existsByModel).toHaveBeenCalledWith(testModel);
    })

    test("should throw NoReviewProductError", async () => {
        jest.spyOn(ProductDAO.prototype, "existsByModel").mockResolvedValueOnce(true);
        jest.spyOn(ReviewDAO.prototype, "deleteByUser").mockResolvedValueOnce(0);

        const response = controller.deleteReview(testModel, testUser);

        await expect(response).rejects.toThrow(new NoReviewProductError());

        expect(ProductDAO.prototype.existsByModel).toHaveBeenCalledWith(testModel);
        expect(ReviewDAO.prototype.deleteByUser).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.deleteByUser).toHaveBeenCalledWith(testModel, testUser.username);
    })

    test("should return a promise that resolve nothing", async () => {
        jest.spyOn(ProductDAO.prototype, "existsByModel").mockResolvedValueOnce(true);
        jest.spyOn(ReviewDAO.prototype, "deleteByUser").mockResolvedValueOnce(1);

        const response = await controller.deleteReview(testModel, testUser);

        expect(ReviewDAO.prototype.deleteByUser).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.deleteByUser).toHaveBeenCalledWith(testModel, testUser.username);
    })
})

describe("deleteAllReviews", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    const controller = new ReviewController();

    test("should return a promise that resolve nothing", async () => {
        jest.spyOn(ReviewDAO.prototype, "deleteAll").mockResolvedValueOnce(5);

        const response = await controller.deleteAllReviews();
    })
})

describe("addReview", () => {
    afterEach(() => {
        jest.clearAllMocks();
        MockDate.reset();
    });

    const testReview = new ProductReview(
        "iPhone 13 Pro Max",
        "Mario Rossi",
        5,
        "2024-05-21",
        "ok"
    )
    const testUser = new User(
        "Mario Rossi",
        "Mario",
        "Rossi",
        Role.CUSTOMER,
        "via test",
        "2000-01-01"
    )

    test("should throw ExistingReviewError", async  () => {

        MockDate.set(testReview.date);
        jest.spyOn(ProductDAO.prototype, "existsByModel").mockResolvedValueOnce(true);
        jest.spyOn(ReviewDAO.prototype, "create").mockResolvedValueOnce(false);

        const controller = new ReviewController();
        const response = controller.addReview(
            testReview.model,
            testUser,
            testReview.score,
            testReview.comment
        );
        await expect(response).rejects.toThrow(new ExistingReviewError());

        expect(ProductDAO.prototype.existsByModel).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.existsByModel).toHaveBeenCalledWith(testReview.model);
        expect(ReviewDAO.prototype.create).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.create).toHaveBeenCalledWith(testReview);

    })

    test("should throw ProductNotFoundError", async  () => {

        jest.spyOn(ProductDAO.prototype, "existsByModel").mockResolvedValueOnce(false);

        const controller = new ReviewController();
        const response = controller.addReview(
            testReview.model,
            testUser,
            testReview.score,
            testReview.comment
        );
        await expect(response).rejects.toThrow(new ProductNotFoundError());

        expect(ProductDAO.prototype.existsByModel).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.existsByModel).toHaveBeenCalledWith(testReview.model);

    })
})

describe("deleteReviewsOfProduct", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    const controller = new ReviewController();
    const testModel = "iPhone 13 Pro Max";


    test("should throw ProductNotFoundError", async () => {
        jest.spyOn(ProductDAO.prototype, "existsByModel").mockResolvedValueOnce(false);

        const response = controller.deleteReviewsOfProduct(testModel);

        await expect(response).rejects.toThrow(new ProductNotFoundError());
        expect(ProductDAO.prototype.existsByModel).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.existsByModel).toHaveBeenCalledWith(testModel);
    })

    test("should return a promise that resolve nothing", async () => {
        jest.spyOn(ProductDAO.prototype, "existsByModel").mockResolvedValueOnce(true);
        jest.spyOn(ReviewDAO.prototype, "deleteAllByModel").mockResolvedValueOnce(2);

        const response = await controller.deleteReviewsOfProduct(testModel);

    })
})