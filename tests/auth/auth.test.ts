import { chai, request } from "../setup";
import { knex } from "../../src/database/database";
import bcrypt from "bcrypt";

const expect = chai.expect;

describe("Auth API", () => {
  describe("POST /register", () => {
    before(async () => {
      // TODO delete test case only...

      // Prior to testing, delete existing records from users table
      await knex("users").del();
    });

    it("should register a new user", async () => {
      // Users table should not include this user prior to testing
      const userData = {
        name: "John Smith",
        email: "johnsmith@test.com",
        password: "pswd123",
      };

      // Chai http request
      const res = await request.post("/auth/register").send(userData);

      // Chai assertions
      expect(res).to.have.status(201);
      expect(res.body)
        .to.have.property("message")
        .that.includes("User registered successfully");
    });

    it("should return 409 and conflict message if user already exists", async () => {
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

    it("should return 500 and error message if an error occurs during registration", async () => {
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

  describe("POST /login", () => {
    before(async () => {
      // Payload
      const userData = {
        name: "Test User",
        email: "test@test.com",
        password: await bcrypt.hash("password123", 10),
      };

      // Prior to testing, insert test user to db
      await knex("users").insert(userData);
    });

    after(async () => {
      // After testing, delete the user from db
      await knex("users").where({ email: "test@test.com" }).del();
    });

    it("should log in a user and return a token", async () => {
      // Payload
      const loginData = {
        email: "test@test.com",
        password: "password123",
      };

      // Http request
      const res = await request.post("/auth/login").send(loginData);

      // Assertions
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("token");
    });

    it("should return 401 and invalid message if password is incorrect", async () => {
      // Payload
      const loginData = {
        email: "test@test.com",
        password: "incorrect",
      };

      // Http request
      const res = await request.post("/auth/login").send(loginData);

      // Assertions
      expect(res).to.have.status(401);
      expect(res.body)
        .to.have.property("error")
        .that.equals("Invalid password");
    });

    it("should return 500 and error message if error occurs during login", async () => {
      // Payload, missing required fields
      const loginData = {};

      // Http request
      const res = await request.post("/auth/login").send(loginData);

      // Assertions
      expect(res).to.have.status(500);
      expect(res.body)
        .to.have.property("error")
        .that.equals("Internal server error");
    });
  });
});
