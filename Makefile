.PHONY: help install start stop restart logs clean setup test

help: ## Mostra esta ajuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Instala as dependências
	npm install

setup: ## Setup completo (Docker + Migrations)
	cp -n .env.example .env || true
	docker-compose up -d
	@echo "Aguardando PostgreSQL e Redis..."
	@sleep 5
	npm run migration:run

start: ## Inicia a aplicação em modo desenvolvimento
	npm run start:dev

stop: ## Para os containers Docker
	docker-compose down

restart: ## Reinicia os containers
	docker-compose restart

logs: ## Mostra os logs dos containers
	docker-compose logs -f

clean: ## Remove node_modules e containers
	rm -rf node_modules dist
	docker-compose down -v

test: ## Executa os testes
	npm test

test-cov: ## Executa os testes com coverage
	npm run test:cov

lint: ## Executa o linter
	npm run lint

format: ## Formata o código
	npm run format

build: ## Build da aplicação
	npm run build

docker-build: ## Build da imagem Docker
	docker build -t feature-flags:latest .
