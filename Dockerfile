# Multi-stage build para a aplicação Dental Platform Dashboard

# Stage 1: Build do Frontend (React + Vite)
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Build do Backend e imagem final
FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema para Puppeteer
RUN apk add --no-cache \
    chromium \
    ca-certificates \
    fontconfig \
    freetype \
    harfbuzz \
    noto-fonts \
    ttf-liberation

# Copiar dependências do frontend (construído)
COPY --from=frontend-build /app/dist ./public/dist

# Copiar backend
COPY legacy-backend ./legacy-backend

# Copiar package.json da raiz
COPY package*.json ./

# Instalar dependências do backend
WORKDIR /app/legacy-backend
RUN npm install

# Definir variáveis de ambiente
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Expor porta do backend
EXPOSE 3000

# Comando para iniciar o backend
CMD ["node", "server.js"]
