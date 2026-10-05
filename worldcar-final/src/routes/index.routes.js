import { Router } from 'express';
import axios from 'axios';
import { env } from '../config/env.js';
import { branches, vehicles } from '../controllers/home.controller.js';

const apiRouter = Router();

async function forwardAdminRequest(request, response, method, path, data) {
  const authorization = request.get('authorization');
  if (!authorization) {
    return response.status(401).json({ message: 'Se requiere iniciar sesión' });
  }

  try {
    const backendResponse = await axios({
      method,
      url: `${env.backendUrl}/api/users${path}`,
      data,
      headers: { Authorization: authorization },
      timeout: 5000,
    });
    return response.status(backendResponse.status).json(backendResponse.data);
  } catch (error) {
    return response
      .status(error.response?.status || 502)
      .json(error.response?.data || { message: 'No se pudo conectar con el backend.' });
  }
}

apiRouter.get('/health', (request, response) => {
  response.json({
    success: true,
    message: 'WorldCar API funcionando'
  });
});

apiRouter.get('/vehicles', (request, response) => {
  response.json({
    success: true,
    data: vehicles
  });
});

apiRouter.get('/branches', (request, response) => {
  response.json({
    success: true,
    data: branches
  });
});

apiRouter.get('/auth/me', async (request, response) => {
  const authorization = request.get('authorization');
  if (!authorization) {
    return response.status(401).json({ message: 'Se requiere iniciar sesión' });
  }

  try {
    const backendResponse = await axios.get(`${env.backendUrl}/api/auth/me`, {
      headers: { Authorization: authorization },
      timeout: 5000,
    });
    return response.status(backendResponse.status).json(backendResponse.data);
  } catch (error) {
    return response
      .status(error.response?.status || 502)
      .json(error.response?.data || { message: 'No se pudo conectar con el backend.' });
  }
});

apiRouter.get('/users', (request, response) =>
  forwardAdminRequest(request, response, 'get', ''));

apiRouter.get('/users/roles', (request, response) =>
  forwardAdminRequest(request, response, 'get', '/roles'));

apiRouter.post('/users', (request, response) =>
  forwardAdminRequest(request, response, 'post', '', request.body));

apiRouter.put('/users/:id', (request, response) =>
  forwardAdminRequest(
    request,
    response,
    'put',
    `/${encodeURIComponent(request.params.id)}`,
    request.body
  ));

export default apiRouter;
