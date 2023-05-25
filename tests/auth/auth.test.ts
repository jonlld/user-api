import { chai, request } from "../setup";
import { knex } from "../../src/database/database";

const expect = chai.expect;

describe("Auth API", () => {
  describe("POST /register", () => {
    before(async () => {
      // Prior to testing, delete existing records from users table
      // TODO delete test cases only
      await knex("users").del();
    });

    it("should register a new user", async () => {
      // Users table should not include this user prior to testing
      const userData = {
        name: "John Smith",
        email: "johnsmith@test.com",
        password: "pswd123",
      };

      // Using supertest request object (to resolve port clash)
      const res = await request.post("/auth/register").send(userData);

      expect(res).to.have.status(201);
      expect(res.body)
        .to.have.property("message")
        .that.includes("User registered successfully");
    });

    it("should return 409 if user already exists", async () => {
      const existingUserData = {
        name: "Jill Smith",
        email: "jillsmith@test.com",
        password: "password456",
      };

      // Insert an existing user into the database
      await knex("users").insert(existingUserData);

      const res = await request.post("/auth/register").send(existingUserData);
      expect(res).to.have.status(409);
      expect(res.body)
        .to.have.property("error")
        .that.equals("User already exists");
    });

    it("should return 500 if an error occurs during registration", async () => {
      // Omitting email
      const invalidData = {
        name: "John Williams",
        password: "maestro123",
      };

      const res = await request.post("/auth/register").send(invalidData);
      expect(res).to.have.status(500);
      expect(res.body)
        .to.have.property("error")
        .that.equals("Internal server error");
    });
  });
});
