import { prisma } from "../loaders/db.loader";
import { User, Role } from "@prisma/client";

// Create a new user (admin only)
export async function createUserService(data: {
  email: string;
  passwordHash: string;
  role?: Role;
}): Promise<User> {
  return prisma.user.create({ data });
}

// List all weather queries (admin only)
export async function listWeatherQueriesService() {
  return prisma.weatherQuery.findMany();
}
