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

  // host: "185.27.134.10",
  // user: "if0_34598054",
  // password: "mbauLYEO8t",
  // database: "if0_34598054_health_app",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = connection;
