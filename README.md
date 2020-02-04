<h1 align="center">
  ## Edaily
</h1>

<blockquote align="center">“Plante seus pés, fique firme”!</blockquote>

<p align="center">
  <img alt="Government AP" src="https://img.shields.io/badge/government-AP-%2304D361">

  <a href="https://github.com/carvalhoviniciusluiz">
    <img alt="Made by Vinicius Carvalho" src="https://img.shields.io/badge/made%20by-Vinicius%20Carvalho-%2304D361">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">

  <a href="https://github.com/carvalhoviniciusluiz/edaily-backend/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/carvalhoviniciusluiz/edaily-backend?style=social">
  </a>
</p>

<p align="center">
  <a href="#rocket-sobre-o-projeto">Sobre o projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#8ball-instalação">Instalação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#loop-funcionalidades">Funcionalidades</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#performing_arts-interface">Interface</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-licença">Licença</a>
</p>

<p align="center">
  <a href="https://insomnia.rest/run/?label=Edalily%20API&uri=https%3A%2F%2Fgithub.com%2Fcarvalhoviniciusluiz%2Fedaily-backend%2Fblob%2Fmaster%2F.github%2Fexport.json" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>
</p>

## :rocket: Sobre o projeto

O Edaily é um sistema que tem por objetivo estabelecer um ponto único de contato entre a Imprensa Oficial do Estado e o usuário final seja ele um particular, orgão de governo e afins, com isso otimizando o processo de produção do diário atual.

### **As ferramentas que você irá encontrar**

Aplicação criada do zero usando [Adonisjs](https://adonisjs.com/), conta com as seguintes ferramentas:

- Nodemon;
- Commitlint + Husky + Lint Staged;
- ESLint + Prettier + EditorConfig;
- Lucid ORM (PostgreSQL);
- Mongoose (Mongodb);
- GraphQL;
- PDF Document Processor;
- Tests de TDD;

__OBS__ os serviços de armazenamento podem ser levantados via docker:

### PostgreSQL

```js
docker run --name postgres -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=edaily-develop -p 5432:5432 -d postgres
```

### Redis

```
docker run --name redis -e REDIS_PASSWORD= -p 6379:6379 -d wodby/redis
```

### Mongodb

```js
docker run --name mongo -p 27017:27017 -d -t mongo
```

## :8ball: Instalação

Os próximos passos devem ser executados no terminal.

Baixando as dependências do sistema:

    yarn

Migrando as tabelas pro banco de dados:

    adonis migration:run

Testando o projeto:

    adonis test

Testando um arquivo específico:

    adonis test --files test/functional/users.spec.js

Subindo um servidor de desenvolvimento:

    adonis serve --dev

Subindo o servidor para produção:

    adonis start

### **Dependência**

É necessário instalar no servidor o processador de pdf

```hash
@see http://www.xpdfreader.com/download.html

brew install Xpdf # <- usuário de macos
```

## :loop: Funcionalidades

Abaixo estão descritas as funcionalidades da aplicação. Para testa-la você deve proceder com a instalação.

## :performing_arts: Interface

| Projeto | Descrição |
|---------|--------------|
| [frontend] | Interface web com React |

[frontend]: https://github.com/carvalhoviniciusluiz/edaily-frontend

## :memo: Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

---

Feito com ♥ by Vinícius :wave: [MEU INSTAGRAM!](https://www.instagram.com/carvalho_viniciusluiz/)
