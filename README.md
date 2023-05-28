# Users API

## Project Setup

### Installing Dependencies

- Run `npm install` to install dependencies required by the project

### Setting up the Database

- Install Postgres and ensure it is running
- Create a local database using the command line:

  - `echo "CREATE DATABASE user_api;" | psql`

- Verify database exists:

  - `psql -d user_api`

- Create a .env file in the root folder and add this to .gitignore

  - Set DB_NAME, DB_USER, and DB_PASSWORD to match local database settings

### Running Migrations

- Run the migrations file with the following command to set up the Users table

  - `npx knex migrate:latest --knexfile ./src/config/knexfile.ts`

- Note, migration files may be updated with commands such as:
  - `npx knex --knexfile ./src/config/knexfile.ts migrate:make update_users_table`

### Setting up JWT Secret

- Choose a secret value and set ACCESS_TOKEN_SECRET in the .env file

- One way to generate a token string is to run the following in a node terminal:

  - `require('crypto').randomBytes(64).toString('hex')`

### Running the Development Server

Use the following command to start the development server.

`npm run startDev`

The API can be tested with tools such as Postman. Your local DB may be accessed via the command line and the `psql` interface, or through visual tools such as PGAdmin.

### Automated Tests (Development Only)

The API includes a full set of automated tests, built with the Mocha framework and Chai assertion library. Please run the following command to execute the tests and see results in the terminal:

`npm test`

## Project Documentation

### Swagger - Living Documentation

This project utilises the Swagger UI to provide living documentation for the API. The documentation describes all endpoints and can be directly interacted with via the UI. Please follow the steps below to start:

- Ensure your Postgres setup is complete, and use the following command to start the development server.

  - `npm run startDev`

- Open your browser and navigate to:

  - `http://localhost:<port>/docs`

You may now interact with the API using the interface provided and the 'Try It Out' buttons. This will interact live with the DB and provide details on responses from the server.

Note that all /users endpoints require authorization with a JWT access token. To obtain a token:

- Please register a user (if not already)
- Log in to retrieve a token
- Click on 'Authorize' button in top-right of UI, and paste token with 'BEARER ' prefix.
- To log out, click on the same button and then 'logout'
