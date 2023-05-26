import { chai, request } from "../setup";
import { knex } from "../../src/database/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const expect = chai.expect;

describe("User API", () => {
  let token: string;

  before(async () => {
    // Create test user (and insert - in case db is empty)
    const testUser = {
      name: "Test User",
      email: "test@test.com",
      password: await bcrypt.hash("password123", 10),
    };
    await knex("users").insert(testUser);

    // Assign token to use in tests
    token = jwt.sign(testUser, process.env.ACCESS_TOKEN_SECRET as string);
  });

  after(async () => {
    // Delete test user
    await knex("users").where({ email: "test@test.com" }).del();
  });

  describe("GET /users", () => {
    it("should return all users with status 200 when authenticated", async () => {
      // Request, setting auth header
      const res = await request
        .get("/users")
        .set("Authorization", `Bearer ${token}`);

      // Chai assertions
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.at.least(1);
      expect(res.body[0]).to.have.property("id");
      expect(res.body[0]).to.have.property("name");
      expect(res.body[0]).to.have.property("email");
    });

    it("should return 401 when not authenticated", async () => {
      // Request, without setting auth header
      const res = await request.get("/users");
      expect(res).to.have.status(401);
      expect(res.body).to.have.property("error").that.equals("Unauthorized");
    });
  });
});
