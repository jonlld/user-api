import knex from "knex";
import dotenv from "dotenv";
import knexConfig from "../config/knexfile";

dotenv.config();

// Dynamically set knexConfig to environment
const environment = process.env.NODE_ENV || "development";
const configOptions = knexConfig[environment];

const knexInstance = knex(configOptions);

export { knexInstance as knex };
