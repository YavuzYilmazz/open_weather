/// <reference types="jest" />
import request from "supertest";
import app from "../app";

describe("Weather endpoints", () => {
  it("GET /weather without token returns 401", async () => {
    const res = await request(app).get("/weather");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("GET /weather?city=London without token returns 401", async () => {
    const res = await request(app).get("/weather").query({ city: "London" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("GET /weather/queries without token returns 401", async () => {
    const res = await request(app).get("/weather/queries");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("GET /me/queries without token returns 401", async () => {
    const res = await request(app).get("/me/queries");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
