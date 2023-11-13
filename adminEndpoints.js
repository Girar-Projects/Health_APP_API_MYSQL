const express = require("express");
const router = express.Router();
const connection = require("./db");
const { authenticate, queryError } = require("./middlewares");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Organization Info ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Get organization info
router.get("/organizations-List", authenticate, (req, res) => {
  if (req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query("SELECT * FROM HealthOrganization", (err, results) => {
      // release connection back to pool

      if (err) return queryError(res, err, "Failed to fetch organization info");
      if (results.length === 0) {
        res
          .status(404)
          .json({ message: "Organization not found", statusCode: 404 });
      } else {
        res.status(200).json({
          data: results,
          totalCount: results.length,
          statusCode: 200,
        });
      }
    });
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Professional Info ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Get organization info

router.get("/Professionals-List", authenticate, (req, res) => {
  if (req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    const getProfessionalsQuery = `SELECT * FROM HealthProfessional`;

    connection.query(getProfessionalsQuery, (err, results) => {
      if (err)
        return queryError(res, err, "Failed to fetch professionals info");
      if (results.length === 0) {
        res
          .status(404)
          .json({ message: "HealthProfessional not found", statusCode: 404 });
      } else {
        const userIds = results.map((result) => result.user_id);
        const getUserQuery = `SELECT user_id, paymentStatus, profileCreationStatus FROM users WHERE user_id IN (${userIds.join(
          ","
        )})`;

        connection.query(getUserQuery, (err, userResults) => {
          if (err) return queryError(res, err, "Failed to fetch user status");

          const userMap = {};
          userResults.forEach((user) => {
            userMap[user.user_id] = user;
          });

          const professionals = results.map((result) => {
            const userStatus = userMap[result.user_id];
            return {
              id: result.id,
              user_id: result.user_id,
              firstName: result.firstName,
              lastName: result.lastName,
              phoneNumber: result.phoneNumber,
              Age: result.Age,
              Gender: result.Gender,
              city: result.city,
              subCity: result.subCity,
              wereda: result.wereda,
              email: result.email,
              profession: result.profession,
              languages: result.languages,
              Skills: result.Skills,
              paymentStatus: userStatus.paymentStatus,
              profileCreationStatus: userStatus.profileCreationStatus,
            };
          });

          res.status(200).json({
            data: professionals,
            totalCount: professionals.length,
            statusCode: 200,
          });
        });
      }
    });
  }
});



// Add new request from organization
router.post("/professional-request", authenticate, (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ message: "Access denied", statusCode: 403 });
  }

  const {
    organizationID,
    ProffesionalType,
    Gender,
    WorkPlace,
    ExperienceLevel,
    PhoneNumber,
    RequesterFullName,
    RequestDate,
    numberofproffesioals,
  } = req.body;

  connection.query(
    "INSERT INTO ProfessionalRequest (organizationID, ProffesionalType, Gender, WorkPlace, ExperienceLevel, PhoneNumber, RequesterFullName, RequestDate, numberofproffesioals, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      organizationID,
      ProffesionalType,
      Gender,
      WorkPlace,
      ExperienceLevel,
      PhoneNumber,
      RequesterFullName,
      RequestDate,
      numberofproffesioals,
      "Pending",
    ],
    (err, results) => {
      if (err)
        return queryError(
          res,
          err,
          "Failed to add new request from organization"
        );
      res.status(200).json({
        data: {
          RequestID: results.insertId,
          organizationID: req.user.id,
          ProffesionalType,
          Gender,
          WorkPlace,
          ExperienceLevel,
          PhoneNumber,
          RequesterFullName,
          RequestDate,
          numberofproffesioals,
          status: "Pending",
        },
        message: "Request added successfully",
        statusCode: 200,
      });
    }
  );
});




// Add user to JobOffers table
router.post("/job-offer", authenticate, (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ message: "Access denied", statusCode: 403 });
  }

  const { RequestID, ProffesionalID, OfferDate, OfferStatus, OrganizationID } =
    req.body;

  connection.query(
    "INSERT INTO JobOffers ( RequestID, ProffesionalID, OfferDate, OfferStatus, OrganizationID) VALUES (?, ?, ?, ?, ?, ?)",
    [RequestID, ProffesionalID, OfferDate, OfferStatus, OrganizationID],
    (err, results) => {
      if (err) {
        return queryError(res, err, "Failed to add user to JobOffers table");
      }
      res.status(200).json({
        data: {
          RequestID,
          ProffesionalID,
          OfferDate,
          OfferStatus,
          OrganizationID,
        },
        message: "Users added to JobOffers table",
        statusCode: 200,
      });
    }
  );
});



// Get JobOffers assigned to the user
router.get("/job-offers/:id", authenticate, (req, res) => {
  if (req.user.type !== "admin") {
    return res
      .status(403)
      .json({
        message:
          "Access is denied. You must be signed in as a admin to view this resource.",
        statusCode: 403,
      });
  }
  const sql = "SELECT * FROM JobOffers WHERE ProffesionalID = ?";
  const userId = req.params.id;

  connection.query(sql, [userId], (err, results) => {
    if (err) return queryError(res, err, "Failed to fetch job offers");
    if (results.length === 0) {
      res.status(404).json({
        message: `No job offer for user with id ${userId} found`,
        statusCode: 404,
      });
    } else {
      res.status(200).json({
        data: results,
        totalCount: results.length,
        statusCode: 200,
      });
    }
  });
});

//update payment status in transaction table
router.put("/transaction/:id/payment", authenticate, (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ message: "Access denied", statusCode: 403 });
  }

  const { id } = req.params;
  const { currentPaymentStatus } = req.body;

  connection.query(
    "UPDATE TransactionDetails SET currentPaymentStatus = ? WHERE id = ?",
    [currentPaymentStatus, id],
    (err, results) => {
      if (err) {
        return queryError(
          res,
          err,
          "Failed to update payment status for transaction"
        );
      }
      if (results.affectedRows === 0) {
        res.status(404).json({
          message: `Transaction with id ${id} not found.`,
          statusCode: 404,
        });
      } else {
        res.status(200).json({
          message: "Payment status for transaction updated successfully",
          statusCode: 200,
        });
      }
    }
  );
});

// Get all transaction details for a user
router.get("/user/:id/transactions", authenticate, (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ message: "Access denied", statusCode: 403 });
  }

  const userId = req.params.id;

  connection.query(
    "SELECT * FROM TransactionDetails WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        return queryError(res, err, "Failed to fetch transaction details");
      }
      res.status(200).json({
        data: results,
        totalCount: results.length,
        statusCode: 200,
      });
    }
  );
});

// Get all transaction details where not Completed
router.get("/user/:id/transactions", authenticate, (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ message: "Access denied", statusCode: 403 });
  }

  const userId = req.params.id;

  connection.query(
    "SELECT * FROM TransactionDetails WHERE currentPaymentStatus != 'Paid'",
    [userId],
    (err, results) => {
      if (err) {
        return queryError(res, err, "Failed to fetch transaction details");
      }
      res.status(200).json({
        data: results,
        totalCount: results.length,
        statusCode: 200,
      });
    }
  );
});

module.exports = router;
