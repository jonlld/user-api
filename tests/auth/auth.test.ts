import { chai, request } from "../setup";

const expect = chai.expect;

// NOTE: DB table must be empty to run tests

describe("Auth API", () => {
  describe("POST /register", () => {
    it("should register a new user", async () => {
      const userData = {
        name: "John Smith",
        email: "js@test.com",
        password: "pswd123",
      };

      // Using supertest request object (to resolve port clash)
      const res = await request.post("/auth/register").send(userData);

      expect(res).to.have.status(201);
      expect(res.body)
        .to.have.property("message")
        .that.includes("User registered successfully");
    });
  });
});
