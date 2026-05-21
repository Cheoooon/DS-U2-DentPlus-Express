import { z } from 'zod';

export const AffiliateSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(50),
  email: z.email('El formato del correo electrónico no es válido'),
  membershipId: z.uuid('Debes seleccionar una membresía válida'),
});