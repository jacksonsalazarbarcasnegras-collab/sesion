import 'dotenv/config';

import app from './app.js';
import sequelize from './src/config/database.js';
import Role from './src/models/Role.js';

const port = Number(process.env.PORT) || 4000;

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await Role.bulkCreate([
      { id: 1, name: 'Admin', menu: null },
      { id: 2, name: 'Seller', menu: null },
      { id: 3, name: 'Analyst', menu: null },
      { id: 4, name: 'User', menu: null },
    ], { ignoreDuplicates: true });

    app.listen(port, () => {
      console.log(`API ejecutándose en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la API:', error.message);
    process.exit(1);
  }
}

startServer();
