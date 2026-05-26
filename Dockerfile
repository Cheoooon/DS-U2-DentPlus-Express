# ==========================================
# Etapa 1: BUILDER (Compilación)
# ==========================================
FROM node:24-alpine AS builder

RUN npm install -g pnpm@11

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY tsconfig.json prisma.config.ts ./
COPY src ./src
COPY prisma ./prisma 

RUN pnpm dlx prisma generate

RUN pnpm run build

# ==========================================
# Etapa 2: RUNNER (Producción, imagen ligera)
# ==========================================
FROM node:24-alpine AS runner

RUN npm install -g pnpm@11

WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /app/dist ./dist
COPY views ./views
COPY public ./public

EXPOSE ${PORT}

# Iniciar la aplicación
CMD ["npm", "run", "start"]