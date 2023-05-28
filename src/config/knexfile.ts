import { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";

// Path changes for server operations vs. migrations.
// Therefore, use absolute path to .env file from current directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      // Relative position from dynamic path
      directory: __dirname + "/../database/migrations",
    },
  },
};

export default knexConfig;
