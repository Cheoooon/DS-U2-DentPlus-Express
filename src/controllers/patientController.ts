import { Request, Response } from "express";

import { PatientModel } from "../models/patientModel.js";
import { MembershipModel } from "../models/membershipModel.js";

export const PatientController = {

  // 1. READ: Listar con paginación
  getAllPatients: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 10;
      
      const { patients, total } = await PatientModel.getAllPaginated(page, limit);
      const totalPages = Math.ceil(total / limit);

      res.render('index', { patients, page, totalPages });
    } 
    catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los pacientes');
    }
  },

  // 2. Formulario CREAR
  getCreateForm: async (req: Request, res: Response) => {
    try {
      const memberships = await MembershipModel.getAll();
      res.render('afiliado/nuevo', { memberships });
    }
    catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar formulario');
    }
  },

  // 3. POST: Guardar afiliado
  createPatient: async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, membershipId } = req.body;
      const newPatient = await PatientModel.create({ firstName, lastName, email, membershipId });
      res.redirect(`/afiliado/${newPatient.id}`);
    } 
    catch (error) {
      console.error(error);
      res.status(500).send('Error al crear el afiliado');
    }
  },

  // 4. READ ONE: Ficha del afiliado
  getPatient: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const patient = await PatientModel.getById(id);
      if (!patient) return res.status(404).send('Afiliado no encontrado');
      res.render('afiliado/ficha', { patient });
    } 
    catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar la ficha');
    }
  },

  // 5. Formulario EDITAR
  getEditForm: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const patient = await PatientModel.getById(id);
      const memberships = await MembershipModel.getAll();
      
      if (!patient) return res.status(404).send('Afiliado no encontrado');
      res.render('afiliado/editar', { patient, memberships });
    } 
    catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar edición');
    }
  },

  // 6. POST: Actualizar afiliado
  updatePatient: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const { firstName, lastName, email, membershipId } = req.body;
      await PatientModel.update(id, { firstName, lastName, email, membershipId });
      res.redirect(`/afiliado/${id}`);
    } 
    catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar');
    }
  },

  // 7. Formulario ELIMINAR
  getDeleteForm: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const patient = await PatientModel.getById(id);
      if (!patient) return res.status(404).send('Afiliado no encontrado');
      res.render('afiliado/eliminar', { patient });
    } 
    catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar eliminación');
    }
  },

  // 8. POST: Confirmar eliminación
  deletePatient: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      await PatientModel.delete(id);
      res.redirect('/');
    }
    catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar');
    }
  }

};