import { prisma } from "../lib/prisma.js";

export const PatientModel = {
  getAllPaginated: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        skip,
        take: limit,
        include: { membership: true },
      }),
      prisma.patient.count(),
    ]);
    return { patients, total };
  },

  // Obtener un solo paciente por ID
  getById: async (id: string) => {
    return await prisma.patient.findUnique({
      where: { id },
      include: { membership: true },
    });
  },

  // Crear un paciente
  create: async (data: { firstName: string; lastName: string; email: string; membershipId: string }) => {
    return await prisma.patient.create({ data });
  },

  // Actualizar un paciente
  update: async (id: string, data: { firstName?: string; lastName?: string; email?: string; membershipId?: string }) => {
    return await prisma.patient.update({
      where: { id },
      data,
    });
  },

  // Eliminar un paciente
  delete: async (id: string) => {
    return await prisma.patient.delete({ where: { id } });
  }
};