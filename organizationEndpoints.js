const express = require("express");
const router = express.Router();
const connection = require("./db");
const { authenticate, queryError } = require("./middlewares");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Organization Info ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Add new organization info
router.post("/organization-info", authenticate, (req, res) => {
  const data = req.body;

  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" , statusCode: 403 });
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
        if (err) return queryError(res, err, "Failed to Add organization info");
        res
          .status(200)
          .json({
            message: "Organization info added successfully",
            statusCode: 200,
          });
      }
    );
  }
});

// Get organization info
router.get("/organization-info/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
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
          res
            .status(200)
            .json({
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

  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
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
        res
          .status(200)
          .json({
            message: "Organization info updated successfully",
            statusCode: 200,
          });
      }
    );
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Legal Documents  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Add new document to an organization
router.post("/documents/:uid", authenticate, (req, res) => {
  const uid = req.params.uid;
  const data = req.body;

  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
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
});

// Get documents of an organization
router.get("/documents/:uid", authenticate, (req, res) => {
  const uid = req.params.uid;

  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
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
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query("SELECT * FROM HealthProfessional", (err, results) => {
      if (err)
        return queryError(res, err, "Failed to fetch professionals list");
      res
        .status(200)
        .json({ data: results, totalCount: results.length, statusCode: 200 });
    });
  }
});

router.get("/professional/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "SELECT * FROM HealthProfessional WHERE  id=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err, "Failed to fetch professional");
        res
          .status(200)
          .json({ data: results, totalCount: results.length, statusCode: 200 });
      }
    );
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ JOB POSTS  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// List All Jobs Posted By Org
router.get("/my-jobs/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "SELECT * FROM JobPosts WHERE organizationId=?",
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

  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "INSERT INTO JobPosts (organizationId, jobPosition, salary, deadline, jobType, numberOfEmployees, prerequisites,Descriptions, rolesAndResponsibilities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.organizationId,
        data.jobPosition,
        data.salary,
        data.deadline,
        data.jobType,
        data.numberOfEmployees,
        data.prerequisites,
        data.descriptions,
        data.rolesAndResponsibilities,
      ],
      (err) => {
        if (err) return queryError(res, err, "Failed to create job post");
        res
          .status(200)
          .json({
            message: "Job posting created successfully",
            statusCode: 200,
          });
      }
    );
  }
});

// Get a single Job Post By ID
router.get("/my-jobs/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query("SELECT FROM JobPosts WHERE id=?", [id], (err) => {
      if (err) return queryError(res, err, "Failed to fetch job posting");
      res
        .status(200)
        .json({ message: "Job posting fetched successfully", statusCode: 200 });
    });
  }
});

// Update a Job Post for org
router.put("/my-jobs/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "UPDATE JobPosts SET jobPosition=?, salary=?, deadline=?, jobType=?, numberOfEmployees=?, prerequisites=?, Descriptions=?, rolesAndResponsibilities=? WHERE id=? AND organizationId=?",
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
        res
          .status(200)
          .json({
            message: "Job posting updated successfully",
            statusCode: 200,
          });
      }
    );
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ JOB Applications  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Lists JOB applications for an organization

router.get("/applied/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "SELECT * FROM Applications JOIN JobPosts ON Applications.jobId = JobPosts.id WHERE JobPosts.organizationId=?",
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

module.exports = router;
