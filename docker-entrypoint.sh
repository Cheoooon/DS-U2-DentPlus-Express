#!/bin/sh
set -e

echo "📦 Instalando dependencias (incluyendo dev) para compilación..."
npm install --include=dev

echo "--- Entorno: ${NODE_ENV:-development} ---"

echo "🌱 Generando cliente de prisma..."
npx prisma generate

TABLE_COUNT=$(npx prisma db pull --print 2>/dev/null | grep -c "model " || true)

if [ "$NODE_ENV" = "production" ]; then
    echo "--- Configurando base de datos (Producción) ---"

    if [ "$TABLE_COUNT" -eq 0 ]; then
        echo "🌱 Base de datos no detectada o vacía. Inicializando..."
        npx prisma migrate deploy
        
    else
        echo "✅ Base de datos detectada. Aplicando migraciones pendientes..."
        npx prisma migrate deploy
    fi
    
    echo "🌱 Sembrando la base de datos..."
    npx prisma db seed
    
    echo "--- Compilando aplicación ---"
    npm run build
    
    echo "--- Iniciando aplicación en modo PRODUCCIÓN ---"
    npm run start

else
    echo "--- Configurando base de datos (Desarrollo) ---"
    
    if [ "$TABLE_COUNT" -eq 0 ]; then
        echo "🌱 Inicializando base de datos de desarrollo y ejecutando seed..."
        npx prisma migrate dev --name init
    else
        echo "🔄 Sincronizando esquema de desarrollo..."
        npx prisma db push
    fi

    echo "🌱 Sembrando la base de datos..."
    npx prisma db seed
    
    echo "--- Iniciando aplicación en modo DESARROLLO ---"
    exec npm run dev
fi