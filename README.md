<h1 align="center">
    Open Pocket Backend Server
</h1>
<h4 align="center">
  The open source successor of getpocket
</h4>

<p align="center">
    <a href="https://abdulrahim2002.github.io/open-pocket-docs/">
      <img
        src="https://github.com/user-attachments/assets/0e2c776b-0c7e-42e8-b8d7-b96279dbfdfd"
        alt="Logo"
        width="150"
        height="150"
      />
    </a>
</p>

#### Background

- [open-pocket organization](https://github.com/open-pocket) was started
  with the goal of creating an open source alternative to
  [getpocket](https://getpocket.com/)

- in 2025, [getpocket](https://getpocket.com/home) decided to shut down.

- open-pocket tries to be 100% compatible with [getpocket API
  specification](https://getpocket.com/developer/docs/overview), so all
existing clients work seamlessly

#### Current Status

- database [schemas
  defined](https://abdulrahim2002.github.io/open-pocket-docs/docs/Database-Layer/database-schema/)
- [most database
  controllers](https://github.com/abdulrahim2002/open-pocket-backend-server/tree/main/src/db/dbcontrollers)
have been written
- [email/password](https://github.com/abdulrahim2002/open-pocket-backend-server/blob/main/src/commons/fastifyPassport.ts)
  based authentication added
- JWT token based authentication mechanism fully functional
- Access token/Refresh token functionality added
- oauth2 protocol implemented
- unit tests written for all dbcontrollers using [vitest](https://github.com/abdulrahim2002/open-pocket-backend-server/tree/main/src/tests/dbcontrollers)

#### Technologies

- [fastify](https://fastify.dev) + typescript (main framework)
- main database: postgresql
- [drizzle ORM](https://orm.drizzle.team/)
- [redis](https://redis.io/) (currently used on authentication endpoints)
- [vitest](https://vitest.dev/) for testing
- bitnami docker containers for
  [redis](https://hub.docker.com/r/bitnami/redis) and
[postgres](https://hub.docker.com/r/bitnami/postgresql) database

