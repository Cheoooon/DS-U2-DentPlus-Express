import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars'
import path from 'path';
import authRoutes, { authGuard } from './routes/auth.routes.js';
import affiliateRoutes from './routes/affiliate.routes.js';


const app = express();

const PORT = process.env.PORT || 3000;

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(process.cwd(), 'views/layouts'),
  helpers: {
    // Aquí registras tu helper para mantener el selector
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'clave_secreta_desarrollo',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.userId;
  res.locals.currentUser = req.session.userName;
  next();
});

// Rutas:
app.use('/', authRoutes);
app.use('/', authGuard, affiliateRoutes);

app.get('/', (_req, res) => {
  res.render('home');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
 