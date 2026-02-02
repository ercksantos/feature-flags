# Security Policy

## 🔒 Reporting a Vulnerability

Se você descobrir uma vulnerabilidade de segurança neste projeto, por favor **NÃO** abra uma issue pública.

### Como Reportar

Envie um email para: **erickpsantos0@gmail.com**

Inclua:

1. Descrição detalhada da vulnerabilidade
2. Passos para reproduzir
3. Impacto potencial
4. Sugestão de correção (se tiver)

### O que Esperar

- Respondo em até 48 horas
- Trabalharei para validar e corrigir o problema
- Manterei você informado sobre o progresso

## 🛡️ Versões Suportadas

| Versão | Suportada          |
| ------ | ------------------ |
| 1.x.x  | :white_check_mark: |
| < 1.0  | :x:                |

## 🔐 Práticas de Segurança

### Para Desenvolvedores

- Nunca commitar secrets, tokens ou senhas
- Usar variáveis de ambiente para configurações sensíveis
- Manter dependências atualizadas
- Seguir princípio do menor privilégio
- Validar todos os inputs
- Sanitizar dados antes de queries

### Para Usuários

- Usar senhas fortes
- Manter API keys seguras
- Não compartilhar credenciais
- Usar HTTPS em produção
- Habilitar autenticação 2FA (quando disponível)

## 📋 Checklist de Segurança

- [x] Validação de inputs com Zod
- [x] TypeScript strict mode
- [x] Prepared statements (TypeORM)
- [x] Rate limiting configurado
- [x] Logs de auditoria
- [x] CORS configurado
- [ ] Authentication/Authorization (próximas etapas)
- [ ] Encryption at rest
- [ ] Security headers (Helmet)

## 🔄 Atualizações de Segurança

Acompanhe as [Releases](https://github.com/seu-usuario/feature-flags/releases) para patches de segurança.

Recomendamos:
- Testar updates em staging primeiro
- Manter backups antes de atualizar
- Revisar changelogs para breaking changes

---

**Obrigado por ajudar a manter o projeto seguro!** 🛡️
