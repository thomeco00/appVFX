# Guia de Deploy em Produção (Siteground)

Este documento fornece instruções para implantar o aplicativo em produção usando o serviço de hospedagem Siteground.

## Pré-requisitos

1. Uma conta no Siteground com SSH habilitado
2. NodeJS 16+ instalado no servidor
3. Um domínio registrado e configurado no Siteground
4. Acesso ao painel de controle do Siteground

## Passo 1: Preparar o aplicativo para produção

Antes de fazer o deploy, prepare o aplicativo para produção:

1. Atualize o arquivo `.env.local` com as configurações corretas para produção:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase_real
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_real
```

2. Execute o build da aplicação localmente para verificar se não há erros:

```bash
npm run build
```

## Passo 2: Configurar o servidor SSH no Siteground

1. No painel de controle do Siteground, vá para **Devtools > SSH Keys Manager**
2. Gere uma nova chave SSH ou use uma existente
3. Anote os detalhes de acesso SSH (endereço do servidor, porta, usuário e senha ou caminho para chave privada)

## Passo 3: Enviar os arquivos para o servidor

Você pode usar o Git ou o FTP para enviar os arquivos:

### Opção 1: Usando Git

1. Configure um repositório Git no servidor:

```bash
ssh username@hostname
cd ~/www/seudominio.com
git init
git config receive.denyCurrentBranch updateInstead
exit
```

2. Adicione o repositório remoto no seu projeto local:

```bash
git remote add production username@hostname:~/www/seudominio.com
```

3. Envie o código para o servidor:

```bash
git push production main
```

### Opção 2: Usando FTP

1. Use um cliente FTP como FileZilla para conectar ao servidor
2. Envie todo o conteúdo da pasta do projeto (exceto node_modules) para o diretório `~/www/seudominio.com/`

## Passo 4: Configurar o ambiente Node.js no servidor

1. Conecte ao servidor via SSH:

```bash
ssh username@hostname
```

2. Instale as dependências:

```bash
cd ~/www/seudominio.com
npm install --production
```

3. Construa o aplicativo:

```bash
npm run build
```

## Passo 5: Configurar o PM2 para manter a aplicação em execução

1. Instale o PM2 globalmente:

```bash
npm install -g pm2
```

2. Crie um arquivo de configuração do PM2:

```bash
touch ecosystem.config.js
```

3. Edite o arquivo com o seguinte conteúdo:

```javascript
module.exports = {
  apps: [
    {
      name: "calendario-conteudo",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
```

4. Inicie a aplicação com PM2:

```bash
pm2 start ecosystem.config.js
```

5. Configure o PM2 para iniciar automaticamente após reinicializações do servidor:

```bash
pm2 startup
pm2 save
```

## Passo 6: Configurar o Nginx como proxy reverso

1. No painel de controle do Siteground, vá para **Devtools > Site Tools > Site > NGINX configuration**
2. Adicione a seguinte configuração:

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

3. Salve as alterações

## Passo 7: Configurar SSL/HTTPS

1. No painel de controle do Siteground, vá para **Security > SSL Manager**
2. Selecione seu domínio e clique em **Install SSL**
3. Escolha Let's Encrypt (gratuito) ou outro provedor de certificado
4. Siga as instruções para completar a instalação do SSL

## Passo 8: Testar a aplicação

1. Abra seu navegador e acesse seu domínio (`https://seudominio.com`)
2. Verifique se a aplicação está funcionando corretamente
3. Teste o login, registro e outras funcionalidades principais

## Solução de problemas

Se encontrar problemas durante o deploy, verifique:

1. Logs do PM2:
```bash
pm2 logs
```

2. Logs do Nginx:
```bash
sudo cat /var/log/nginx/error.log
```

3. Certifique-se de que as portas estão abertas:
```bash
sudo netstat -tulpn | grep 3000
```

4. Verifique se as variáveis de ambiente estão configuradas corretamente.

## Atualizações futuras

Para atualizar a aplicação no futuro:

1. Faça as alterações localmente e teste
2. Execute:
```bash
git push production main
ssh username@hostname
cd ~/www/seudominio.com
npm install --production
npm run build
pm2 restart calendario-conteudo
```

## Backup

Regularmente faça backup do seu banco de dados Supabase através do painel de controle do Supabase. 