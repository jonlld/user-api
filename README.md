# Users API

## Overview

This RESTful API is built with Node.JS and Express, and utilises TypeScript together with the PostgreSQL database. Knex is used to handle migrations and querying the database.

The API supports CRUD (Create, Read, Update, and Delete) operations for a single `User` resource.

The Joi validation library is used to insure the integrity of input data, while JWT authentication is used to secure and authorize the API. The API also includes a suite of automated tests built with the Mocha framework and Chai assertion library.

Detailed living documentation is included through the use of Swagger, providing a comprehensive browser-based interface for interaction with and testing the API.

## Setup

### Install Dependencies

- Run `npm install` to install API dependencies

### Set up the Database

- Install [Postgres](https://www.postgresql.org/) and ensure it is running

- Create a local database using the command line:

  - `echo "CREATE DATABASE user_api;" | psql`

- Verify database exists:

  - `psql -d user_api`

- Create a .env file in the root folder with the following variables and add this to .gitignore

```
DB_USER=<your_username>
DB_PASSWORD=<your_password>
DB_NAME=<your_db_name>
```

- Set DB_NAME, DB_USER, and DB_PASSWORD to match local database settings

### Run Migrations

- Run the migrations file with the following command to set up the Users table

  - `npx knex migrate:latest --knexfile ./src/config/knexfile.ts`

- Note, migration files may be updated with commands such as:
  - `npx knex --knexfile ./src/config/knexfile.ts migrate:make update_users_table`

### Set up a JWT Secret

- Choose a secret value and set ACCESS_TOKEN_SECRET in your .env file

```
ACCESS_TOKEN_SECRET=<your_secret>
```

- One way to generate a token string is to run the following in a node terminal:

  - `require('crypto').randomBytes(64).toString('hex')`

### Run the Development Server

Use the following command to start the development server.

`npm run startDev`

### Automated Testing

The API includes a full set of automated tests, built with the Mocha framework and Chai assertion library. Please run the following command to execute the tests and check results in your terminal:

`npm test`

## Documentation

### Available Endpoints

_Note: For more detail please reference the living documentation (detailed below) at `http://localhost:<port>/docs/`_

#### Authentication

`POST /auth/register`

- Description: Register a new user.

`POST /auth/login`

- Description: Login a registered user and obtain JWT access token.

#### Users

`GET /users`

- Description: Retrieve id, name, and email detail for all users. Requires authorization with login token.

`GET /users/{id}`

- Description: Retrieve a specific user's details by their ID. Requires authorization with login token.

`PUT /users/{id}`

- Description: Update logged-in user's details by their ID. Requires authorization with login token.

`DELETE /users/{id}`

- Description: Delete logged-in user by their ID. Requires authorization with login token.

### Swagger - Living Documentation

The API utilises the Swagger UI to provide living documentation. The documentation describes all endpoints within the API and provides details with how to interact with them. API users can interact with all features of the API through this web-browser based interface.

Please follow the below steps to get started:

- Ensure your local database setup is complete as detailed above
- Start the development server with `npm run startDev`
- Open a browser and navigate to: `http://localhost:<port>/docs/`

You will now see a list of available endpoints.

Please note that all `/users` endpoints require the appropriate authorization with a JWT access token (for development purposes, tokens have a 1-hour expiry). In order to obtain a token:

- Use the `register` endpoint in Authorization to register a user (if have not already)
- Use these details to then access the `login` endpoint, and retrieve a token
- Then click on the 'Authorize' button at the top-right of the UI.
- Type 'BEARER ' and paste your token to authorize usage of the `/users` API.
- To log out, click on the 'Authorize' button once more to see the 'logout' option.
