# DentPlus Express - Sistema de Membresías

Este proyecto es una aplicación Express con TypeScript, Prisma y HBS, diseñada para ejecutarse de forma sencilla y automatizada utilizando Docker.

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

## Desarrollo local (solo levantar postgresql)
Solo levantar postgress y desarrollo local:

Es necesario indicar el puerto en docker-compose.yml para exponer localmente postgresql:
```
    ports:
      - "5432:5432"
```

Levantar postgresql:
> docker compose up postgres-db (con -d para que se ejecute en segundo plano)

Iniciar proyecto
> pnpm run dev

---

## ⚙️ Requisitos
*   Docker y Docker Compose.
*   Node.js 24+ (solo si deseas ejecutarlo localmente sin Docker).
