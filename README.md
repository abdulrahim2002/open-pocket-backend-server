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

---

## Background

**Open-Pocket** was created to provide an open source alternative to Pocket.

In 2025, Pocket announced its shutdown. The project aims to deliver a fully open and community-driven replacement.

Open-Pocket is designed to be 100% compatible with the Pocket API specification, ensuring that existing Pocket clients can integrate without modification.


## Current Status

* [x] Database schemas defined
* [x] Most database controllers implemented
* [x] Email and password based authentication added
* [x] JWT-based authentication fully functional
* [x] Access token and refresh token mechanism implemented
* [x] Unit tests written for all database controllers using Vitest


## Technologies

* Fastify with TypeScript as the main framework
* PostgreSQL as the primary database
* Drizzle ORM for database access
* Redis (currently used for authentication endpoints)
* Vitest for testing
* Bitnami Docker containers for Redis and PostgreSQL
