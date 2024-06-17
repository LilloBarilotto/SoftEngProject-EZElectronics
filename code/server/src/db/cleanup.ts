"use strict"

import db from "../db/db";

/**
 * Deletes all data from the database.
 * This function must be called before any integration test, to ensure a clean database state for each test run.
 */

/**export function cleanup() {
    db.serialize(() => {
        // Delete all data from the database.
        db.run("DELETE FROM users")
        //Add delete statements for other tables here

    })
} */

export async function cleanup(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run("DELETE FROM users", (err) => {
                if (err) reject(err);
                db.run("DELETE FROM products", (err) => {
                    if (err) reject(err);
                    db.run("DELETE FROM product_in_cart", (err) => {
                        if (err) reject(err);
                        db.run("DELETE FROM carts", (err) => {
                            if (err) reject(err);
                            db.run("DELETE FROM reviews", (err) => {
                                if (err) reject(err);
                                resolve();
                            });
                        });
                    });
                });
            });
        });
    });
}

export async function cleanProducts(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run("DELETE FROM products", (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    });
}