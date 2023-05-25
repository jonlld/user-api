# Users API

## Project Setup

### Installing Dependencies

- Run `npm install` to install dependencies required by the project

### Setting up the Database

- Install Postgres and ensure it is running; create a local database via CLI:

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

### Running the Development Server

Use the following command to start the development server.

`npm run startDev`

This can be tested with tools such as Postman. The DB may be accessed via the `psql` CLI or visual tools such as PGAdmin.

### Running Tests

`npm test`
