import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import express from "express";
import path from "path";

// Get absolute path to yaml file from current directory
const swaggerPath = path.resolve(__dirname, "swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

console.log(__dirname);

const router = express.Router();

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Named export, to differentiate
export { router as swaggerRouter };
