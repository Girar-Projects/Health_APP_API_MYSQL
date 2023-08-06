const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const professionalEndpoints = require("./professionalEndpoints");
const OrganizationEndpoints = require("./organizationEndpoints");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/professional", professionalEndpoints);
app.use("/organization", OrganizationEndpoints);

app.post("/login", (req, res) => {
  const data = req.body;

  connection.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [data.email, data.password],
    (err, results) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        res.sendStatus(500);
      } else if (results.length === 0) {
        res.status(401).json({ message: "Invalid email or password" });
      } else {
        const user = results[0];
        const token = jwt.sign(
          { id: user.user_id, type: user.user_type },
          secretKey
        );
        res.json({ token, userType: user.user_type, id:user.user_id});
      }
    }
  );
});

app.post("/register", (req, res) => {
  const data = req.body;

  // Perform validation on the request data
  if (!(data.uuid && data.email && data.password && data.user_type)) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  if (!data.email.includes("@")) {
    res.status(400).json({ message: "Invalid email address" });
    return;
  }

  // Insert the new user into the users table
  connection.query(
    "INSERT INTO users (uuid, email, password, user_type) VALUES (?, ?, ?, ?)",
    [data.uuid, data.email, data.password, data.user_type],
    (err, result) => {
      if (err) {
        console.error("Error registering new user: " + err.stack);
        res.sendStatus(500);
      } else {
        res.json({ message: "User registered successfully" });
      }
    }
  );
});

app.get("/", (req, res) => {
  res.send("Health App server is running.");
});

module.exports = app;
