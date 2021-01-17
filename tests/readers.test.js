const { Reader } = require("../src/models");
const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

describe("/readers", () => {
  before(async () => {
    try {
      await Reader.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Reader.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });

  describe("POST /readers", async () => {
    it("creates a new reader in the database", async () => {
      const response = await request(app).post("/readers").send({
        name: "Mia Corvere",
        email: "mia@redchurch.com",
      });

      await expect(response.status).to.equal(201);
      expect(response.body.name).to.equal("Mia Corvere");
      expect(response.body.email).to.equal("mia@redchurch.com");

      const newReaderRecord = await Reader.findByPk(response.body.id, {
        raw: true,
      });
      expect(newReaderRecord.name).to.equal("Mia Corvere");
      expect(newReaderRecord.email).to.equal("mia@redchurch.com");
    });
  });
});
