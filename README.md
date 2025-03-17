# Repositorio para el desarrollo de la lógica de negocio de TaskMate
TaskMate es una aplicación para la gestión de tareas y proyectos, que permite a los usuarios crear, gestionar y colaborar en proyectos de manera eficiente.

## Comandos necesarios:

### Para instalar las librerias del Repositorio:

```
npm i
```
### Para envios de token

```
Token enviado por .env y VerifyToken
```
### Para inicializar el Servidor:

```
npm run dev
```

## Variables de entorno:

1.  Crea un archivo .env en la raiz del Repositorio

2.  Agrega las siguientes variables:
```
MONGO_URI=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
JWT_KEY=
```
 
## Resumen del Repositorio

### User:

- [x] Crea nuevos Users
- [x] Confirma las cuentas de los Users
- [x] Login
- [x] Solicita un nuevo Token de confirmación
- [x] Solicita un nuevo Token de cambio de Password
- [x] Cambia el Password si el Token es válido 
- [x] Confirma la cuenta si el Token es válido

### Project:

- [x] Crea nuevos Proyectos
- [x] Obtiene los Proyectos
- [x] Obtiene un Proyecto por su ID
- [x] Actualizan los Proyectos
- [x] Elimina los Proyectos
- [x] Recupera los Proyectos

### Task:

- [x] Crea nuevas Tareas
- [x] Obtiene las Tareas
- [x] Obtiene una Tarea por su ID
- [x] Actualizan las Tareas
- [x] Elimina las Tareas

### Member:

- [x] Encuentra un Usuario por Email
- [x] Agrega un Usuario al proyecto por su ID
- [x] Elimina un Usuario al proyecto por su ID
- [x] Obtiene los Miembros de un Proyecto
