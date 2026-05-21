import { z } from 'zod';
import { AffiliateModel } from '../models/affiliate.model.js';

export const AffiliateSchema = (userId: number, affiliateId?: string) => {
  return z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(50),
    email: z.email('El formato del correo electrónico no es válido'),
    membershipId: z.uuid('Debes seleccionar una membresía válida'),
  })
  .superRefine(async (data, ctx) => {
    const existingAffiliate = await AffiliateModel.getByEmail(data.email, userId);
    
    if (existingAffiliate && existingAffiliate.id !== affiliateId) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'Ya tienes un afiliado registrado con ese correo electrónico.',
      });
    }
  });
};