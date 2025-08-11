/// <reference types="jest" />
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app";
import { prisma } from "../loaders/db.loader";

describe("Admin CRUD Flow", () => {
  const adminEmail = "admin@example.com";
  const adminPass = "AdminPass123!";
  let adminToken: string;
  let newUserId: string;

  beforeAll(async () => {
    // Clean existing data
    // @ts-ignore: RefreshToken model on prisma client
    await prisma.refreshToken.deleteMany({});
    await prisma.weatherQuery.deleteMany({});
    await prisma.user.deleteMany({});
    const passwordHash = await bcrypt.hash(adminPass, 10);
    // Seed first admin user
    await prisma.user.create({
      data: { email: adminEmail, passwordHash, role: "ADMIN" },
    });
  });

  afterAll(async () => {
    // @ts-ignore: RefreshToken model on prisma client
    await prisma.refreshToken.deleteMany({});
    await prisma.weatherQuery.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it("admin can login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: adminEmail, password: adminPass });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    adminToken = res.body.token;
  });

  it("admin can create a new user", async () => {
    const res = await request(app)
      .post("/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "user1@example.com",
        password: "UserPass123!",
        role: "USER",
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("user1@example.com");
    newUserId = res.body.id;
  });

  it("admin can list users", async () => {
    const res = await request(app)
      .get("/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const emails = res.body.map((u: any) => u.email);
    expect(emails).toContain("user1@example.com");
  });

  it("admin can update user role", async () => {
    const res = await request(app)
      .patch(`/admin/users/${newUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "ADMIN" });
    expect(res.status).toBe(200);
    expect(res.body.role).toBe("ADMIN");
  });

  it("admin can delete the user", async () => {
    const res = await request(app)
      .delete(`/admin/users/${newUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
  });
});
