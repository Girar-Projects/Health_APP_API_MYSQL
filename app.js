const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./db");
const jwt = require("jsonwebtoken");
const secretKey = "mysecretkey";
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
    "SELECT * FROM users WHERE email=? AND BINARY password=?",
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
        res.json({ token, userType: user.user_type, user_id: user.user_id });
      }
    }
  );
});

app.post("/register", (req, res) => {
  const {
    uuid,
    email,
    password,
    user_type,
    paymentStatus,
    profileCreationStatus,
    longitude,
    latitude,
  } = req.body;

  // Perform validation on the request data
  if (
    typeof uuid !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof user_type !== "string" ||
    typeof paymentStatus !== "string" ||
    typeof profileCreationStatus !== "string" ||
    isNaN(parseFloat(longitude)) ||
    isNaN(parseFloat(latitude)) ||
    !uuid ||
    !email ||
    !password ||
    !user_type ||
    !paymentStatus ||
    !profileCreationStatus
  ) {
    return res.status(400).json({
      statusCode: 400,
      message:
        "uuid, email, password, user_type, paymentStatus, profileCreationStatus, longitude and latitude are required and should be of the correct data type",
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid email address",
    });
  }

  // Insert the new user into the users table
  const sql =
    "INSERT INTO users (uuid, email, password, user_type, paymentStatus, profileCreationStatus, longitude, latitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    uuid,
    email,
    password,
    user_type,
    paymentStatus,
    profileCreationStatus,
    parseFloat(longitude),
    parseFloat(latitude),
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error registering new user: " + err.stack);
      return res.status(500).json({
        statusCode: 500,
        message: "Internal server error",
      });
    } else {
      const userId = result.insertId; // Get the ID of the newly inserted user

      // Generate a JWT token for the new user
      const token = jwt.sign({ id: userId, type: user_type }, secretKey, {
        expiresIn: "1h",
      });

      return res.status(201).json({
        statusCode: 201,
        message: "User registered successfully",
        user_id: userId,
        token: token,
        userType: user_type,
      });
    }
  });
});

// app.post("/register", (req, res) => {
//   const data = req.body;

//   console.log(data);
//   // Perform validation on the request data
//   if (
//     typeof data.uuid !== "string" ||
//     typeof data.email !== "string" ||
//     typeof data.password !== "string" ||
//     typeof data.user_type !== "string" ||
//     typeof data.paymentStatus !== "string" ||
//     typeof data.profileCreationStatus !== "string" ||
//     isNaN(parseFloat(data.longitude)) ||
//     isNaN(parseFloat(data.latitude)) ||
//     !data.uuid ||
//     !data.email ||
//     !data.password ||
//     !data.user_type ||
//     !data.paymentStatus ||
//     !data.profileCreationStatus
//   ) {
//     res.status(400).json({
//       message:
//         "uuid, email, password, user_type, paymentStatus, profileCreationStatus, longitude and latitude are required and should be of the correct data type",
//     });
//     return;
//   }

//   if (!data.email.includes("@")) {
//     res.status(400).json({ message: "Invalid email address" });
//     return;
//   }

//   // Insert the new user into the users table
//   const sql =
//     "INSERT INTO users (uuid, email, password, user_type, paymentStatus, profileCreationStatus, longitude, latitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
//   const values = [
//     data.uuid,
//     data.email,
//     data.password,
//     data.user_type,
//     data.paymentStatus,
//     data.profileCreationStatus,
//     parseFloat(data.longitude),
//     parseFloat(data.latitude),
//   ];

//   connection.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("Error registering new user: " + err.stack);
//       res.sendStatus(500);
//     } else {
//       res.json({ message: "User registered successfully" });
//     }
//   });
// });

// Endpoint for updating user password
app.put("/update-password/:user_id", (req, res) => {
  const { user_id } = req.params;
  const { newPassword } = req.body;

  if (!user_id || !newPassword) {
    res
      .status(400)
      .json({ status: "fail", message: "userId and newPassword are required" });
    return;
  }

  const checkUserSql = "SELECT * FROM users WHERE user_id=?";
  connection.query(checkUserSql, user_id, (err, results) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res.sendStatus(500);
    } else if (results.length === 0) {
      res.status(404).json({ status: "fail", message: "User not found" });
    } else {
      const updatePasswordSql = "UPDATE users SET password=? WHERE user_id=?";
      connection.query(
        updatePasswordSql,
        [newPassword, user_id],
        (err, result) => {
          if (err) {
            console.error("Error updating user password: " + err.stack);
            res.sendStatus(500);
          } else {
            res.status(200).json({
              StatusCode: "200",
              status: "success",
              message: "User password reset successfully",
            });
          }
        }
      );
    }
  });
});

app.get("/", (req, res) => {
  res.send("Health App server is running.");
});

module.exports = app;
