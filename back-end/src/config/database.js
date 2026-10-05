import 'dotenv/config';

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'postgres',
  database: process.env.DB_NAME || 'worldcar-final',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  logging: false,
});

export default sequelize;