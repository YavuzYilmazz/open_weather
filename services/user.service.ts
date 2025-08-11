import { prisma } from "../loaders/db.loader";

// List weather queries for a specific user
export async function listUserQueriesService(userId: string) {
  return prisma.weatherQuery.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
