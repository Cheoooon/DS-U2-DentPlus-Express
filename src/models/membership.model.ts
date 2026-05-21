import { prisma } from "../lib/prisma.js";

export const MembershipModel = {
  getAll: async () => {
    return await prisma.membership.findMany();
  }
};