import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { homeController } from '../controllers/home.controller.js';
import apiRouter from '../routes/index.routes.js';
import authRouter from '../routes/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.locals.backendUrl = env.backendUrl;
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
app.use('/api', apiRouter);
app.use('/', authRouter);

app.get('/', (request, response) => response.redirect('/login'));
app.get('/home', homeController);

app.use((error, request, response, next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({
      success: false,
      message: 'La solicitud contiene un JSON inválido o incompleto.'
    });
  }

  next(error);
});

export default app;
