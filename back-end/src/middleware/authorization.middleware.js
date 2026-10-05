import jwt from 'jsonwebtoken';

import User from '../models/User.js';

export async function authenticate(req, res, next) {
  const authorization = req.get('authorization');
  const [scheme, token, extra] = authorization?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token || extra) {
    return res.status(401).json({ message: 'Se requiere un token Bearer válido' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET no está configurado');
    return res.status(500).json({ message: 'Error de configuración del servidor' });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }

  const userId = Number(payload.sub);
  if (!Number.isSafeInteger(userId) || userId < 1) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'role', 'isActived'],
    });

    if (!user || !user.isActived) {
      return res.status(401).json({ message: 'La sesión no es válida' });
    }

    req.authUser = {
      id: user.id,
      role: user.role,
    };
    return next();
  } catch (error) {
    console.error('No se pudo validar la sesión:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.authUser) {
      return res.status(401).json({ message: 'Se requiere autenticación' });
    }

    if (!allowedRoles.includes(req.authUser.role)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }

    return next();
  };
}
