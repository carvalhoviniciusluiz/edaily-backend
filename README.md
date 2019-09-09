# Edaily backend

API server em AdonisJs, vem pré-configurado com:

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Setup

Manualmente após clona o projeto execute `yarn`.

### Migrations

Execute o seguinte comando para as migrações iniciais.

```js
adonis migration:run
```

## Tests

```js
adonis test
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
