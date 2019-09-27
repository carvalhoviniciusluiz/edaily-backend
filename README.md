

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

## Setup

Manualmente após clona o projeto execute `yarn`.

## Database

Usando o docker para subir um container postgres

```js
docker run --name=postgis -d -e POSTGRES_DBNAME=edaily-develop -e POSTGRES_USER=postgres -e POSTGRES_PASS=docker -p 5432:5432 kartoza/postgis
```

Test

```js
docker exec -it postgis psql -h localhost -U postgres -p 5432
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
