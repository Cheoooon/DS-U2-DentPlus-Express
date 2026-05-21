import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

const router = Router();

router.get('/login', AuthController.renderLogin);
router.post('/login', AuthController.login);
router.get('/register', AuthController.renderRegister);
router.post('/register', AuthController.register);
router.get('/logout', AuthController.logout);

export default router;