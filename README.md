# VFX App

Aplicativo para gerenciamento de conteúdo e geração de calendários de mídia social para profissionais de marketing.

## Funcionalidades

- Autenticação de usuários
- Perfil da empresa
- Geração de calendário de conteúdo
- Exportação de calendário
- Compartilhamento de conteúdo

## Tecnologias

- Next.js
- Supabase (autenticação e banco de dados)
- Tailwind CSS
- React

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie o arquivo `.env.example` para `.env.local` e configure as variáveis:
   ```bash
   cp .env.example .env.local
   ```
4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura do Banco de Dados

- `profiles`: Armazena informações de perfil do usuário
- `company_profiles`: Armazena informações sobre empresas
- `app_calendar`: Armazena dados do calendário de conteúdo