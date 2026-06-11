# ==========================================
# BUILDER (Compilación y Entorno de Desarrollo/Migraciones)
# ==========================================
FROM node:24-alpine AS builder

RUN npm install -g pnpm@11
WORKDIR /app

# Copiamos todos los archivos de configuración
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Generar cliente de Prisma
COPY prisma ./prisma 
RUN pnpm prisma generate

# Copiar código fuente y compilar
COPY tsconfig.json prisma.config.ts ./
COPY src ./src
RUN pnpm run build

# ==========================================
# Producción: paso 1 CLEANER (Etapa intermedia solo para limpiar dependencias de desarollo [Elimina devDependencies])
# ==========================================
FROM builder AS cleaner 
RUN pnpm prune --prod --ignore-scripts

# ==========================================
# Producción: paso 2 RUNNER (Imagen final de producción ligera)
# ==========================================
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Traemos los archivos listos desde las etapas anteriores sin instalar nada nuevo
COPY --from=cleaner /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Recursos estáticos locales
COPY views ./views
COPY public ./public

EXPOSE ${PORT}

# Iniciar la aplicación usando el npm nativo de la imagen node
CMD ["npm", "run", "start"]