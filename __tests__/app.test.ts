/// <reference types="jest" />
import request from "supertest";
import app from "../app";

describe("Health and basic routes", () => {
  it("should return health OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("should 404 on unknown route", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Route not found" });
  });

  it("should protect /weather endpoint without token", async () => {
    const res = await request(app).get("/weather");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
