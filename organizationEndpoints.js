const express = require("express");
const router = express.Router();
const connection = require("./db");
const { authenticate, queryError } = require("./middlewares");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Organization Info ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Add new organization info
router.post("/organization-info", authenticate, (req, res) => {
  const data = req.body;

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    // Check if required fields are missing
    if (
      !data.name ||
      !data.type ||
      !data.email ||
      !data.phoneNumber ||
      !data.city ||
      !data.subCity ||
      !data.wereda ||
      !data.houseNo ||
      !data.tinNo ||
      !data.contactPersonName ||
      !data.contactPersonPosition ||
      !data.contactPersonNumber
    ) {
      res
        .status(400)
        .json({ message: "Missing required fields", statusCode: 400 });
    } else {
      // Check if email format is valid
      if (!/\S+@\S+\.\S+/.test(data.email)) {
        res
          .status(400)
          .json({ message: "Invalid email format", statusCode: 400 });
      } else {
        connection.query(
          "INSERT INTO HealthOrganization (user_id, OrganizationName, OrganizationType, EmailAddress, PhoneNumber, city, subCity, wereda, houseNo, tinNo, ContactPerson_Name, ContactPerson_Position, ContactPerson_Number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            req.user.id,
            data.name,
            data.type,
            data.email,
            data.phoneNumber,
            data.city,
            data.subCity,
            data.wereda,
            data.houseNo,
            data.tinNo,
            data.contactPersonName,
            data.contactPersonPosition,
            data.contactPersonNumber,
          ],
          (err) => {
            if (err)
              return queryError(res, err, "Failed to Add organization info");
            res.status(200).json({
              message: "Organization info added successfully",
              statusCode: 200,
            });
          }
        );
      }
    }
  }
});

// Get organization info
router.get("/organization-info/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  }

  // else if (req.user.paymentStatus !== "paid") {
  //   res.status(403).json({
  //     message: "Please Complete payment to access this endpoint ! ",
  //     statusCode: 403,
  //   });
  // }
  else {
    connection.query(
      "SELECT * FROM HealthOrganization WHERE OrganizationID=?",
      [id],
      (err, results) => {
        if (err)
          return queryError(res, err, "Failed to fetch organization info");
        if (results.length === 0) {
          res
            .status(404)
            .json({ message: "Organization not found", statusCode: 404 });
        } else {
          res.status(200).json({
            data: results[0],
            totalCount: results.length,
            statusCode: 200,
          });
        }
      }
    );
  }
});

// Update organization info
router.put("/organization-info/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else if (req.user.paymentStatus !== "paid") {
    res.status(403).json({
      message: "Please Complete payment to access this endpoint ! ",
      statusCode: 403,
    });
  } else {
    // Check if required fields are missing
    if (
      !data.name ||
      !data.type ||
      !data.email ||
      !data.phoneNumber ||
      !data.city ||
      !data.subCity ||
      !data.wereda ||
      !data.houseNo ||
      !data.tinNo ||
      !data.contactPersonName ||
      !data.contactPersonPosition ||
      !data.contactPersonNumber
    ) {
      res
        .status(400)
        .json({ message: "Missing required fields", statusCode: 400 });
    } else {
      // Check if email format is valid
      if (!/\S+@\S+\.\S+/.test(data.email)) {
        res
          .status(400)
          .json({ message: "Invalid email format", statusCode: 400 });
      } else {
        connection.query(
          "UPDATE HealthOrganization SET OrganizationName=?, OrganizationType=?, EmailAddress=?, PhoneNumber=?, city=?, subCity=?, wereda=?, houseNo=?, tinNo=?, ContactPerson_Name=?, ContactPerson_Position=?, ContactPerson_Number=? WHERE OrganizationID=?",
          [
            data.name,
            data.type,
            data.email,
            data.phoneNumber,
            data.city,
            data.subCity,
            data.wereda,
            data.houseNo,
            data.tinNo,
            data.contactPersonName,
            data.contactPersonPosition,
            data.contactPersonNumber,
            id,
          ],
          (err) => {
            if (err)
              return queryError(res, err, "Failed to update organization info");
            res.status(200).json({
              message: "Organization info updated successfully",
              statusCode: 200,
            });
          }
        );
      }
    }
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Legal Documents  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Add new document to an organization
router.post("/documents/:uid", authenticate, (req, res) => {
  const uid = req.params.uid;
  const data = req.body;

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else if (req.user.paymentStatus !== "paid") {
    res.status(403).json({
      message: "Please Complete payment to access this endpoint ! ",
      statusCode: 403,
    });
  } else {
    // Check if required fields are missing
    if (!data.documentName || !data.documentPath) {
      res
        .status(400)
        .json({ message: "Missing required fields", statusCode: 400 });
    } else {
      connection.query(
        "INSERT INTO LegalDocs (OrganizationID, documentName, documentPath) VALUES (?, ?, ?)",
        [uid, data.documentName, data.documentPath],
        (err) => {
          if (err) return queryError(res, err, "Failed to add new document");
          res
            .status(200)
            .json({ message: "Document added successfully", statusCode: 200 });
        }
      );
    }
  }
});

// Get documents of an organization
router.get("/documents/:uid", authenticate, (req, res) => {
  const uid = req.params.uid;

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else if (req.user.paymentStatus !== "paid") {
    res.status(403).json({
      message: "Please Complete payment to access this endpoint ! ",
      statusCode: 403,
    });
  } else {
    connection.query(
      "SELECT * FROM LegalDocs WHERE OrganizationID=?",
      [uid],
      (err, results) => {
        if (err) return queryError(res, err, "Failed to fetch documents");
        res
          .status(200)
          .json({ data: results, totalCount: results.length, statusCode: 200 });
      }
    );
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ List of Professionals  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

router.get("/professionals", authenticate, (req, res) => {
  if (req.user.type !== "organization" && req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else if (req.user.paymentStatus !== "paid") {
    res.status(403).json({
      message: "Please Complete payment to access this endpoint! ",
      statusCode: 403,
    });
  } else {
    connection.query(
      "SELECT *, (SELECT EducationLevel FROM EduWorkExperience WHERE EduWorkExperience.ProfessionalID = HealthProfessional.id LIMIT 1) AS EducationLevel, (SELECT WorkExperienceYear FROM EduWorkExperience WHERE EduWorkExperience.ProfessionalID = HealthProfessional.id LIMIT 1) AS WorkExperienceYear FROM HealthProfessional",
      (err, results) => {
        if (err)
          return queryError(res, err, "Failed to fetch professionals list");
        res.status(200).json({
          data: results,
          totalCount: results.length,
          statusCode: 200,
        });
      }
    );
  }
});

router.get("/professional/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else if (req.user.paymentStatus !== "paid") {
    res.status(403).json({
      message: "Please Complete payment to access this endpoint! ",
      statusCode: 403,
    });
  } else {
    connection.query(
      "SELECT *, (SELECT EducationLevel FROM EduWorkExperience WHERE EduWorkExperience.ProfessionalID = HealthProfessional.id LIMIT 1) AS EducationLevel, (SELECT WorkExperienceYear FROM EduWorkExperience WHERE EduWorkExperience.ProfessionalID = HealthProfessional.id LIMIT 1) AS WorkExperienceYear FROM HealthProfessional WHERE id=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err, "Failed to fetch professional");
        res.status(200).json({
          data: results,
          totalCount: results.length,
          statusCode: 200,
        });
      }
    );
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ JOB POSTS  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// List All Jobs Posted By Org
router.get("/my-jobs/all/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else if (req.user.paymentStatus !== "paid") {
    res.status(403).json({
      message: "Please Complete payment to access this endpoint ! ",
      statusCode: 403,
    });
  } else {
    connection.query(
      "SELECT * FROM JobPosts WHERE organizationId=? AND status='active'",
      [id],
      (err, results) => {
        if (err) return queryError(res, err, "Failed to fetch job postings");
        res
          .status(200)
          .json({ data: results, totalCount: results.length, statusCode: 200 });
      }
    );
  }
});

//Add a new Job Post
router.post("/my-jobs", authenticate, (req, res) => {
  const data = req.body;

  // Validate input
  if (
    !data.organizationId ||
    !data.jobPosition ||
    !data.salary ||
    !data.deadline ||
    !data.jobType ||
    !data.experienceLevel ||
    !data.workLocation ||
    !data.category ||
    !data.numberOfEmployees ||
    !data.prerequisites ||
    !data.rolesAndResponsibilities
  ) {
    return res
      .status(400)
      .json({ message: "Missing required field(s)", statusCode: 400 });
  }

  // Validate the salary field
  // if (!/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(data.salary)) {
  //   return res
  //     .status(400)
  //     .json({ message: "Invalid salary format", statusCode: 400 });
  // }

  // Validate the deadline field
  // if (!/^\d{4}-\d{2}-\d{2}$/.test(data.deadline)) {
  //   return res.status(400).json({
  //     message: "Invalid deadline format (YYYY-MM-DD)",
  //     statusCode: 400,
  //   });
  // }

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    return res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else if (req.user.paymentStatus !== "paid") {
    return res.status(403).json({
      message: "Please Complete payment to access this endpoint ! ",
      statusCode: 403,
    });
  }
  connection.query(
    "INSERT INTO JobPosts (organizationId, jobPosition, salary, deadline, jobType, experienceLevel, workLocation, category, numberOfEmployees, prerequisites, descriptions, rolesAndResponsibilities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      data.organizationId,
      data.jobPosition,
      data.salary,
      data.deadline,
      data.jobType,
      data.experienceLevel,
      data.workLocation,
      data.category,
      data.numberOfEmployees,
      data.prerequisites,
      data.descriptions,
      data.rolesAndResponsibilities,
    ],
    (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Failed to create job posting", statusCode: 500 });
      }
      res.status(200).json({
        message: "Job posting created successfully",
        statusCode: 200,
      });
    }
  );
});

// Get a single Job Post By ID
router.get("/my-jobs/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else if (req.user.paymentStatus !== "paid") {
    res.status(403).json({
      message: "Please Complete payment to access this endpoint ! ",
      statusCode: 403,
    });
  } else {
    connection.query(
      "SELECT * FROM JobPosts WHERE JobID=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err, "Failed to fetch job posting");
        if (results.length === 0) {
          return res
            .status(404)
            .json({ message: "Job posting not found", statusCode: 404 });
        }
        res.status(200).json({
          message: "Job posting fetched successfully",
          statusCode: 200,
          data: results[0],
        });
      }
    );
  }
});

// Update a Job Post for org
router.put("/my-jobs/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else if (req.user.paymentStatus !== "paid") {
    res.status(403).json({
      message: "Please Complete payment to access this endpoint ! ",
      statusCode: 403,
    });
  } else {
    // Validate input
    if (
      !data.jobPosition ||
      !data.salary ||
      !data.deadline ||
      !data.jobType ||
      !data.numberOfEmployees ||
      !data.prerequisites ||
      !data.rolesAndResponsibilities
    ) {
      return res
        .status(400)
        .json({ message: "Missing required field(s)", statusCode: 400 });
    }

    // Validate the salary field
    if (!/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(data.salary)) {
      return res
        .status(400)
        .json({ message: "Invalid salary format", statusCode: 400 });
    }

    // Validate the deadline field
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.deadline)) {
      return res.status(400).json({
        message: "Invalid deadline format (YYYY-MM-DD)",
        statusCode: 400,
      });
    }

    connection.query(
      "UPDATE JobPosts SET jobPosition=?, salary=?, deadline=?, jobType=?, numberOfEmployees=?, prerequisites=?, Descriptions=?, rolesAndResponsibilities=? WHERE JobID=? AND organizationId=?",
      [
        data.jobPosition,
        data.salary,
        data.deadline,
        data.jobType,
        data.numberOfEmployees,
        data.prerequisites,
        data.descriptions,
        data.rolesAndResponsibilities,
        id,
        data.organizationId,
      ],
      (err) => {
        if (err) return queryError(res, err, "Failed to update job posting");
        res.status(200).json({
          message: "Job posting updated successfully",
          statusCode: 200,
        });
      }
    );
  }
});

// Delete a Job Post
router.delete("/job-posts/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
    return;
  } else if (req.user.paymentStatus !== "paid") {
    res.status(403).json({
      message: "Please Complete payment to access this endpoint ! ",
      statusCode: 403,
    });
    return;
  }

  connection.query(
    "UPDATE JobPosts SET status='deleted' WHERE JobID=? ",
    [id],
    (err, result) => {
      console.log("result.affected rows " + result.affectedRows);
      if (err) {
        return queryError(res, err, "Failed to delete job post");
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "No matching record found for the given id",
          statusCode: 404,
        });
      }

      res.status(200).json({
        message: "Job post deleted successfully",
        status: 200,
        totalCount: 1,
      });
    }
  );
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ JOB Applications  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Lists JOB applications for an organization

router.get("/applied/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else if (req.user.paymentStatus !== "paid") {
    res.status(403).json({
      message: "Please Complete payment to access this endpoint ! ",
      statusCode: 403,
    });
  } else {
    connection.query(
      "SELECT * FROM Applications JOIN JobPosts ON Applications.jobId = JobPosts.JobID WHERE JobPosts.organizationId=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err, "Failed to list job applications");
        res
          .status(200)
          .json({ data: results, totalCount: results.length, statusCode: 200 });
      }
    );
  }
});

router.get("/myJobPost/:org_id/applicants", authenticate, (req, res) => {
  const id = req.params.org_id;

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    return res.status(403).json({ message: "Access denied", statusCode: 403 });
  }

  if (req.user.paymentStatus !== "paid") {
    return res.status(403).json({
      message: "Please complete payment to access this endpoint!",
      statusCode: 403,
    });
  }

  const query =
    "SELECT JobPosts.*, IFNULL(COUNT(Applications.id), 0) AS ApplicantCount, IF(IFNULL(COUNT(Applications.id), 0) > 0, JSON_ARRAYAGG(JSON_OBJECT('id', HealthProfessional.id, 'firstName', HealthProfessional.firstName, 'lastName', HealthProfessional.lastName, 'email', HealthProfessional.email, 'Age', HealthProfessional.Age, 'Gender', HealthProfessional.Gender, 'city', HealthProfessional.city, 'subCity', HealthProfessional.subCity, 'wereda', HealthProfessional.wereda, 'profession', HealthProfessional.profession)), JSON_ARRAY()) AS Applicants " +
    "FROM JobPosts " +
    "LEFT JOIN Applications ON JobPosts.JobID = Applications.jobId " +
    "LEFT JOIN HealthProfessional ON Applications.professionalId = HealthProfessional.id " +
    "WHERE JobPosts.OrganizationID = ? " +
    "GROUP BY JobPosts.JobID";

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to list job posts", error: err });
    }

    res.status(200).json({
      statusCode: 200,
      total_Job_Posts: results.length,

      data: results,
    });
  });
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Searching ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Search Professionals by name
router.get("/searchByName", authenticate, (req, res) => {
  const name = req.query.name;

  if (req.user.type !== "organization" && req.user.type !== "admin") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else if (req.user.paymentStatus !== "paid") {
    res.status(403).json({
      message: "Please Complete payment to access this endpoint ! ",
      statusCode: 403,
    });
  } else {
    connection.query(
      "SELECT * FROM HealthProfessional WHERE CONCAT(firstName, ' ', lastName) LIKE ?",
      ["%" + name + "%"],
      (err, results) => {
        if (err) return queryError(res, err, "Failed to search professionals");
        res
          .status(200)
          .json({ data: results, status: 200, totalCount: results.length });
      }
    );
  }
});

module.exports = router;
