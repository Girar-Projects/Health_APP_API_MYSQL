const express = require("express");
const router = express.Router();
const connection = require("./db");
const { authenticate, queryError } = require("./middlewares");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Personal-info ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Add new Health-professional
router.post("/personal-info", authenticate, (req, res) => {
  const data = req.body;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    // Check if user_id field is present and has a valid value
    if (!data.user_id || isNaN(data.user_id)) {
      return res
        .status(400)
        .json({ message: "Invalid user ID", statusCode: 400 });
    }

    connection.query(
      "SELECT * FROM HealthProfessional WHERE user_id=?",
      [data.user_id],
      (err, results) => {
        if (err)
          return queryError(
            res,
            err,
            "Failed to check if professional already exists"
          );
        if (results.length > 0) {
          res.status(400).json({ message: "Professional already exists" });
        } else {
          // Validate input
          if (
            !data.firstName ||
            !data.lastName ||
            !data.Age ||
            !data.Gender ||
            !data.city ||
            !data.subCity ||
            !data.wereda ||
            !data.email ||
            !data.phoneNumber ||
            !data.profession ||
            !data.languages ||
            !data.Skills
          ) {
            return res
              .status(400)
              .json({ message: "Missing required field(s)", statusCode: 400 });
          }

          // Validate the email field
          // if (!/\S+@\S+\.\S+/.test(data.email)) {
          //   return res
          //     .status(400)
          //     .json({ message: "Invalid email format", statusCode: 400 });
          // }

          connection.query(
            "INSERT INTO HealthProfessional (user_id, firstName, lastName, Age, Gender, city, subCity, wereda, email, phoneNumber, profession, languages, Skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              data.user_id,
              data.firstName,
              data.lastName,
              data.Age,
              data.Gender,
              data.city,
              data.subCity,
              data.wereda,
              data.email,
              data.phoneNumber,
              data.profession,
              data.languages,
              data.Skills,
            ],
            (err) => {
              if (err)
                return queryError(
                  res,
                  err,
                  "Failed to create professional profile"
                );
              res.status(200).json({
                message: "Professional created successfully",
                status: 200,
                totalCount: 1,
              });
            }
          );
        }
      }
    );
  }
});

//Get single Professional
router.get("/personal-info/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "SELECT * FROM HealthProfessional WHERE id=?",
      [id],
      (err, results) => {
        if (err)
          return queryError(res, err, "Failed to fetch professional profile");
        res
          .status(200)
          .json({ data: results, status: 200, totalCount: results.length });
      }
    );
  }
});

//Update Single Professional
// Update Single Professional
router.put("/personal-info/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    // Validate input
    if (!id) {
      return res
        .status(400)
        .json({ message: "Missing id parameter", statusCode: 400 });
    }

    // Validate the Age field
    if (data.Age && (!Number.isInteger(data.Age) || data.Age < 0)) {
      return res
        .status(400)
        .json({ message: "Invalid age format", statusCode: 400 });
    }

    // Validate the phoneNumber field
    // if (data.phoneNumber && !/^\d{12}$/.test(data.phoneNumber)) {
    //   return res
    //     .status(400)
    //     .json({ message: "Invalid phone number format", statusCode: 400 });
    // }

    // Validate the email field
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format", statusCode: 400 });
    }

    connection.query(
      "UPDATE HealthProfessional SET firstName=?, lastName=?, Age=?, Gender=?, city=?, subCity=?, wereda=?, email=?, phoneNumber=?, profession=?, languages=?, Skills=? WHERE id=? AND user_id=?",
      [
        data.firstName,
        data.lastName,
        data.Age,
        data.Gender,
        data.city,
        data.subCity,
        data.wereda,
        data.email,
        data.phoneNumber,
        data.profession,
        data.languages,
        data.Skills,
        id,
        req.user.user_id,
      ],
      (err) => {
        if (err)
          return queryError(res, err, "Failed to update professional profile");
        res.status(200).json({
          message: "Personal info updated successfully",
          status: 200,
          totalCount: 1,
        });
      }
    );
  }
});

// List all professionals
router.get("/all", authenticate, (req, res) => {
  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query("SELECT * FROM HealthProfessional", (err, results) => {
      if (err)
        return queryError(res, err, "Failed to fetch professionals list");
      res
        .status(200)
        .json({ data: results, status: 200, totalCount: results.length });
    });
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Experience- Skill ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Add new education and work experience for a professional
router.post("/edu-work-experience/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "INSERT INTO EduWorkExperience (ProfessionalID, EducationLevel, WorkExperienceYear, employerName, positionHeld, startingDate, endingDate, mainResponsibilities) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        data.educationLevel,
        data.workExperienceYear,
        data.employerName,
        data.positionHeld,
        data.startingDate,
        data.endingDate,
        data.mainResponsibilities,
      ],
      (err) => {
        if (err)
          return queryError(
            res,
            err,
            "Failed to add education and work experience"
          );
        res.status(200).json({
          message: "Education and work experience added successfully",
          status: 200,
          totalCount: 1,
        });
      }
    );
  }
});

// Get education and work experience for a professional
router.get("/edu-work-experience/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "SELECT * FROM EduWorkExperience WHERE ProfessionalID=?",
      [id],
      (err, results) => {
        if (err)
          return queryError(
            res,
            err,
            "Failed to fetch education and work experience"
          );
        res
          .status(200)
          .json({ data: results, status: 200, totalCount: results.length });
      }
    );
  }
});

// Update education and work experience for a professional
router.put("/edu-work-experience/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "UPDATE EduWorkExperience SET EducationLevel=?, WorkExperienceYear=?, employerName=?, positionHeld=?, startingDate=?, endingDate=?, mainResponsibilities=? WHERE id=?",
      [
        data.educationLevel,
        data.workExperienceYear,
        data.employerName,
        data.positionHeld,
        data.startingDate,
        data.endingDate,
        data.mainResponsibilities,
        id,
      ],
      (err) => {
        if (err)
          return queryError(
            res,
            err,
            "Failed to update education and work experience"
          );
        res.status(200).json({
          message: "Education and work experience updated successfully",
          status: 200,
          totalCount: 1,
        });
      }
    );
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Documents ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Add new Document Path for Professional
router.post("/documents/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "INSERT INTO ProfessionalDocuments (documentTitle, documentPath, professionalId) VALUES (?, ?, ?)",
      [data.documentTitle, data.documentPath, id],
      (err) => {
        if (err) return queryError(res, err, "Failed to add new document path");
        res.status(200).json({
          message: "Document added successfully",
          status: 200,
          totalCount: 1,
        });
      }
    );
  }
});

//Get document for a professional
router.get("/documents/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "SELECT * FROM ProfessionalDocuments WHERE professionalId=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err, "Failed to fetch document");
        res
          .status(200)
          .json({ data: results, status: 200, totalCount: results.length });
      }
    );
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ JOB APPLICATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Add new Job Application
router.post("/apply", authenticate, (req, res) => {
  const data = req.body;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    // Validate input
    if (!data.professionalId || !data.jobId) {
      return res
        .status(400)
        .json({ message: "Missing required field(s)", statusCode: 400 });
    }

    connection.query(
      "INSERT INTO Applications (professionalId, jobId) VALUES (?, ?)",
      [data.professionalId, data.jobId],
      (err) => {
        if (err)
          return queryError(res, err, "Failed to submit job application");
        res.status(200).json({
          message: "Job application submitted successfully",
          status: 200,
          totalCount: 1,
        });
      }
    );
  }
});

//List all Applied Jobs for a single Professional
router.get("/my-applied", authenticate, (req, res) => {
  const id = req.user.id;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "SELECT * FROM Applications WHERE professionalId=?",
      [id],
      (err, results) => {
        if (err)
          return queryError(res, err, "Failed to fetch list of applied jobs");
        res
          .status(200)
          .json({ data: results, status: 200, totalCount: results.length });
      }
    );
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Bookmarked JOBS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Add new Bookmarked Jobs
router.post("/bookmark", authenticate, (req, res) => {
  const data = req.body;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "INSERT INTO Bookmarks (professionalId, jobId) VALUES (?,?)",
      [data.professionalId, data.jobId],
      (err) => {
        if (err) return queryError(res, err, "Failed to add bookmarked job");
        res.status(200).json({
          message: "Bookmark Added successfully",
          status: 200,
          totalCount: 1,
        });
      }
    );
  }
});

//Get All bookmarked Jobs
router.get("/bookmarks", authenticate, (req, res) => {
  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query("SELECT * FROM Bookmarks", (err, results) => {
      if (err)
        return queryError(res, err, "Failed to fetch list of bookmarked jobs");
      res
        .status(200)
        .json({ data: results, status: 200, totalCount: results.length });
    });
  }
});

//Get single bookmark job based on its ID
router.get("/bookmark/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "SELECT * FROM Bookmarks WHERE id=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err, "Failed to fetch bookmarked job");
        res
          .status(200)
          .json({ data: results, status: 200, totalCount: results.length });
      }
    );
  }
});

//Get bookmarks For single Professional
router.get("/bookmark/:professionalId", authenticate, (req, res) => {
  const id = req.params.professionalId;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    connection.query(
      "SELECT * FROM Bookmarks WHERE professionalId=?",
      [professionalId],
      (err, results) => {
        if (err)
          return queryError(
            res,
            err,
            "Failed to fetch list of bookmarked jobs"
          );
        res
          .status(200)
          .json({ data: results, status: 200, totalCount: results.length });
      }
    );
  }
});

// Delete a bookmarked job
// Delete a bookmarked job
router.delete("/bookmark/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    // Validate input
    if (!id) {
      return res
        .status(400)
        .json({ message: "Missing id parameter", statusCode: 400 });
    }

    connection.query(
      "DELETE FROM Bookmarks WHERE id=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err, "Failed to delete bookmarked job");
        // Validate the result
        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Bookmark not found", statusCode: 404 });
        }
        res.status(200).json({
          message: "Bookmark removed successfully",
          status: 200,
          totalCount: 1,
        });
      }
    );
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ JOB POSTS  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// List All Jobs Posted By Org
router.get("/my-jobs", authenticate, (req, res) => {
  const id = req.params.id;
  const category = req.query.category; // retrieve category parameter from request

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
  } else {
    let query = "SELECT * FROM JobPosts";
    let values = [id];
    if (category) { // if category parameter is passed, add WHERE clause
      query += " WHERE Category = ?";
      values.push(category);
    }
    connection.query(query, values, (err, results) => {
      if (err) return queryError(res, err, "Failed to fetch job postings");
      res
        .status(200)
        .json({ data: results, totalCount: results.length, statusCode: 200 });
    });
  }
});



// Get a single Job Post By ID
router.get("/my-jobs/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied", statusCode: 403 });
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

module.exports = router;
