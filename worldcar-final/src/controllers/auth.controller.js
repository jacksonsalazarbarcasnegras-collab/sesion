import axios from 'axios';
import { env } from '../config/env.js';

const backendApiUrl = `${env.backendUrl}/api`;

export function loginViewController(request, response) {
  response.render('login');
}

export async function registerController(request, response) {
  const payload = request.body;

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return response.status(400).json({
      success: false,
      message: 'Faltan los datos de registro.'
    });
  }

  const requiredFields = ['email', 'password'];
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    return response.status(400).json({
      success: false,
      message: 'Faltan campos obligatorios: ' + missingFields.join(', ')
    });
  }

  try {
    const backendResponse = await axios.post(`${backendApiUrl}/auth/register`, payload);
    response.status(backendResponse.status).json(backendResponse.data);
  } catch (error) {
    const status = error.response?.status || 502;
    const data = error.response?.data || { message: 'No se pudo conectar con el backend.' };
    response.status(status).json(data);
  }
}

export async function loginController(request, response) {
  const payload = request.body;

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return response.status(400).json({
      success: false,
      message: 'Faltan los datos de inicio de sesión.'
    });
  }

  const requiredFields = ['email', 'password'];
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    return response.status(400).json({
      success: false,
      message: 'Faltan campos obligatorios: ' + missingFields.join(', ')
    });
  }

  try {
    const backendResponse = await axios.post(`${backendApiUrl}/auth/login`, payload);
    response.status(backendResponse.status).json(backendResponse.data);
  } catch (error) {
    const status = error.response?.status || 502;
    const data = error.response?.data || { message: 'No se pudo conectar con el backend.' };
    response.status(status).json(data);
  }
}
