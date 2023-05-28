import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import express from "express";
import path from "path";

// Get absolute path to yaml file from current directory, as CWD depends on how application is run
const swaggerPath = path.resolve(__dirname, "swagger.yaml");
// Parse to JS object
const swaggerDocument = YAML.load(swaggerPath);

const router = express.Router();

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Named export, to differentiate
export { router as swaggerRouter };
