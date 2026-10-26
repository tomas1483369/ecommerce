# 0004. Autenticación propia, sin Clerk
Estado: Aceptada (2026-10-25). El usuario delegó la elección de la librería: Better Auth.

## Contexto
Clerk es un servicio externo con SDK en frontend y backend y un webhook para sincronizar usuarios. El usuario quiere una autenticación que no dependa de una API de terceros.

## Decisión
Usar **Better Auth**: librería open source que corre dentro de nuestro Express y guarda usuarios y sesiones en nuestro PostgreSQL con su adaptador de Drizzle. No es un servicio externo: no hay cuenta, cuota ni llamadas a terceros.

- Email + contraseña (hash incluido), sesiones en BD con cookie httpOnly, `SameSite=Lax`, `Secure` en producción.
- El rol (`customer` / `support` / `admin`) se mantiene en nuestra tabla `users`.
- Límite de intentos de inicio de sesión incluido en la librería.
- Recuperación de contraseña por email: queda para después (requiere un proveedor de correo).

## Alternativas
- **Código propio** (argon2 + tabla `sessions` + cookie): cero dependencias nuevas y control total, pero más código de seguridad que mantener y probar (expiración, rotación, rate limit, CSRF). Válida si el usuario prefiere no depender de ninguna librería.
- JWT sin estado: no permite revocar sesiones sin una lista negra; no aporta nada en un monolito con BD.
- Auth0 / Supabase Auth / Firebase: servicios externos, justo lo que se quiere evitar.

## Consecuencias
- Se eliminan `@clerk/*`, `webhooks/clerk.ts`, `middleware/sentryClerkUser.ts`, la columna `clerk_user_id` y las variables `CLERK_*`.
- Los usuarios actuales de Clerk no se migran (proyecto aún sin clientes reales).
