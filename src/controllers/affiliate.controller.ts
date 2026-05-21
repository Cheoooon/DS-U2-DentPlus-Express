import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { AffiliateModel } from '../models/affiliate.model.js';
import { MembershipModel } from '../models/membership.model.js'; // Tu modelo de membresías
import { AffiliateSchema } from '../schemas/affiliate.schema.js';

export const AffiliateController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId!;
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = 10; 

      const { affiliates, total } = await AffiliateModel.getAllPaginated(userId, page, limit);
      const totalPages = Math.ceil(total / limit);

      res.render('affiliates/index', { 
        affiliates,
        pagination: {
          currentPage: page,
          totalPages,
          hasPrevious: page > 1,
          hasNext: page < totalPages,
          previousPage: page - 1,
          nextPage: page + 1,
          totalRecords: total,
          startRecord: (page - 1) * limit + 1,
          endRecord: Math.min(page * limit, total)
        }
      });
    }
    catch (error) {
      console.error('Error en getAll affiliates:', error);
      res.status(500).render('home', { error: 'Error al cargar el listado de afiliados.' });
    }
  },

  // GET /affiliate/create
  getCreateForm: async (req: Request, res: Response) => {
    try {
      const memberships = await MembershipModel.getAll();
      res.render('affiliates/create', { memberships });
    }
    catch {
      res.redirect('/affiliates');
    }
  },

  // POST /affiliate/create
  create: async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId!;
      const validatedData = await AffiliateSchema(userId).parseAsync(req.body);

      await AffiliateModel.create({
        ...validatedData,
        userId
      });

      res.redirect('/affiliates');
    }
    catch (err) {
      const memberships = await MembershipModel.getAll().catch(() => []);
      
      if (err instanceof ZodError) {
        return res.render('affiliates/create', {
          error: err.issues[0].message,
          affiliate: req.body, 
          memberships
        });
      }
      res.status(500).render('affiliates/create', { error: 'Error al guardar el afiliado', memberships });
    }
  },

  // GET /afiliado/:id
  getOne: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const userId = req.session.userId!;

      const affiliate = await AffiliateModel.getById(id, userId);

      if (!affiliate) {
        return res.status(404).render('home', { error: 'El afiliado solicitado no existe o no tienes permisos.' });
      }

      res.render('affiliates/show', { affiliate });
    }
    catch {
      res.redirect('/affiliates');
    }
  },

  // GET /afiliado/:id/editar
  getEditForm: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const userId = req.session.userId!;

      // Resolvemos en paralelo usando ambos modelos independientes
      const [affiliate, memberships] = await Promise.all([
        AffiliateModel.getById(id, userId),
        MembershipModel.getAll()
      ]);

      if (!affiliate) {
        return res.redirect('/affiliates');
      }

      res.render('affiliates/edit', { affiliate, memberships });
    }
    catch {
      res.redirect('/affiliates');
    }
  },

  // POST /afiliado/:id/editar
  update: async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.session.userId!;
    try {
      const validatedData = await AffiliateSchema(userId, id).parseAsync(req.body);
      
      await AffiliateModel.update(id, userId, validatedData);

      res.redirect('/affiliates');
    }
    catch (err) {
      const memberships = await MembershipModel.getAll().catch(() => []);
      
      if (err instanceof ZodError) {
        return res.render('affiliates/edit', {
          error: err.issues[0].message,
          affiliate: { id, ...req.body },
          memberships
        });
      }
      res.status(500).redirect('/affiliates');
    }
  },

  // GET /afiliado/:id/eliminar
  getDeleteForm: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const userId = req.session.userId!;
      
      const affiliate = await AffiliateModel.getById(id, userId);
      if (!affiliate) return res.redirect('/affiliates');

      res.render('affiliates/delete', { affiliate });
    }
    catch {
      res.redirect('/affiliates');
    }
  },

  // POST /afiliado/:id/eliminar
  delete: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const userId = req.session.userId!;

      await AffiliateModel.delete(id, userId);

      res.redirect('/affiliates');
    }
    catch {
      res.status(500).redirect('/affiliates');
    }
  }
};