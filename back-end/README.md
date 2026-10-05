# WorldCar Final Backend

## Requisitos

- Node.js instalado.
- PostgreSQL ejecutándose en el equipo.
- Una base de datos llamada `worldcarfinal`.

## Inicialización

1. Abre una terminal en la carpeta `Backend`.
2. Instala las dependencias:

```bash
npm install
```

3. Revisa el archivo `.env` y confirma estos valores:

```env
PORT=5000
DB_DIALECT=postgres
DB_NAME=worldcarfinal
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_DE_POSTGRES
JWT_SECRET=CAMBIA_ESTE_SECRETO
```

No compartas el `.env` ni subas sus credenciales al repositorio.

4. Crea la base de datos si todavía no existe:

```sql
CREATE DATABASE worldcarfinal;
```

5. Inicia el backend en desarrollo:

```bash
npm run dev
```

Para ejecutarlo sin recarga automática:

```bash
npm start
```

El backend quedará disponible en el puerto configurado en `PORT` (por defecto, `http://localhost:4000`). Inicia primero el backend y después el frontend (`npm run dev` desde la carpeta `Frontend`).

## Registro de usuarios

`POST /api/auth/register` es público y no requiere token. Recibe `nombres`,
`apellidos`, `email`, `password` y, opcionalmente, `phone`. El backend asigna
el rol User (ID `4`) y activa la cuenta; el cliente no puede elegir el rol
ni el estado de la cuenta.

Un administrador puede crear usuarios y cambiar sus roles desde el panel de
administración. Esas operaciones requieren un token de Admin.

## Autorización de la API

El inicio de sesión (`POST /api/auth/login`) es público. Las rutas de usuarios
(`GET`, `POST`, `PUT` y `DELETE /api/users`) requieren un token Bearer y están
limitadas al rol Admin (ID `1`):

```http
Authorization: Bearer <token>
```

La API valida la firma y expiración del token y consulta el estado y rol actuales
del usuario en la base de datos en cada petición. Una sesión sin token válido
recibe `401`; un usuario autenticado sin el rol requerido recibe `403`.

La autorización cubre únicamente las rutas que existen actualmente. Los menús
de Inventario y sus permisos de lectura/escritura no están implementados como
endpoints en este backend y requieren políticas específicas cuando se agreguen.

### Administración de cuentas y roles

Un Admin puede consultar los roles disponibles con `GET /api/users/roles`,
crear una cuenta con `POST /api/users` y asignar o cambiar el rol con
`PUT /api/users/:id`. Estas rutas requieren el Bearer token del Admin.

La creación requiere `nombres`, `apellidos`, `email`, `password` (mínimo 6
caracteres) y `role` (ID de un rol existente). `phone` es opcional; las cuentas
quedan activas por defecto. El rol y los campos recibidos se validan antes de
guardar. El registro público (`POST /api/auth/register`) sigue asignando siempre
el rol Analyst (ID `3`).

Ejemplo de cuerpo para `POST /api/users`:

```json
{
  "nombres": "Ana",
  "apellidos": "Pérez",
  "email": "ana@example.com",
  "password": "cambiar-esta-clave",
  "phone": null,
  "role": 2
}
```

#### Crear la primera cuenta Admin

La primera cuenta Admin debe aprovisionarse localmente, no mediante el registro
público. Ejecuta `npm run bootstrap:admin` desde una terminal interactiva. El
comando solicita nombre, apellidos, email y contraseña (oculta durante la
entrada), confirma la contraseña y crea un Admin solo si todavía no existe uno
activo. La contraseña se guarda mediante el hash del modelo `User`.

El frontend solicita `GET /api/auth/me` con el token Bearer para obtener el
perfil, el rol y su menú JSONB actualizado. La interfaz usa ese menú para
representar los módulos permitidos; la autorización real sigue aplicándose en
las rutas protegidas de la API.