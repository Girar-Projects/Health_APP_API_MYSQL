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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Database Connectivity Refresh ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`

app.post("/refresh-db-connection", (req, res) => {
  console.log("Refreshing database connection...");
  connection.destroy();
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to database: " + err.stack);
      res.status(500).send("Error connecting to database");
      return;
    }
    console.log("Database connection refreshed successfully");
    res.send("Database connection refreshed successfully");
  });
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Login & Token ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`

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
        res.json({
          statusCode: "200",
          message: "User Has Been Logged In Successfully!",
          user_id: user.user_id,
          email: user.email,
          uuid: user.uuid,
          userType: user.user_type,
          PhoneNumber: user.phoneNumber,
          token: token,
          paymentStatus: user.paymentStatus,
          profileCreationStatus: user.profileCreationStatus,
          longitude: user.longitude,
          latitude: user.latitude,
        });
      }
    }
  );
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Register ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`

app.post("/register", (req, res) => {
  const {
    uuid,
    email,
    password,
    user_type,
    phoneNumber,
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
      status: "error",
      message:
        "uuid, email, password, user_type, paymentStatus,phoneNumber, profileCreationStatus, longitude and latitude are required and should be of the correct data type",
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email address",
    });
  }

  // Check if the email is already registered
  const sql = "SELECT * FROM users WHERE email = ?";
  connection.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Error checking if email exists: " + err.stack);
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Internal server error, Please try again later.",
      });
    }
    if (result.length > 0) {
      return res.status(409).json({
        code: 409,
        status: "error",
        message: "Email is already registered",
      });
    } else {
      // Insert the new user into the users table
      const sql =
        "INSERT INTO users (uuid, email, password, user_type,phoneNumber, paymentStatus, profileCreationStatus, longitude, latitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [
        uuid,
        email,
        password,
        user_type,
        phoneNumber,
        paymentStatus,
        profileCreationStatus,
        parseFloat(longitude),
        parseFloat(latitude),
      ];

      connection.query(sql, values, (err, result) => {
        if (err) {
          console.error("Error registering new user: " + err.stack);
          return res.status(500).json({
            code: 500,
            status: "error",
            message: "Internal server error, Could not register User.",
          });
        } else {
          const userId = result.insertId; // Get the ID of the newly inserted user

          // Generate a JWT token for the new user
          const token = jwt.sign({ id: userId, type: user_type }, secretKey, {
            expiresIn: "1h",
          });

          return res.status(201).json({
            code: 200,
            status: "success",
            message: "User registered successfully",
            user_id: userId,
            uuid: uuid,
            email: email,
            userType: user_type,
            PhoneNumber: phoneNumber,
            token: token,
            paymentStatus: paymentStatus,
            profileCreationStatus: profileCreationStatus,
            longitude: longitude,
            latitude: latitude,
          });
        }
      });
    }
  });
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Password Reset ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`

app.put("/update-password/:user_id", (req, res) => {
  const { user_id } = req.params;
  const { newPassword } = req.body;

  if (!user_id || !newPassword) {
    res.status(400).json({
      code: 400,
      status: "fail",
      message: "userId and newPassword are required",
    });
    return;
  }

  const checkUserSql = "SELECT * FROM users WHERE user_id=?";
  connection.query(checkUserSql, user_id, (err, results) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res.sendStatus(500);
    } else if (results.length === 0) {
      res
        .status(404)
        .json({ code: 404, status: "fail", message: "User not found" });
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
              StatusCode: 200,
              status: "success",
              message: "User password reset successfully",
            });
          }
        }
      );
    }
  });
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Password Reset ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`

app.put("/update-profile-status/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const newStatus = req.body.profileCreationStatus;

  connection.query(
    "UPDATE users SET profileCreationStatus=? WHERE user_id=?",
    [newStatus, userId],
    (err, result) => {
      if (err) {
        console.error("Error updating profile status: " + err.stack);
        res.status(500).json({
          code: 500,
          status: "error",
          message: "Could not update profile status",
        });
      } else if (result.affectedRows === 0) {
        res.status(404).json({
          code: 404,
          status: "error",
          message: "User not found",
        });
      } else {
        res.status(200).json({
          code: 200,
          status: "success",
          message: "Profile status updated successfully",
        });
      }
    }
  );
});

app.get("/", (req, res) => {
  res.send("Health App server is running.");
});

module.exports = app;
