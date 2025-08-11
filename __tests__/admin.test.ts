/// <reference types="jest" />
import request from "supertest";
import app from "../app";

describe("Admin endpoints without authentication", () => {
  it("GET /admin/users returns 401", async () => {
    const res = await request(app).get("/admin/users");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("GET /admin/queries returns 401", async () => {
    const res = await request(app).get("/admin/queries");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /admin/users returns 401 when creating user after first admin", async () => {
    const res = await request(app)
      .post("/admin/users")
      .send({ email: "test@example.com", password: "pass", role: "USER" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});

// Test weather queries endpoint access
describe("Weather queries endpoint without authentication", () => {
  it("GET /weather/queries returns 401", async () => {
    const res = await request(app).get("/weather/queries");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
