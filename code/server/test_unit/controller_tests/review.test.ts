import ProductDAO from "../../src/dao/productDAO";
import ReviewController from "../../src/controllers/reviewController";
import {ProductNotFoundError} from "../../src/errors/productError";
import {ProductReview} from "../../src/components/review";
import ReviewDAO from "../../src/dao/reviewDAO";

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
        jest.spyOn(ProductDAO, "existsByModel").mockResolvedValueOnce(false);

        const response =  controller.getProductReviews(testModel);

        await expect(response).rejects.toThrow(new ProductNotFoundError());
        expect(ProductDAO.existsByModel).toHaveBeenCalledTimes(1);
        expect(ProductDAO.existsByModel).toHaveBeenCalledWith(testModel);
    })

    test("should return a list of reviews", async () => {
        jest.spyOn(ProductDAO, "existsByModel").mockResolvedValueOnce(true);
        jest.spyOn(ReviewDAO, "getAllByModel").mockResolvedValueOnce(testList);

        const response = await controller.getProductReviews(testModel);

        expect(response).toStrictEqual(testList);
        expect(ProductDAO.existsByModel).toHaveBeenCalledTimes(1);
        expect(ProductDAO.existsByModel).toHaveBeenCalledWith(testModel);
        expect(ReviewDAO.getAllByModel).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.getAllByModel).toHaveBeenCalledWith(testModel);
    })


})