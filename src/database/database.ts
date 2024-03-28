import knex from "knex";
import dotenv from "dotenv";
import knexConfig from "../config/knexfile";

dotenv.config();

// Dynamically set environment
const environment = process.env.NODE_ENV || "development";
// Will access production config or dev config, depending on environment
const configOptions = knexConfig[environment];
// Initialise with the above config
const knexInstance = knex(configOptions);
// Export for use in app
export { knexInstance as knex };
