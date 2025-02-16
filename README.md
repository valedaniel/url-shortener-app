# URL Shortener App

## Descrição

Este é um aplicativo de encurtador de URLs desenvolvido com o framework NestJS. Ele permite que os usuários encurtem URLs longas e rastreiem cliques.

## Funcionalidades

- Cadastro de usuários e autenticação
- Encurtar links enviados
- Listar com quantidade total de cliques, editar o endereço de destino e excluir URLs encurtadas pelo usuário proprietário
- Todos os acessos aos links são contabilizados

## Pré-requisitos

- **Yarn**: versão 1.22.22
- **Node.js**: versões (v22.14.0, v20.18.3)
- **PostgreSQL**: versão 16
- **Redis**: versão 7.4.2

## Configuração do Ambiente

1. Clone o repositório:

   ```bash
   git clone https://github.com/valedaniel/url-shortener-app.git
   cd url-shortener-app
   ```

2. Instale as dependências:

   ```bash
   yarn install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo [.env.example] para [.env]:
     ```bash
     cp .env.example .env
     ```
   - Edite o arquivo [.env] com suas configurações específicas.

**Pontos de atenção**

1. DATABASE_DIALECT deve estar definido como "postgres" para que funcione corretamente.

2. NODE_ENV deve estar preenchido com o ambiente desejado (ex: local) para que as migrations executem.

## Executando o Projeto Localmente

### Passo a Passo

1. Certifique-se de que o PostgreSQL e o Redis estão em execução.

2. Crie o banco de dados que deseja e configure corretamente o seu nome junto ao [.env].

3. Execute as migrações do banco de dados:

   ```bash
   yarn migrate
   ```

4. Faça o build da API:

   ```bash
   yarn build
   ```

5. Inicie o servidor em modo de produção:

   ```bash
   yarn start:prod
   ```

6. Acesse a aplicação em `http://localhost:[Porta definida no .env]`.

## Executando o Projeto com Docker Compose

### Passo a Passo

1. Certifique-se de que o Docker e o Docker Compose estão instalados.

2. Configure as variáveis de ambiente no arquivo [.env] com as seguintes configurações recomendadas:

   ```env
   # ENV
   NODE_ENV=local

   # DATABASE
   DATABASE_DIALECT=postgres
   DATABASE_HOST=postgres_service
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=admin
   DATABASE_NAME=url_shortener_app

   # REDIS
   REDIS_HOST=redis_service
   REDIS_PORT=6379

   # SECRETS
   JWT_SECRET=secret

   # API
   PORT=3000
   API_VERSION=1
   ```

3. Execute o Docker Compose:

   ```bash
   docker-compose up --build
   ```

4. Acesse a aplicação em `http://localhost:3000`.

## Scripts Disponíveis

- `yarn build`: Compila o projeto.
- `yarn format`: Formata o código usando Prettier.
- `yarn start`: Inicia o servidor.
- `yarn start:dev`: Inicia o servidor em modo de desenvolvimento.
- `yarn start:debug`: Inicia o servidor em modo de depuração.
- `yarn start:prod`: Inicia o servidor em modo de produção.
- `yarn lint`: Executa o ESLint para verificar problemas no código.
- `yarn test`: Executa os testes.
- `yarn test:watch`: Executa os testes em modo de observação.
- `yarn test:cov`: Executa os testes e gera um relatório de cobertura.
- `yarn test:debug`: Executa os testes em modo de depuração.
- `yarn migrate`: Executa as migrações do banco de dados.
- `yarn migrate:undo:all`: Desfaz todas as migrações do banco de dados.
- `yarn migrate:undo`: Desfaz a última migração do banco de dados.

## Documentação da API

A documentação da API está disponível em `http://localhost:[Porta definida no .env]/docs` quando o servidor está em execução.

## Suporte

Para mais informações, consulte a [documentação do NestJS](https://docs.nestjs.com).
