import { prisma } from "../lib/prisma.js";

export const UserModel = {
  getByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  create: async (data: { name: string; email: string; passwordHash: string }) => {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
      },
    });
  },

  getById: async (id: number) => {
    return await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true }, // Evitamos mandar el hash a la vista
    });
  }
};