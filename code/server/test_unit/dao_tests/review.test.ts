import {ProductReview} from "../../src/components/review";
import {expect, jest, test} from "@jest/globals"

import db from "../../src/db/db"
import {Database} from "sqlite3"
import ReviewDAO from "../../src/dao/reviewDAO";
import {Role} from "../../src/components/user";
import * as MockDate from "mockdate";
import exp = require("node:constants");

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
        const reviewDAO = new ReviewDAO();

        const result = await reviewDAO.getAllByModel(testModel);
        expect(result).toStrictEqual(testList);
        expect(mockDb).toHaveBeenCalledTimes(1);
        expect(mockDb).toHaveBeenCalledWith("SELECT * FROM reviews WHERE model = ?", [testModel], expect.any(Function));
    })
})

describe("deleteByUser", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    const testModel = "iPhone 13 Pro Max";
    const testUser = {
        username: "Mario Rossi",
        name: "Mario",
        surname: "Rossi",
        role: Role.CUSTOMER,
        address: "test",
        birthdate: "2000-01-01"
    };

    test("should resolve the number of deleted rows", async () => {
        const mockDb = jest.spyOn(db, "run").mockImplementation((sql, param, callback) => {
            callback.call({changes: 1}, null);
            return {} as Database;
        });
        const reviewDAO = new ReviewDAO();

        const response = await reviewDAO.deleteByUser(testModel, testUser.username);
        expect(response).toBe(1);
        expect(mockDb).toHaveBeenCalledTimes(1);
        expect(mockDb).toHaveBeenCalledWith("DELETE FROM reviews WHERE model = ? AND user = ?", [testModel, testUser.username], expect.any(Function));
    })
})

describe('deleteAll', () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    test("should resolve the number of deleted rows", async () => {
        const mockDb = jest.spyOn(db, "run").mockImplementation((sql, callback) => {
            callback.call({changes: 5}, null);
            return {} as Database;
        });

        const reviewDAO = new ReviewDAO();

        const response = await reviewDAO.deleteAll();
        expect(response).toBe(5);
        expect(mockDb).toHaveBeenCalledTimes(1);
        expect(mockDb).toHaveBeenCalledWith("DELETE FROM reviews", expect.any(Function));
    })
});

describe ('create review', ()=>{
    afterEach(() => {
        jest.restoreAllMocks();
        MockDate.reset();
        jest.resetAllMocks();
    });

    test("resolve true if review is inserted", async () => {
        const mockDb = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            // changes.call represent the function context, the first param is the object `this`
            callback.call({changes: 1}, null);
            return {} as Database;
        });
        const date = "2024-05-23";
        MockDate.set(date);
        const review = new ProductReview("iPhone 13 Pro Max", "Mario Rossi", 4, date, "test");
        const reviewDAO = new ReviewDAO();
        const result = await reviewDAO.create(review);

        expect(result).toBe(true);
        expect(mockDb).toHaveBeenCalledTimes(1);
        expect(mockDb).toHaveBeenCalledWith("INSERT INTO reviews (model, user, score, date, comment) VALUES (?, ?, ?, ?, ?)", ["iPhone 13 Pro Max", "Mario Rossi", 4, date, "test"], expect.any(Function));
    })
})

describe("deleteAllByModel", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    const testModel = "iPhone 13 Pro Max";

    test("should resolve the number of deleted rows", async () => {
        const mockDb = jest.spyOn(db, "run").mockImplementation((sql, param, callback) => {
            callback.call({changes: 5}, null);
            return {} as Database;
        });
        const reviewDAO = new ReviewDAO();

        const response = await reviewDAO.deleteAllByModel(testModel);
        expect(response).toBe(5);
        expect(mockDb).toHaveBeenCalledTimes(1);
        expect(mockDb).toHaveBeenCalledWith("DELETE FROM reviews WHERE model = ?", [testModel], expect.any(Function));
    })
})