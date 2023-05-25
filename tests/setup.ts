import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/server";
import supertest from "supertest";

chai.use(chaiHttp);

const request = supertest(app);

// Export to use in modular test files
export { chai, request };
