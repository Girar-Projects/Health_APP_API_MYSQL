const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "db4free.net",
  user: "health_testing",
  password: "0919483800",
  database: "health_app_test",

  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "testing",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = connection;