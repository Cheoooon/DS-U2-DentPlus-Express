FROM node:24-slim

# Instalar dependencias del sistema necesarias para Prisma y módulos nativos
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./
