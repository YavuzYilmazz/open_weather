/// <reference types="jest" />
import request from "supertest";
import app from "../app";

describe("Auth endpoints", () => {
  describe("POST /auth/login", () => {
    it("returns 400 if email or password missing", async () => {
      const res = await request(app).post("/auth/login").send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("returns 401 for invalid credentials", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: "noone@example.com", password: "wrong" });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /auth/refresh", () => {
    it("returns 400 if refreshToken missing", async () => {
      const res = await request(app).post("/auth/refresh").send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("returns 401 for invalid refresh token", async () => {
      const res = await request(app)
        .post("/auth/refresh")
        .send({ refreshToken: "invalid.token" });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /auth/logout", () => {
    it("returns 400 if refreshToken missing", async () => {
      const res = await request(app).post("/auth/logout").send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });
});
