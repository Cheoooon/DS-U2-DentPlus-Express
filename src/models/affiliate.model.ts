import { prisma } from "../lib/prisma.js";

export const AffiliateModel = {
  // Obtener afiliados paginados pero filtrados por el usuario dueño de la sesión
  getAllPaginated: async (userId: number, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    
    const [affiliates, total] = await Promise.all([
      prisma.affiliate.findMany({
        where: { userId }, // Filtro crítico de seguridad
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: { membership: true },
      }),
      prisma.affiliate.count({
        where: { userId },
      }),
    ]);
    
    return { affiliates, total };
  },

  // Obtener un solo afiliado verificando que pertenezca al usuario
  getById: async (id: string, userId: number) => {
    return await prisma.affiliate.findFirst({
      where: { 
        id,
        userId // Evita que usuarios adivinen UUIDs de otros afiliados
      },
      include: { membership: true },
    });
  },

  // Crear un afiliado enlazado explícitamente a su creador
  create: async (data: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    membershipId: string;
    userId: number; // Forzado por la arquitectura relacional
  }) => {
    return await prisma.affiliate.create({ data });
  },

  // Actualizar un afiliado controlando el alcance del usuario
  update: async (
    id: string, 
    userId: number,
    data: { firstName?: string; lastName?: string; email?: string; membershipId?: string }
  ) => {
    return await prisma.affiliate.updateMany({
      where: { 
        id,
        userId 
      },
      data,
    });
  },

  // Eliminar un afiliado controlando el alcance del usuario
  delete: async (id: string, userId: number) => {
    return await prisma.affiliate.deleteMany({
      where: { 
        id,
        userId 
      },
    });
  }
};