import { Request, Response } from 'express';
import { z } from 'zod';
import { AffiliateModel } from '../models/affiliate.model.js';

const ComputeSchema = z.object({
  amount: z.coerce.number().positive('El monto debe ser un número positivo'),
});

export const MembershipController = {
  
  calculateDiscount: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const userId = req.session.userId!;

      const affiliate = await AffiliateModel.getById(id, userId);
      
      if (!affiliate) {
        return res.status(404).send('Afiliado no encontrado');
      }

      const validation = ComputeSchema.safeParse(req.body);
      if (!validation.success) {
        return res.render('affiliates/show', {
          affiliate,
          error: validation.error.issues[0].message
        });
      }

      const originalAmount = validation.data.amount;
      const discountPercentage = affiliate.membership.discountPercentage;
      
      const discountValue = originalAmount * (discountPercentage / 100);
      const finalPrice = originalAmount - discountValue;

      res.render('affiliates/compute', {
        affiliate,
        calculation: {
          originalAmount,
          discountPercentage,
          discountValue,
          finalPrice
        }
      });

    } 
    catch (error) {
      console.error(error);
      res.status(500).send('Error al calcular el descuento');
    }
  }
};