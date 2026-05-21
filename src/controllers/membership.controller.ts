import { Request, Response } from 'express';
import { AffiliateModel } from '../models/affiliate.model.js';

export const MembershipController = {
  
  calculateDiscount: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const { amount } = req.body;
      const userId = req.session.userId!;
      
      const affiliate = await AffiliateModel.getById(id, userId);
      
      if (!affiliate) {
        return res.status(404).send('Afiliado no encontrado');
      }

      const originalAmount = parseFloat(amount);
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