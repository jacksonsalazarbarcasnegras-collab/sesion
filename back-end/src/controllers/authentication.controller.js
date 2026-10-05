import jwt from 'jsonwebtoken';

import { Role, User } from '../models/index.js';

const publicUserFields = [
  'id',
  'nombres',
  'apellidos',
  'email',
  'phone',
  'role',
  'isActived',
  'createdAt',
  'updatedAt',
];

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'El email y la contraseña son obligatorios',
    });
  }

  try {
    const user = await User.findOne({
      where: { email },
      include: [{
        model: Role,
        as: 'roleDetails',
        attributes: ['id', 'name', 'menu'],
      }],
    });

    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({
        message: 'Email o contraseña incorrectos',
      });
    }

    if (!user.isActived) {
      return res.status(403).json({
        message: 'El usuario está inactivo',
      });
    }

    const publicUser = Object.fromEntries(
      publicUserFields.map((field) => [field, user[field]]),
    );
    publicUser.roleDetails = user.roleDetails;
    const token = jwt.sign(
      {
        sub: String(user.id),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      tokenType: 'Bearer',
      user: publicUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.authUser.id, {
      include: [{
        model: Role,
        as: 'roleDetails',
        attributes: ['id', 'name', 'menu'],
      }],
    });

    if (!user || !user.isActived) {
      return res.status(401).json({ message: 'La sesión no es válida' });
    }

    const publicUser = Object.fromEntries(
      publicUserFields.map((field) => [field, user[field]]),
    );
    publicUser.roleDetails = user.roleDetails;

    return res.json({ user: publicUser });
  } catch (error) {
    console.error('No se pudo cargar el usuario autenticado:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const register = async (req, res) => {
  const { nombres, apellidos, email, password, phone } = req.body ?? {};
  const requiredValues = [nombres, apellidos, email, password];

  if (requiredValues.some((value) => typeof value !== 'string' || value.trim() === '')) {
    return res.status(400).json({
      message: 'Nombres, apellidos, email y contraseña son obligatorios',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'La contraseña debe tener al menos 6 caracteres',
    });
  }

  try {
    const user = await User.create({
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      email: email.trim(),
      password,
      phone: typeof phone === 'string' && phone.trim() ? phone.trim() : null,
      role: 4,
      isActived: true,
    });

    const publicUser = Object.fromEntries(
      publicUserFields.map((field) => [field, user[field]]),
    );

    return res.status(201).json({
      message: 'Usuario creado correctamente',
      user: publicUser,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Los datos del usuario no son válidos',
        errors: error.errors.map(({ message, path }) => ({ message, path })),
      });
    }

    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};