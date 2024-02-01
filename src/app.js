import express from 'express';
import session from 'express-session';
import passport from 'passport';
import connectDB from './dao/dbManager.js';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import authRouter from './routes/authRouter.js'; 
import __dirname from './utils.js';
import dotenv from 'dotenv';
import handlebars from 'express-handlebars';
import path from 'path';
import { checkRole } from '../src/routes/authRouter.js';
import { configurePassport } from './config/passportConfig.js';

// Configuración de variables de entorno
dotenv.config();

// Creación del servidor
const app = express();

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura sesiones y estrategia de autenticación local
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize()); 
app.use(passport.session()); 

// Configuración de passport
configurePassport();

// Carpeta pública
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/auth', authRouter);


// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Vista principal
app.get('/', (req, res) => {
  res.render('home');
});

// Vista para el chat
app.get('/chat', (req, res) => {
  res.render('chat');
});

// Middleware para proteger rutas que solo los administradores pueden acceder
app.get('/admin', checkRole('admin'), (req, res) => {
  res.render('adminPanel'); 
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Conexión a la base de datos
connectDB();

export default app;
