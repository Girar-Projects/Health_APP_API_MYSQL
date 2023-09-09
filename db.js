const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "db4free.net",
  user: "health_testing",
  password: "0919483800",
  database: "health_app_test",
  multipleStatements: true,

  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "testing",

  // host: "sql7.freesqldatabase.com",
  // user: "sql7638980",
  // password: "eRmGBC2lxS",
  // database: "sql7638980",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.message);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = connection;

//////////////// UPDATED DB Connection ////////////////////

// const mysql = require("mysql");
// const retry = require("retry");
// const connectionDetails = {
//   // host: "db4free.net",
//   // user: "health_testing",
//   // password: "0919483800",
//   // database: "health_app_test",

//   // host: "localhost",
//   // user: "root",
//   // password: "",
//   // database: "testing",

//   host: "185.27.134.10",
//   user: "if0_34598054",
//   password: "mbauLYEO8t",
//   database: "if0_34598054_health_app",
// };

// function createConnection(callback) {
//   const operation = retry.operation({
//     retries: 25,
//     factor: 3,
//     minTimeout: 1000,
//   });

//   operation.attempt((attempt) => {
//     console.log(`Trying to connect to MySQL (attempt ${attempt})...`);
//     const connection = mysql.createConnection(connectionDetails);

//     connection.connect((err) => {
//       if (operation.retry(err)) {
//         console.log(`Error connecting to MySQL: ${err}. Retrying...`);
//         return;
//       }

//       callback(err, connection);
//     });
//   });
// }

// const connection = createConnection((err, connection) => {
//   if (err) {
//     console.error("Error connecting to database: " + err.stack);
//     return;
//   }
//   console.log("Connected to MySQL database");
// });

// module.exports = connection;
