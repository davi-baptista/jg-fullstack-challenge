FROM node:22-slim AS development

WORKDIR /app

# Ativa pnpm
RUN corepack enable

# Copia arquivos do workspace
COPY package.json pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps ./apps

# Instala dependências
RUN pnpm install

WORKDIR /app/apps/api-gateway

EXPOSE 3001

CMD ["pnpm", "run", "start:dev"]
