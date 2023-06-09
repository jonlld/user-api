import { chai, request } from "../setup";
import { knex } from "../../src/database/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const expect = chai.expect;

describe("User API", () => {
  // Define outer-scope variables
  let token: string;
  let userIdObj: { id: number };
  let userId: number;
  let testUser: {
    id?: number;
    name: string;
    email: string;
    password: string;
  };

  before(async () => {
    // Assign test user
    testUser = {
      name: "Test User",
      email: "test@mochatest.com",
      password: await bcrypt.hash("password123", 10),
    };
    // Insert in db, manually return id, assign first element to userIdObj
    [userIdObj] = await knex("users").returning("id").insert(testUser);
    // Assign id
    userId = userIdObj.id;
    testUser.id = userIdObj.id;

    // Assign token to use in tests
    token = jwt.sign(testUser, process.env.ACCESS_TOKEN_SECRET as string);
  });

  after(async () => {
    // Clean up db once tests complete
    await knex("users").where({ email: "updated@mochatest.com" }).del();
  });

  describe("GET /users", () => {
    it("should return all users when authenticated", async () => {
      // GET request, setting auth header
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
      // GET request, without setting auth header
      const res = await request.get("/users");

      expect(res).to.have.status(401);
      expect(res.body).to.have.property("error").that.equals("Unauthorized");
    });
  });

  describe("GET /users/:id", () => {
    it("should return specified user when authenticated", async () => {
      // GET request, with id and auth header
      const res = await request
        .get(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      // Assertions, with values
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("id", userId);
      expect(res.body).to.have.property("name", testUser.name);
      expect(res.body).to.have.property("email", testUser.email);
    });

    it("should return 401 when not authenticated", async () => {
      // Request, with id but no auth header
      const res = await request.get(`/users/${userId}`);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property("error").that.equals("Unauthorized");
    });
  });

  describe("PUT /users/:id", () => {
    // Updated payload
    const updatedUser = {
      name: "Updated User",
      email: "updated@mochatest.com",
    };

    it("should update specified user and return 200 when authenticated", async () => {
      // PUT request, with id, auth header, sending updated payload
      const res = await request
        .put(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedUser);

      // Assertions
      expect(res).to.have.status(200);
      expect(res.body)
        .to.have.property("message")
        .that.equals("User updated successfully");
    });

    it("should return 401 when authenticated with non-matching user id", async () => {
      const res = await request
        .put(`/users/${userId + 1}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedUser);

      // Assertions
      expect(res).to.have.status(401);
      expect(res.body).to.have.property("error").that.equals("Unauthorized");
    });

    it("should return 401 when not authenticated", async () => {
      // PUT request, but no auth header
      const res = await request.put(`/users/${userId}`).send(updatedUser);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property("error").that.equals("Unauthorized");
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete a user and return 200 when authenticated with id match", async () => {
      // DELETE request
      const res = await request
        .delete(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      // Assertions
      expect(res).to.have.status(200);
      expect(res.body)
        .to.have.property("message")
        .that.equals("User deleted successfully");
    });

    it("should return 401 when authenticated with non-matching user id", async () => {
      // DELETE request
      const res = await request
        .delete(`/users/${userId + 1}`)
        .set("Authorization", `Bearer ${token}`);

      // Assertions
      expect(res).to.have.status(401);
      expect(res.body).to.have.property("error").that.equals("Unauthorized");
    });

    it("should return 401 when not authenticated", async () => {
      // DELETE request, , without setting auth header
      const res = await request.delete(`/users/${userId}`);

      // Assertions
      expect(res).to.have.status(401);
      expect(res.body).to.have.property("error").that.equals("Unauthorized");
    });
  });
});
