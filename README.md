# DentPlus Express - Sistema de Membresías

Este proyecto es una aplicación Express con TypeScript, Prisma y EJS, diseñada para ejecutarse de forma sencilla y automatizada utilizando Docker.

## 🚀 Inicio Rápido con Docker

La forma más fácil de levantar el proyecto es usando Docker Compose.

1.  **Configurar variables de entorno**:
    Copia el archivo de ejemplo y ajusta según necesites:
    ```bash
    cp .env.example .env
    ```

2.  **Levantar el proyecto**:
    ```bash
    docker compose up --build
    ```

La aplicación estará disponible en `http://localhost:3000` (o el puerto que definas en el `.env`).

---

## 🌍 Entornos (NODE_ENV)

Puedes cambiar el comportamiento de la aplicación modificando la variable `NODE_ENV` en tu archivo `.env`:

### 🛠 Modo Desarrollo (`NODE_ENV=development`)
*   **Auto-recarga**: Utiliza `tsx --watch` para que cualquier cambio que hagas en el código se refleje instantáneamente sin reiniciar el contenedor.
*   **Base de Datos**: Sincroniza el esquema automáticamente con `prisma db push`.
*   **Seeds**: Ejecuta el seed para poblar datos iniciales.

### 📦 Modo Producción (`NODE_ENV=production`)
*   **Compilación**: El contenedor compila el código TypeScript a JavaScript (`npm run build`) al iniciar.
*   **Rendimiento**: Ejecuta la versión optimizada desde la carpeta `dist`.
*   **Base de Datos**: Aplica migraciones de forma segura con `prisma migrate deploy`.

---

## 📂 Estructura de Volúmenes y Persistencia

El proyecto está configurado para que puedas editar el código desde tu máquina local y los cambios se sincronicen con el contenedor.

*   **Código Fuente**: Sincronizado mediante un bind-mount (`./:/app`).
*   **Base de Datos**: Los datos persisten en `prisma/data/dev.db`.
*   **Dependencias**: Se instalan automáticamente dentro del contenedor al arrancar para asegurar compatibilidad.

---

## 🛠 Comandos de Prisma (Manual)

Si necesitas ejecutar comandos de Prisma manualmente dentro del contenedor:

```bash
# Entrar al contenedor
docker exec -it node_prisma_app sh

# Ejecutar comandos
npx prisma studio
npx prisma migrate dev --name descripcion
```

---

## ⚙️ Requisitos
*   Docker y Docker Compose.
*   Node.js 24+ (solo si deseas ejecutarlo localmente sin Docker).
