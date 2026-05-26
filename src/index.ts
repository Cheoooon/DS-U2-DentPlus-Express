import express from 'express';
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { engine } from 'express-handlebars'
import path from 'path';
import authRoutes, { authGuard } from './routes/auth.routes.js';
import affiliateRoutes from './routes/affiliate.routes.js';
import { prisma } from './lib/prisma.js';

const app = express();

// Views
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(process.cwd(), 'views/layouts'), 
  helpers: {
    eq: function (a: unknown, b: unknown) {
      return a === b;
    },
    'or': function (a: unknown, b: unknown) {
      return a || b;
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(process.cwd(), 'views'));
app.use(express.static('public'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.SESSION_SECRET || 'session_secret_default',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma, 
      {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    ),
  })
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.userId;
  res.locals.currentUser = req.session.userName;
  next();
});

// Rutas:
app.use('/', authRoutes);
app.use('/affiliates', authGuard, affiliateRoutes);

app.get('/', (_req, res) => {
  res.render('home');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
 