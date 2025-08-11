/// <reference types="jest" />
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app";
import { prisma } from "../loaders/db.loader";

describe("User Query Flow", () => {
  const userEmail = "userflow@example.com";
  const userPass = "UserFlow123!";
  let userToken: string;
  let queryId: string;

  beforeAll(async () => {
    // Clean up and seed a user
    // @ts-ignore
    await prisma.refreshToken.deleteMany({});
    await prisma.weatherQuery.deleteMany({});
    await prisma.user.deleteMany({ where: { email: userEmail } });
    const passwordHash = await bcrypt.hash(userPass, 10);
    await prisma.user.create({
      data: { email: userEmail, passwordHash, role: "USER" },
    });
  });

  afterAll(async () => {
    // Clean test data
    // @ts-ignore
    await prisma.refreshToken.deleteMany({});
    await prisma.weatherQuery.deleteMany({});
    await prisma.user.deleteMany({ where: { email: userEmail } });
    await prisma.$disconnect();
  });

  it("logs in as user and retrieves token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: userEmail, password: userPass });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    userToken = res.body.token;
  });

  it("allows user to submit a weather query", async () => {
    const res = await request(app)
      .get("/weather")
      .query({ city: "Paris" })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("userId");
    queryId = res.body.id;
  });

  it("lists own queries under /weather/queries", async () => {
    const res = await request(app)
      .get("/weather/queries")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const ids = res.body.map((q: any) => q.id);
    expect(ids).toContain(queryId);
  });

  it("lists own queries under /me/queries route", async () => {
    const res = await request(app)
      .get("/me/queries")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    const ids = res.body.map((q: any) => q.id);
    expect(ids).toContain(queryId);
  });
});
