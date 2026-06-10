# 🦷 DentPlus Express

**Sistema de Gestión de Membresías** desarrollado con **Express**, **TypeScript**, **Prisma** y **Handlebars (HBS)**. Diseñado para una implementación rápida y eficiente mediante contenedores Docker.

---

## 🚀 Inicio Rápido

La manera más sencilla de ejecutar el proyecto es utilizando **Docker Compose**.

### 1. Configuración inicial
Copia el archivo de variables de entorno y ajusta los valores necesarios:

    cp .env.example .env

### 2. Ejecutar la aplicación
Levanta el servicio completo con el siguiente comando:

    docker compose up --build

> 🌐 La aplicación estará disponible en `http://localhost:3000` (o el puerto definido en tu archivo `.env`).

---

## 🛠 Desarrollo Local

Si prefieres trabajar en entorno local (ejecutando Node.js directamente), sigue estos pasos:

### Configuración de Base de Datos
Asegúrate de exponer el puerto localmente de PostgreSQL en tu `docker-compose.yml`:

    services:
      postgres-db:
        ports:
          - "5432:5432"

También de corregir en tu .env la variable de entorno correcta.
Luego, inicia la base de datos en segundo plano:

    docker compose up postgres-db 
(con -d para que se ejecute en segundo plano)

### Preparación del entorno
Instala las dependencias y prepara el ORM:

| Acción | Comando |
| :--- | :--- |
| **Instalar dependencias** | pnpm install |
| **Generar cliente Prisma** | pnpm prisma generate |
| **Ejecutar migraciones** | pnpm prisma migrate deploy |
| **Ejecutar seeders** | pnpm prisma db seed |

### Iniciar el servidor

    pnpm run dev

---

## 📋 Requisitos Previos

Para ejecutar este proyecto, asegúrate de tener instalado:

* **Docker** y **Docker Compose**
* **Node.js v24+**
* **pnpm**

---

## 🛠 Tecnologías Utilizadas

* [Express.js](https://expressjs.com/)
* [TypeScript](https://www.typescriptlang.org/)
* [Prisma](https://www.prisma.io/)
* [Handlebars](https://handlebarsjs.com/)
* [PostgreSQL](https://www.postgresql.org/)
