

# Edaily backend

API server em AdonisJs, vem pré-configurado com:

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Interface

| Projeto | Descrição |
|---------|--------------|
| [frontend] | Interface web com React |

[frontend]: https://github.com/carvalhoviniciusluiz/edaily-frontend

## Dependency

Adiciona o suporte para processar pdf em texto
```
@see http://www.xpdfreader.com/download.html

brew install Xpdf
```

## Setup

Manualmente após clona o projeto execute `yarn`.

## Database

Usando o docker para subir um container postgres

```js
docker run --name postgres -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=edaily-develop -p 5432:5432 -d postgres
```

Test

```js
docker exec -it postgres psql -h localhost -U postgres -p 5432
```

Usando o docker para subir um container redis

```
docker run --name redis -e REDIS_PASSWORD= -p 6379:6379 -d wodby/redis
```

```js
docker run --name mongo -p 27017:27017 -d -t mongo
```

### Migrations

Execute o seguinte comando para as migrações iniciais.

```js
adonis migration:run
```

## Tests

```js
adonis test
```

Ou

```js
adonis test --files test/functional/users.spec.js
```

## Server

Para subir o server de desenvolvimento

```js
adonis serve --dev
```

Para subir o server de produção

```js
adonis start
```
