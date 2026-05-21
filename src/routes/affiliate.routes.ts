import { Router } from "express";
import { AffiliateController } from "../controllers/affiliate.controller.js";
import { MembershipController } from "../controllers/membership.controller.js";

const router = Router();

// Listado de afiliados del usuario autenticado
router.get('', AffiliateController.getAll);

// Crear Afiliado
router.get('/create', AffiliateController.getCreateForm);
router.post('/create', AffiliateController.create);

// Ver, Editar y Eliminar Afiliado
router.get('/:id', AffiliateController.getOne);

router.get('/:id/edit', AffiliateController.getEditForm);
router.post('/:id/edit', AffiliateController.update);

router.get('/:id/delete', AffiliateController.getDeleteForm);
router.post('/:id/delete', AffiliateController.delete);

// Cálculo de beneficios de membresía
router.post('/:id/compute', MembershipController.calculateDiscount);

export default router;