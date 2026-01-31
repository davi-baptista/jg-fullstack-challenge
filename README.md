# 🚀 TaskFlow - Sistema de Gestão de Tarefas Colaborativo

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=flat-square&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)

Sistema de gestão de tarefas colaborativo com microserviços, comunicação via RabbitMQ e notificações em tempo real via WebSocket.

## 📋 Visão Geral

Arquitetura moderna com 4 microserviços independentes comunicando-se assincronamente:

<img width="1024" height="1150" alt="Visão geral da arquitetura de microserviços" src="https://github.com/user-attachments/assets/3bf7fd5e-bb31-494f-be05-9fc938760459" />

## 🎯 Funcionalidades

### ✅ Implementado
- **🔐 Autenticação JWT** com refresh tokens
- **📋 CRUD completo** de tarefas com múltiplos assignees
- **💬 Comentários em tempo real** por tarefa
- **🔔 Notificações WebSocket** para alterações
- **📊 Histórico de auditoria** de alterações
- **🐳 Docker Compose** para orquestração

### 🏗️ Stack Técnica
| Camada | Tecnologias |
|--------|------------|
| **Frontend** | React, TanStack Router/Query, shadcn/ui, Socket.IO |
| **Backend** | NestJS, TypeORM, PostgreSQL, JWT, Swagger |
| **Mensageria** | RabbitMQ para comunicação entre serviços |
| **Infra** | Docker, Docker Compose, Turborepo, pnpm |

## 🚀 Começando

### Pré-requisitos
- Docker & Docker Compose
- Node.js 18+
- pnpm AAA npm install -g pnpm AAA

### Instalação Rápida
```
# 1. Configurar variáveis de ambiente
cp apps/*/.env.example apps/*/.env

# 2. Iniciar containers
docker-compose up -d

# 3. Acessar
# Frontend: http://localhost:3000
# API Docs: http://localhost:3001/api/docs
```

### Comandos Úteis
```
# Desenvolvimento
pnpm install          # Instalar dependências
pnpm dev              # Rodar tudo localmente
pnpm build            # Build de todos os serviços

# Docker
docker-compose up --build  # Build e rodar
docker-compose down        # Parar serviços
```

## 📁 Estrutura do Projeto
```
taskflow-microservices/
├── apps/
│   ├── web/                 # Frontend React
│   ├── api-gateway/         # Gateway HTTP + WebSocket
│   ├── auth-service/        # Autenticação
│   ├── tasks-service/       # Tarefas e comentários
│   └── notifications-service/ # Notificações
├── packages/                # Código compartilhado
└── docker-compose.yml       # Orquestração
```

## 🔗 Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrar usuário |
| POST | `/api/auth/login` | Login |
| GET | `/api/tasks` | Listar tarefas |
| POST | `/api/tasks` | Criar tarefa |
| GET | `/api/tasks/:id` | Detalhes da tarefa |
| POST | `/api/tasks/:id/comments` | Adicionar comentário |

## 🔔 Eventos WebSocket
- `task:created` - Nova tarefa
- `task:updated` - Tarefa atualizada  
- `task:deleted` - Tarefa removida
- `comment:new` - Novo comentário

## 🎯 Decisões Técnicas

### Arquitetura
- **Microserviços** com banco de dados isolado por serviço
- **API Gateway** como ponto único de entrada
- **RabbitMQ** para comunicação assíncrona entre serviços
- **WebSocket** para notificações em tempo real

### Segurança
- JWT com tokens de acesso (15min) e refresh (7 dias)
- Cookies HTTP-only para refresh tokens
- Rate limiting (10 req/seg) no gateway
- Validação de entrada em todas as camadas

## 📈 Próximos Passos
- [ ] Testes unitários e e2e
- [ ] Sistema de busca e filtros avançados
- [ ] Upload de arquivos
- [ ] Dashboard com métricas

## 👨‍💻 Autor
**Davi Baptista**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/davi-baptista)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/davi-baptista)

---
*Projeto desenvolvido como demonstração de habilidades full-stack com arquitetura de microserviços.*
