# Feature Flags System - Sistema de Feature Flags com Rollout Seguro

[![CI](https://github.com/seu-usuario/feature-flags/actions/workflows/ci.yml/badge.svg)](https://github.com/seu-usuario/feature-flags/actions/workflows/ci.yml)
[![CD Staging](https://github.com/seu-usuario/feature-flags/actions/workflows/cd-staging.yml/badge.svg)](https://github.com/seu-usuario/feature-flags/actions/workflows/cd-staging.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Sistema profissional de gerenciamento de feature flags com rollout seguro, construído com Clean Architecture e NestJS.

## 🏗️ Arquitetura

```
src/
├── domain/           # Camada de Domínio - Entidades e regras de negócio
├── application/      # Camada de Aplicação - Casos de uso
├── infrastructure/   # Camada de Infraestrutura - Implementações concretas
└── presentation/     # Camada de Apresentação - Controllers e DTOs
```

## 🚀 Stack Tecnológica

- **Runtime**: Node.js 20+
- **Framework**: NestJS
- **Linguagem**: TypeScript (strict mode)
- **Banco de dados**: PostgreSQL
- **Cache**: Redis
- **Validação**: Zod
- **Filas**: BullMQ
- **Logs**: Pino
- **Containerização**: Docker + Docker Compose

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Subir infraestrutura (PostgreSQL + Redis)
docker-compose up -d

# Executar migrations (quando disponíveis)
npm run migration:run
```

## 🏃 Execução

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Com Docker
docker-compose up
```

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:cov

# Testes E2E
npm run test:e2e
```

## 📚 Endpoints

### Health Check
```bash
GET /api/v1/health
```

## 🔧 Configuração

Todas as variáveis de ambiente estão documentadas no arquivo `.env.example`.

## 📝 Scripts Úteis

```bash
npm run setup           # Setup completo (Docker + Migrations)
npm run migration:generate  # Gerar nova migration
npm run migration:run      # Executar migrations
npm run lint               # Executar linter
npm run format            # Formatar código
```

## 🏛️ Princípios

- **Clean Architecture**: Separação clara de responsabilidades
- **SOLID**: Princípios de design orientado a objetos
- **DRY**: Don't Repeat Yourself
- **TypeScript Strict**: Tipagem completa, zero `any`
- **Domain-Driven Design**: Foco no domínio do negócio

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ seguindo boas práticas de engenharia de software**
