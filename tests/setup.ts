import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/server";

chai.use(chaiHttp);

// Export to use in test files
export { chai, app };
