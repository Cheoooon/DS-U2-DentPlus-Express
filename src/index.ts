import express from "express";
import path from 'path';
import mainRoutes from './routes/index.js'

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rutas:
app.use('/', mainRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
 