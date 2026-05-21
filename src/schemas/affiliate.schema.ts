import { z } from 'zod';
import { AffiliateModel } from '../models/affiliate.model.js';

export const AffiliateSchema = (userId: number) => {
  return z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(50),
    email: z.email('El formato del correo electrónico no es válido'),
    membershipId: z.uuid('Debes seleccionar una membresía válida'),
  })
  .superRefine(async (data, ctx) => {
    // Realizamos la consulta a la base de datos usando el userId del contexto actual
    const existingAffiliate = await AffiliateModel.getByEmail(data.email, userId);
    
    if (existingAffiliate) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'Ya tienes un afiliado registrado con ese correo electrónico.',
      });
    }
  });
};