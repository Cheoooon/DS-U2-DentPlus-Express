import { Router } from "express";

import { PatientController } from "../controllers/patientController.js"
import { MembershipController } from "../controllers/membershipController.js";

const router = Router();

router.get('/', PatientController.getAllPatients);
router.get('/afiliado/nuevo', PatientController.getCreateForm);
router.post('/afiliado/nuevo', PatientController.createPatient);
router.get('/afiliado/:id', PatientController.getPatient);
router.get('/afiliado/:id/editar', PatientController.getEditForm);
router.post('/afiliado/:id/editar', PatientController.updatePatient);
router.get('/afiliado/:id/eliminar', PatientController.getDeleteForm);
router.post('/afiliado/:id/eliminar', PatientController.deletePatient);

router.post('/afiliado/:id/calcular', MembershipController.calculateDiscount);

export default router;