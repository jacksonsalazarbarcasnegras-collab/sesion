import { env } from './src/config/env.js';
import app from './src/services/app.js';

const port = env.port;

app.listen(port, () => {
  console.log(`WorldCar disponible en http://localhost:${port}`);
});
