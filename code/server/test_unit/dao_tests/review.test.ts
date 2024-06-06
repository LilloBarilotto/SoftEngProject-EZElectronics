import db from "../../src/db/db";
import {ProductReview} from "../../src/components/review";
import {Database} from "sqlite3"
import ReviewDAO from "../../src/dao/reviewDAO";

jest.mock("../../src/db/db.ts");

describe("getAllByModel", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

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

    test("resolve a list of reviews if model matches with present models in the db", async () => {
        const mockDb = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, testList);
            return {} as Database;
        });
        const result = await ReviewDAO.getAllByModel(testModel);
        expect(result).toStrictEqual(testList);
        expect(mockDb).toHaveBeenCalledTimes(1);
        expect(mockDb).toBeCalledWith("SELECT * FROM reviews WHERE model = ?", [testModel], expect.any(Function));
    })
})