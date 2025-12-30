FROM node:22-alpine as development

WORKDIR /app

COPY apps/web/package.json apps/web/pnpm-lock.yaml* ./

RUN npm install -g pnpm && pnpm install

COPY apps/web/ .

CMD ["pnpm", "run", "dev"]