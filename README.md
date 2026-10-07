# eGlobal - Prueba Técnica

Aplicación web desarrollada como parte de la prueba técnica para la gestión de operaciones financieras.

La aplicación permite autenticar usuarios mediante credenciales, identificar su rol a partir de un JWT y mostrar las funcionalidades correspondientes a cada perfil.

## Descripción

La solución está desarrollada con Angular y utiliza Mockoon como API simulada para las operaciones HTTP.

El flujo principal de la aplicación es:

1. El usuario ingresa sus credenciales.
2. Angular valida las credenciales configuradas para la prueba.
3. Se realiza la petición de login a la API simulada.
4. Mockoon devuelve un JWT.
5. El JWT se almacena en `localStorage`.
6. Angular obtiene el rol del usuario desde el JWT.
7. Dependiendo del rol, se redirige al usuario a la pantalla correspondiente.
8. Las rutas están protegidas mediante guards para evitar accesos no autorizados.

## Roles

La aplicación contempla dos perfiles:

### Operador

Tiene acceso a:

- Registro de ventas.
- Consulta de operaciones.
- Visualización de las operaciones registradas.
