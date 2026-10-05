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

const toPublicUser = (user) => {
  const data = user.toJSON();
  return Object.fromEntries(
    publicUserFields
      .filter((field) => Object.hasOwn(data, field))
      .map((field) => [field, data[field]]),
  );
};

const allowedUserFields = new Set([
  'nombres',
  'apellidos',
  'email',
  'password',
  'phone',
  'role',
  'isActived',
]);

const validateUserPayload = (body, { creating = false } = {}) => {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'El cuerpo de la solicitud debe ser un objeto' };
  }

  const unknownFields = Object.keys(body).filter((field) => !allowedUserFields.has(field));
  if (unknownFields.length > 0) {
    return { error: `Propiedades no permitidas: ${unknownFields.join(', ')}` };
  }

  const data = { ...body };
  const requiredFields = creating
    ? ['nombres', 'apellidos', 'email', 'password', 'role']
    : [];

  for (const field of requiredFields) {
    if (typeof data[field] !== 'string' && typeof data[field] !== 'number') {
      return { error: `El campo ${field} es obligatorio` };
    }
    if (typeof data[field] === 'string' && data[field].trim() === '') {
      return { error: `El campo ${field} es obligatorio` };
    }
  }

  for (const field of ['nombres', 'apellidos', 'email']) {
    if (data[field] !== undefined) {
      if (typeof data[field] !== 'string' || data[field].trim() === '') {
        return { error: `El campo ${field} debe ser un texto no vacío` };
      }
      data[field] = data[field].trim();
    }
  }

  if (data.password !== undefined
    && (typeof data.password !== 'string' || data.password.length < 6)) {
    return { error: 'La contraseña debe tener al menos 6 caracteres' };
  }

  if (data.phone !== undefined && data.phone !== null) {
    if (typeof data.phone !== 'string') {
      return { error: 'El teléfono debe ser texto o null' };
    }
    data.phone = data.phone.trim() || null;
  }

  if (data.role !== undefined) {
    const roleId = typeof data.role === 'string' && /^\d+$/.test(data.role)
      ? Number(data.role)
      : data.role;
    if (!Number.isSafeInteger(roleId) || roleId < 1) {
      return { error: 'El rol debe ser un ID válido' };
    }
    data.role = roleId;
  }

  if (data.isActived !== undefined && typeof data.isActived !== 'boolean') {
    return { error: 'isActived debe ser booleano' };
  }

  return { data };
};

const handleError = (res, error) => {
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
};

export const getUsers = async (_req, res) => {
  try {
    const users = await User.findAll({ attributes: publicUserFields });
    return res.json(users);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getRoles = async (_req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: ['id', 'name'],
      order: [['id', 'ASC']],
    });
    return res.json(roles);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: publicUserFields });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json(user);
  } catch (error) {
    return handleError(res, error);
  }
};

export const createUser = async (req, res) => {
  try {
    const { data, error } = validateUserPayload(req.body, { creating: true });
    if (error) {
      return res.status(400).json({ message: error });
    }

    const role = await Role.findByPk(data.role);
    if (!role) {
      return res.status(400).json({ message: 'El rol seleccionado no existe' });
    }

    const user = await User.create({
      ...data,
      isActived: data.isActived ?? true,
    });
    return res.status(201).json(toPublicUser(user));
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { data, error } = validateUserPayload(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'Debes indicar al menos un campo para actualizar' });
    }

    if (data.role !== undefined) {
      const role = await Role.findByPk(data.role);
      if (!role) {
        return res.status(400).json({ message: 'El rol seleccionado no existe' });
      }
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.update(data);
    return res.json(toPublicUser(user));
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.destroy();
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error);
  }
};