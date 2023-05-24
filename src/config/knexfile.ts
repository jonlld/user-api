import { Knex } from "knex";
import dotenv from "dotenv";

// Specify explicit path as loaded by Knex CLI
dotenv.config({ path: "../../.env" });

// Note type, from @types/knex
const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    // TODO development only
    // debug: true,
    migrations: {
      // Relative position from dynamic path
      directory: __dirname + "/../database/migrations",
    },
  },
};

// Export knexConfig
export default knexConfig;
