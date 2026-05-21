import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50),
  email: z.email('El formato del correo electrónico no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const LoginSchema = z.object({
  email: z.email('Formato de correo inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});