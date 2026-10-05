import 'dotenv/config';

import readline from 'node:readline';
import { createInterface } from 'node:readline/promises';

import { Role, User, sequelize } from '../src/models/index.js';

function askHidden(label) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    throw new Error('Ejecuta este comando en una terminal interactiva');
  }

  return new Promise((resolve, reject) => {
    readline.emitKeypressEvents(process.stdin);
    process.stdout.write(label);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    let value = '';

    const cleanup = () => {
      process.stdin.off('keypress', onKeypress);
      process.stdin.setRawMode(false);
      process.stdout.write('\n');
    };

    const onKeypress = (character, key = {}) => {
      if (key.ctrl && key.name === 'c') {
        cleanup();
        reject(new Error('Operación cancelada'));
        return;
      }

      if (key.name === 'return' || key.name === 'enter') {
        cleanup();
        resolve(value);
        return;
      }

      if (key.name === 'backspace') {
        value = Array.from(value).slice(0, -1).join('');
      } else if (character && !key.ctrl && !key.meta) {
        value += character;
      }
    };

    process.stdin.on('keypress', onKeypress);
  });
}

async function bootstrapAdmin() {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    throw new Error('Ejecuta este comando en una terminal interactiva');
  }

  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const nombres = (await prompt.question('Nombres: ')).trim();
    const apellidos = (await prompt.question('Apellidos: ')).trim();
    const email = (await prompt.question('Email: ')).trim();
    prompt.close();

    if (!nombres || !apellidos || !email) {
      throw new Error('Nombres, apellidos y email son obligatorios');
    }

    const password = await askHidden('Contraseña (mínimo 12 caracteres): ');
    const confirmation = await askHidden('Confirma la contraseña: ');

    if (password.length < 12) {
      throw new Error('La contraseña debe tener al menos 12 caracteres');
    }
    if (password !== confirmation) {
      throw new Error('Las contraseñas no coinciden');
    }

    await sequelize.authenticate();

    const adminRole = await Role.findByPk(1);
    if (!adminRole || adminRole.name !== 'Admin') {
      throw new Error('No se encontró el rol Admin con ID 1');
    }

    const activeAdminCount = await User.count({
      where: { role: adminRole.id, isActived: true },
    });
    if (activeAdminCount > 0) {
      throw new Error('Ya existe una cuenta Admin activa; no se creó otra');
    }

    const user = await User.create({
      nombres,
      apellidos,
      email,
      password,
      role: adminRole.id,
      isActived: true,
    });

    console.log(`Cuenta Admin creada correctamente (ID ${user.id}).`);
  } finally {
    prompt.close();
  }
}

try {
  await bootstrapAdmin();
} catch (error) {
  console.error('No se pudo crear la cuenta Admin:', error.message);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
