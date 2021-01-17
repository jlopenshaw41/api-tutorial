const Sequelize = require("sequelize");
const ReaderModel = require("./reader");

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const setupDatabase = () => {
  const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: false,
  });

  const Reader = ReaderModel(connection, Sequelize);

  connection.sync({ alter: true });

  return {
    Reader,
  };
};

module.exports = setupDatabase();
