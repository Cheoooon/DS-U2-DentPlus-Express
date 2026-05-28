import { Router, Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';
import { AuthController } from '../controllers/auth.controller.js';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 20, // Límite de 20 peticiones por ventana
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/login', AuthController.renderLogin);
router.post('/login', authLimiter, AuthController.login);
router.get('/register', AuthController.renderRegister);
router.post('/register', authLimiter, AuthController.register);
router.get('/logout', AuthController.logout);

export default router;