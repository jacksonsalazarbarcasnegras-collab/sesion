import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

export const ROLE_NAMES = ['Admin', 'Seller', 'Analyst', 'User'];

const moduleFields = ['id', 'name', 'route', 'isActive', 'description', 'subModules'];
const subModuleFields = ['id', 'name', 'route', 'isActive', 'description'];

function validateMenu(menu) {
  if (menu === null) {
    return;
  }

  if (!Array.isArray(menu)) {
    throw new Error('El menú debe ser un arreglo o null');
  }

  const ids = new Set();
  const routes = new Set();

  function validateEntry(entry, fields, path) {
    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`${path} debe ser un objeto`);
    }

    for (const field of Object.keys(entry)) {
      if (!fields.includes(field)) {
        throw new Error(`${path}.${field} no es una propiedad permitida`);
      }
    }

    for (const field of ['id', 'name', 'route']) {
      if (typeof entry[field] !== 'string' || entry[field].trim() === '') {
        throw new Error(`${path}.${field} debe ser un texto no vacío`);
      }
    }

    if (!entry.route.startsWith('/')) {
      throw new Error(`${path}.route debe comenzar con "/"`);
    }

    if (typeof entry.isActive !== 'boolean') {
      throw new Error(`${path}.isActive debe ser booleano`);
    }

    if (entry.description !== undefined && typeof entry.description !== 'string') {
      throw new Error(`${path}.description debe ser texto`);
    }

    if (ids.has(entry.id)) {
      throw new Error(`${path}.id debe ser único`);
    }
    ids.add(entry.id);

    if (routes.has(entry.route)) {
      throw new Error(`${path}.route debe ser única`);
    }
    routes.add(entry.route);
  }

  menu.forEach((entry, index) => {
    const path = `menu[${index}]`;
    validateEntry(entry, moduleFields, path);

    if (entry.subModules !== undefined) {
      if (!Array.isArray(entry.subModules)) {
        throw new Error(`${path}.subModules debe ser un arreglo`);
      }

      entry.subModules.forEach((subModule, subIndex) => {
        validateEntry(subModule, subModuleFields, `${path}.subModules[${subIndex}]`);
      });
    }
  });
}

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isIn: [ROLE_NAMES],
    },
  },
  menu: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: null,
    validate: {
      isValidMenu: validateMenu,
    },
  },
}, {
  tableName: 'role',
  timestamps: false,
});

export default Role;