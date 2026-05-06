import { Request, Response } from 'express';
import { PatientModel } from '../models/patientModel.js';

export const MembershipController = {
  
  calculateDiscount: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const { amount } = req.body; // El número que ingresó el usuario en el input

      // 1. Buscamos al paciente para saber qué membresía tiene
      const patient = await PatientModel.getById(id);
      
      if (!patient) {
        return res.status(404).send('Afiliado no encontrado');
      }

      // 2. Hacemos los cálculos matemáticos
      const originalAmount = parseFloat(amount);
      const discountPercentage = patient.membership.discountPercentage;
      
      const discountValue = originalAmount * (discountPercentage / 100);
      const finalPrice = originalAmount - discountValue;

      res.render('afiliado/calcular', {
        patient,
        originalAmount,
        discountPercentage,
        discountValue,
        finalPrice
      });

    } 
    catch (error) {
      console.error(error);
      res.status(500).send('Error al calcular el descuento');
    }
  }
};