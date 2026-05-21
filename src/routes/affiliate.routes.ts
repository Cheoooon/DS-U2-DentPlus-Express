import { Router } from "express";
import { AffiliateController } from "../controllers/affiliate.controller.js";
import { MembershipController } from "../controllers/membership.controller.js";

const router = Router();

// Listado de afiliados del usuario autenticado
router.get('/affiliates', AffiliateController.getAll);

// Crear Afiliado
router.get('/affiliates/create', AffiliateController.getCreateForm);
router.post('/affiliates/create', AffiliateController.create);

// Ver, Editar y Eliminar Afiliado
router.get('/affiliates/:id', AffiliateController.getOne);

router.get('/affiliates/:id/edit', AffiliateController.getEditForm);
router.post('/affiliates/:id/edit', AffiliateController.update);

router.get('/affiliates/:id/delete', AffiliateController.getDeleteForm);
router.post('/affiliates/:id/delete', AffiliateController.delete);

// Cálculo de beneficios de membresía
router.post('/affiliates/:id/compute', MembershipController.calculateDiscount);

export default router;