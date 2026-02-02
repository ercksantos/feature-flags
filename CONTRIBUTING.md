# Contributing to Feature Flags System

## 🎯 Getting Started

1. Fork o repositório
2. Clone seu fork: `git clone https://github.com/ercksantos/feature-flags.git`
3. Crie uma branch: `git checkout -b feature/minha-feature`
4. Configure o ambiente: `npm install && cp .env.example .env`
5. Suba o ambiente: `docker-compose up -d && npm run migration:run`

## 📝 Padrões de Código

### TypeScript

- Use **TypeScript strict mode**
- Sem uso de `any` - sempre tipar corretamente
- Prefira interfaces para contratos
- Use types para unions e intersections

### Formatação

```bash
# Formatar código antes de commitar
npm run format

# Verificar formatação
npm run format:check
```

### Linting

```bash
# Corrigir problemas automaticamente
npm run lint
```

## 🧪 Testes

- Escreva testes para novas funcionalidades
- Mantenha cobertura acima de 80%
- Testes unitários para lógica de negócio
- Testes E2E para endpoints críticos

```bash
npm run test              # Rodar todos os testes
npm run test:watch        # Watch mode
npm run test:cov          # Com coverage
```

## 📦 Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

### Formato

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Apenas documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração sem mudar funcionalidade
- `perf`: Melhorias de performance
- `test`: Adicionar/corrigir testes
- `chore`: Tarefas de manutenção
- `ci`: Mudanças em CI/CD

### Exemplos

```bash
feat(domain): adiciona entidade FlagRule
fix(repository): corrige query de busca por ambiente
docs: atualiza README com instruções de setup
refactor(mapper): simplifica conversão de entidades
test(evaluation): adiciona testes para rollout percentual
```

## 🔀 Pull Requests

1. Atualize seu fork: `git pull upstream main`
2. Certifique-se que os testes passam: `npm test`
3. Verifique formatação: `npm run format:check`
4. Crie PR com descrição clara
5. Aguarde review

### Template de PR

```markdown
## 📝 Descrição

Descreva as mudanças realizadas

## 🎯 Tipo de mudança

- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## ✅ Checklist

- [ ] Código segue o style guide do projeto
- [ ] Testes passando
- [ ] Adicionei testes para cobrir as mudanças
- [ ] Documentação atualizada
- [ ] Sem novos warnings
```

## 🏗️ Arquitetura

### Clean Architecture

Siga a separação de camadas:

1. **Domain**: Regras de negócio puras (sem dependências externas)
2. **Application**: Casos de uso (orquestra o domain)
3. **Infrastructure**: Implementações concretas (DB, Cache, APIs)
4. **Presentation**: Controllers e DTOs (interface externa)

### Dependências

```
Presentation → Application → Domain
Infrastructure → Application → Domain
```

## 🐛 Reportando Bugs

Use o template de issue do GitHub incluindo:

- Versão do Node.js
- Sistema operacional
- Passos para reproduzir
- Comportamento esperado vs atual
- Logs relevantes

## 💡 Sugerindo Features

Abra uma issue com:

- Descrição clara da feature
- Casos de uso
- Proposta de implementação (opcional)
- Mockups/exemplos (se aplicável)

## 📞 Contato

Para dúvidas sobre contribuições, abra uma issue de discussão.

---

Obrigado por contribuir! 🎉
