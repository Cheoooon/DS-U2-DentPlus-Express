import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model.js';
import { RegisterSchema, LoginSchema } from '../schemas/auth.schema.js';
import { ZodError } from 'zod';

export const AuthController = {
  renderLogin: (req: Request, res: Response) => {
    if (req.session.userId) return res.redirect('/affiliates');
    res.render('auth/login');
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = LoginSchema.parse(req.body);

      const user = await UserModel.getByEmail(email);
      if (!user) {
        return res.render('auth/login', { error: 'Credenciales inválidas', email });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.render('auth/login', { error: 'Credenciales inválidas', email });
      }

      // Guardar sesión
      req.session.userId = user.id;
      req.session.userName = user.name;

      res.redirect('/affiliates');
    } 
    catch (err) {
      if (err instanceof ZodError) {
        return res.render('auth/login', { error: err.issues[0].message });
      }
      res.render('auth/login', { error: 'Ocurrió un error inesperado' });
    }
  },

  renderRegister: (req: Request, res: Response) => {
    if (req.session.userId) return res.redirect('/affiliates');
    res.render('auth/register');
  },

  register: async (req: Request, res: Response) => {
    try {
      // Validar datos de registro con Zod
      const { name, email, password } = RegisterSchema.parse(req.body);

      const existingUser = await UserModel.getByEmail(email);
      if (existingUser) {
        return res.render('auth/register', { error: 'El correo ya está registrado', name, email });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await UserModel.create({ name, email, passwordHash });

      res.redirect('/login');
    } 
    catch (err) {
        console.log('Error en registro:', err);
        if (err instanceof ZodError) {
            return res.render('auth/register', { 
                error: err.issues[0].message,
                ...req.body 
            });
        }
        res.render('auth/register', { error: 'Error al registrar el usuario' });
    }
  },

  logout: (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
};