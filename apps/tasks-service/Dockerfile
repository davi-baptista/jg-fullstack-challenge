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

WORKDIR /app/apps/tasks-service

EXPOSE 3003

CMD ["pnpm", "run", "start:dev"]
