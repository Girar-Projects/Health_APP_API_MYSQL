const mysql = require("mysql2");

const dbAddresses = ["mysql", "db4free.net", "localhost"];

const dbConfig = {
  user: "health_testing",
  password: "0919483800",
  database: "health_app_test",
  multipleStatements: true,
};

function createConnection(callback) {
  if (!dbAddresses.length) {
    // If we have exhausted all addresses, return an error
    const error = new Error("Unable to connect to any database address");
    callback(error);
    return;
  }

  // Try connecting to the first address in the list
  const address = dbAddresses[0];
  const connection = mysql.createConnection({ ...dbConfig, host: address });
  connection.connect((err) => {
    if (err) {
      console.error(
        `Error connecting to database at ${address}: ${err.message}`
      );
      // If there was an error connecting to the current address, try the next one
      dbAddresses.shift();
      createConnection(callback);
    } else {
      console.log(`Connected to MySQL database at ${address}`);
      callback(null, connection);
    }
  });
}

module.exports = {
  createConnection,
};

// module.exports.createConnection = createConnection