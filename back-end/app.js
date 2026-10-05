import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import routes from './src/routes/index.js';

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(currentDirectory, '../public')));
app.use('/api', routes);

export default app;