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

  describe("with readers in the database", () => {
    let readers;
    beforeEach((done) => {
      Promise.all([
        Reader.create({ name: "Mia Corvere", email: "mia@redchurch.com" }),
        Reader.create({ name: "Bilbo Baggins", email: "bilbo@bagend.com" }),
        Reader.create({ name: "Rand al'Thor", email: "rand@tworivers.com" }),
      ]).then((documents) => {
        readers = documents;
        done();
      });
    });

    describe("GET /readers", () => {
      it("gets all reader records", (done) => {
        request(app)
          .get("/readers")
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((reader) => {
              const expected = readers.find((a) => a.id === reader.id);
              expect(reader.name).to.equal(expected.name);
              expect(reader.email).to.equal(expected.email);
            });
            done();
          })
          .catch((error) => done(error));
      });
    });

    describe("PATCH /readers/:id", () => {
      it("updates reader name by id", (done) => {
        const reader = readers[0];
        request(app)
          .patch(`/readers/${reader.id}`)
          .send({ name: "Lyra Silvertongue" })
          .then((res) => {
            expect(res.status).to.equal(200);
            Reader.findByPk(reader.id, { raw: true }).then((updatedReader) => {
              expect(updatedReader.name).to.equal("Lyra Silvertongue");
              done();
            });
          })
          .catch((error) => done(error));
      });

      it("updates reader email by id", (done) => {
        const reader = readers[0];
        request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: "lyra@jordancollege.ac.uk" })
          .then((res) => {
            expect(res.status).to.equal(200);
            Reader.findByPk(reader.id, { raw: true }).then((updatedReader) => {
              expect(updatedReader.email).to.equal("lyra@jordancollege.ac.uk");
              done();
            });
          });
      });

      it("returns a 404 if the reader does not exist", (done) => {
        request(app)
          .patch("/readers/345")
          .send({ name: "Harry Potter" })
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The reader does not exist.");
            done();
          })
          .catch((error) => done(error));
      });
    });

    describe("DELETE /readers/:id", () => {
      it("deletes reader record by id", (done) => {
        const reader = readers[0];
        request(app)
          .delete(`/readers/${reader.id}`)
          .then((res) => {
            expect(res.status).to.equal(204);
            Reader.findByPk(reader.id, { raw: true }).then((updatedReader) => {
              expect(updatedReader).to.equal(null);
              done();
            });
          })
          .catch((error) => done(error));
      });

      it("returns a 404 if the reader does not exist", (done) => {
        request(app)
          .delete("/readers/345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The reader does not exist.");
            done();
          })
          .catch((error) => done(error));
      });
    });
  });
});
