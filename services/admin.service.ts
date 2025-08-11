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

// List all weather queries with pagination (admin only)
export async function listWeatherQueriesService(page = 1, size = 10) {
  const skip = (page - 1) * size;
  return prisma.weatherQuery.findMany({
    skip,
    take: size,
    orderBy: { createdAt: "desc" },
  });
}
// List weather queries for a specific user
export async function listUserWeatherQueriesService(userId: string) {
  return prisma.weatherQuery.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
// List all users (admin only)
export async function listUsersService(): Promise<User[]> {
  return prisma.user.findMany();
}
// Update user role (admin only)
export async function updateUserService(id: string, role: Role): Promise<User> {
  return prisma.user.update({ where: { id }, data: { role } });
}
// Delete a user (admin only)
export async function deleteUserService(id: string): Promise<User> {
  // Delete user's weather queries first within a transaction to avoid foreign key constraint errors
  return prisma.$transaction(async (tx) => {
    await tx.weatherQuery.deleteMany({ where: { userId: id } });
    // @ts-ignore: RefreshToken model on transaction client
    await (tx as any).refreshToken.deleteMany({ where: { userId: id } });
    return tx.user.delete({ where: { id } });
  });
}
