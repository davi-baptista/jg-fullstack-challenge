# 🧩 Jungle Gaming — Sistema de Gestão de Tarefas Colaborativo

Desafio Full-stack Júnior — Sistema de Gestão de Tarefas Colaborativo

Este projeto foi desenvolvido como parte do processo seletivo para a vaga de **Full-stack Developer Júnior** na Jungle Gaming.  
O objetivo é demonstrar capacidade de estruturar um **monorepo**, modelar um domínio simples, construir uma **UI funcional** e integrar serviços usando **mensageria e WebSocket**.

---

## 🏗️ Arquitetura

### Visão Geral (ASCII)

<img width="463" height="479" alt="image" src="https://github.com/user-attachments/assets/29a0916b-a4b4-4e11-bf83-33d97390a356" />

---

## 📦 Monorepo

O projeto utiliza **monorepo com pnpm workspaces** e **Turborepo**, conforme esperado no desafio.

```
apps/
├── web/
├── api-gateway/
├── auth-service/
├── tasks-service/
└── notifications-service/

packages/
├── types/
├── utils/
├── eslint-config/
└── tsconfig/
```

---

## 🛠️ Stack Utilizada

### Frontend
- React.js
- TanStack Router
- TanStack Query
- Zustand (auth)
- react-hook-form + zod
- shadcn/ui
- Tailwind CSS
- Socket.IO client
- Vite

### Backend
- NestJS
- TypeORM + PostgreSQL
- RabbitMQ (microservices)
- JWT (access + refresh)
- WebSocket (Socket.IO)
- Swagger/OpenAPI
- class-validator / class-transformer
- Rate limiting no API Gateway

### Infra
- Docker
- docker-compose
- pnpm workspaces
- Turborepo

---

## ⚠️ Importante — Gerenciador de Pacotes

Este projeto **exige o uso de pnpm**, pois utiliza **workspaces**.

Não utilize npm ou yarn.

Instalação do pnpm (caso necessário):

```
npm install -g pnpm
```

---

## 🚀 Como Rodar o Projeto

### 1️⃣ Copiar .env.example para .env em cada microserviço

```
cp apps/web/.env.example apps/web/.env
```
```
cp apps/api-gateway/.env.example apps/api-gateway/.env
```
```
cp apps/auth-service/.env.example apps/auth-service/.env
```
```
cp apps/tasks-service/.env.example apps/tasks-service/.env
```
```
cp apps/notifications-service/.env.example apps/notifications-service/.env
```

### 2️⃣ Subir infraestrutura

```
docker-compose up -d
```

Frontend disponível em:
```
http://localhost:3000
```


Swagger do Gateway:
```
http://localhost:3001/api/docs
```

---

## 🔐 Autenticação

- Cadastro e login via API Gateway
- JWT access token (15 min)
- JWT refresh token (7 dias) via cookie httpOnly
- Refresh automático no frontend
- Rotas protegidas via guards

O frontend extrai o `userId` diretamente do JWT (`sub`), garantindo consistência com o backend.

---

## 📄 Funcionalidades Implementadas

### Autenticação
- Login
- Register
- Logout
- Refresh automático

### Tasks
- Criar task
- Listar tasks (paginação)
- Detalhe da task
- Atualizar status, prioridade e assignees
- Deletar task
- Histórico de alterações (audit log simplificado)

### Comentários
- Criar comentário
- Listar comentários por task
- Atualização em tempo real

### Notificações em Tempo Real
Eventos disparados via RabbitMQ e entregues por WebSocket:
- TASK_CREATED
- TASK_UPDATED
- TASK_DELETED
- TASK_COMMENT_CREATED

> O backend não envia notificações para o usuário que originou a ação, apenas para os demais assignees.

---

## 🎨 UI / UX

- Mínimo de 5 componentes do shadcn/ui
- Tailwind CSS para layout
- Skeleton loaders (shimmer effect)
- Toast notifications
- Estados de loading e erro
- UI simples, limpa e responsiva

---

## 📌 Decisões Técnicas e Trade-offs

### Ausência de Rotas Públicas de Usuários
O desafio não exige explicitamente um endpoint de listagem de usuários (`/users`).

Decisão:
- Não expor `/api/users`
- Evitar acoplamento direto entre serviços
- Manter o auth-service responsável pelo domínio de usuários

### Assignees na Criação da Task
- Ao criar uma task, o usuário autenticado é automaticamente definido como assignee
- Outros assignees podem ser adicionados posteriormente via edição

Motivação:
- Simplificar o fluxo inicial
- Evitar dependência de listagem global de usuários
- Manter o escopo alinhado ao desafio

---

## ⚠️ Problemas Conhecidos e Melhorias Futuras

### Problemas Conhecidos
- Não há busca avançada de tarefas
- Não há listagem pública de usuários

### Melhorias Futuras
- Criar um rotas para users
- Permitir seleção de assignees na criação
- Adicionar testes e2e
- Filtros e busca avançada

---

## ⏱️ Tempo Gasto (Estimativa)

| Parte | Tempo |
|------|------|
| Estudos e planejamento (arquitetura, stack, fluhxo) | ~2 dias |
| Backend (microservices, RabbitMQ, WebSocket, auth) | ~5 dias |
| Frontend (UI, rotas, estado, WebSocket) | ~2 dias |
| Ajustes finais, debug e documentação | ~1 dia |
| **Total aproximado** | **~10 dias** |

---

## 🧭 Considerações Finais

O foco do projeto foi:
- cumprir integralmente os requisitos obrigatórios
- manter o código simples, claro e extensível
- demonstrar entendimento real de arquitetura full-stack

Decisões de escopo foram feitas de forma consciente e documentadas.

---

## 📧 Contato

Projeto desenvolvido como desafio técnico para a Jungle Gaming.
