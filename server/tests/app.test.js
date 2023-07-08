const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Test the root path", () => {
    test("It should response the GET method", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });

});

afterAll(async () => {
    await mongoose.connection.close();
});