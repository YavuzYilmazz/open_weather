/// <reference types="jest" />
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app";
import { prisma } from "../loaders/db.loader";

describe("End-to-End Auth Flow", () => {
  const testEmail = "e2euser@example.com";
  const testPassword = "TestPass123!";
  let refreshToken: string;

  beforeAll(async () => {
    // Clean up and seed test user
    // @ts-ignore: RefreshToken model on prisma client
    await prisma.refreshToken.deleteMany({});
    await prisma.weatherQuery.deleteMany({});
    await prisma.user.deleteMany({ where: { email: testEmail } });
    const passwordHash = await bcrypt.hash(testPassword, 10);
    await prisma.user.create({
      data: { email: testEmail, passwordHash, role: "USER" },
    });
  });

  afterAll(async () => {
    // Clean up test data
    // @ts-ignore: RefreshToken model on prisma client
    await prisma.refreshToken.deleteMany({});
    await prisma.weatherQuery.deleteMany({});
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it("logs in and receives access & refresh tokens", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("refreshToken");
    refreshToken = res.body.refreshToken;
  });

  it("refreshes tokens successfully", async () => {
    const res = await request(app).post("/auth/refresh").send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("refreshToken");
    // new refresh token invalidates old
    const old = refreshToken;
    refreshToken = res.body.refreshToken;
    const resExpired = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: old });
    expect(resExpired.status).toBe(401);
  });

  it("logs out and invalidates refresh token", async () => {
    const res = await request(app).post("/auth/logout").send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
    // subsequent refresh should fail
    const resAfter = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken });
    expect(resAfter.status).toBe(401);
  });
});
