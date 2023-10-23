const mysql = require("mysql2");

const dbAddresses = ["mysql", "db4free.net", "localhost"];

const connection = mysql.createPool({
  connectionLimit: 20, // maximum number of connections to create
  host: "196.188.127.211",
  port: 3307,
  user: "health_testing",
  password: "0919483800",
  database: "health_app_test",
  multipleStatements: true,
  idleTimeoutMillis: 60000, // Close connections that have been idle for 60 seconds
  acquireTimeoutMillis: 20000, // Wait no longer than 10 seconds for a connection
});


// test the connection pool
connection.getConnection((err, conn) => {
  if (err) {
    console.error(`Failed to get connection: ${err.message}`);
    return;
  }
  console.log("Connected to MySQL database");
  conn.release(); // release the connection back to the pool after use
});

module.exports = connection;






// const connection = mysql.createConnection({
//   host: "mysql",
//   port: 3307,
//   user: "health_testing",
//   password: "0919483800",
//   database: "health_app_test",
//   multipleStatements: true,
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting t o database: " + err.message);
//     return;
//   }
//   console.log("Connected to MySQL database");
// });

// module.exports = connection;



// const connection = mysql.createConnection({
//   host: "196.188.127.211",
//   port: 3307,
//   user: "health_testing",
//   password: "0919483800",
//   database: "health_app_test",
//   multipleStatements: true,
// });

// function connect() {
//   connection.connect((err) => {
//     if (err) {
//       console.error("Error connecting to database: " + err.message);
//       setTimeout(connect, 5000); // retry every 5 seconds
//       return;
//     }
//     console.log("Connected to MySQL database");
//   });
// }

// connect();

// module.exports = connection;