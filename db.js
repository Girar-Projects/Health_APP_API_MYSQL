const mysql = require("mysql2");

const dbAddresses = ["mysql", "db4free.net", "localhost"];

const connection = mysql.createConnection({
  host: "db4free.net",
  user: "health_testing",
  password: "0919483800",
  database: "health_app_test",
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.message);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = connection;
