import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/server";

chai.use(chaiHttp);
const request = chai.request(app).keepOpen();

// Export to use in modular test files
export { chai, request };
