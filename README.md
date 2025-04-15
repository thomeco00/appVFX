# App | VFX

Aplicação web para gerenciamento de conteúdo e marketing para empresas.

## Tecnologias

- Next.js 15
- Supabase (Autenticação e Banco de Dados)
- TailwindCSS
- TypeScript

## Funcionalidades

- Autenticação de usuários
- Perfil da empresa
- Calendário de conteúdo
- Dashboard de métricas
- Geração de conteúdo via LLM (em desenvolvimento)

## Deploy

Esta aplicação está configurada para deploy na Vercel ou qualquer serviço que suporte Next.js com arquivos estáticos.

### Variáveis de ambiente necessárias:

```
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

## Instruções para desenvolvimento local

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Servir os arquivos estáticos
npx serve out
``` 