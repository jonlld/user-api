# Users API

## Project Setup

### Install Dependencies

- Run `npm install` to install dependencies required by the project

### Setting up the database

- Install Postgres and ensure it is running; create a local database via CLI:

  - `echo "CREATE DATABASE users;" | psql`
  - Verify database exists:
    - `psql -d users` (this should connect to the database without errors)

- Create a .env file and include in .gitignore
  - Set DB_NAME, DB_USER, and DB_PASSWORD to match local database settings

### Migrations

- Run the migrations file with the following command to set up the Users table
  `npx knex migrate:latest --knexfile ./src/config/knexfile.ts`

- Note, migration files may be updated with commands such as:
  `npx knex --knexfile ./src/config/knexfile.ts migrate:make update_users_table`
