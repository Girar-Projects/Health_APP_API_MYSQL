const express = require("express");
const router = express.Router();
const connection = require("./db");
const { authenticate, queryError } = require("./middlewares");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Personal-info ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Add new Health-professional
router.post("/personal-info", authenticate, (req, res) => {
  const data = req.body;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM HealthProfessional WHERE user_id=?",
      [req.user.user_id],
      (err, results) => {
        if (err) return queryError(res, err);
        if (results.length > 0) {
          res.status(400).json({ message: "Professional already exists" });
        } else {
          connection.query(
            "INSERT INTO HealthProfessional (user_id, firstName, lastName, Age, Gender, city, subCity, wereda, email, phoneNumber, profession, languages, Skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              req.user.user_id,
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
              if (err) return queryError(res, err);
              res.json({ message: "Professional created successfully" });
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
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM HealthProfessional WHERE id=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

//Update Single Professional
router.put("/personal-info/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
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
        if (err) return queryError(res, err);
        res.json({ message: "Personal info updated successfully" });
      }
    );
  }
});

// List all professionals
router.get("/all", authenticate, (req, res) => {
  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query("SELECT * FROM HealthProfessional", (err, results) => {
      if (err) return queryError(res, err);
      res.json(results);
    });
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Experience- Skill ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Add new education and work experience for a professional
router.post("/edu-work-experience/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
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
        if (err) return queryError(res, err);
        res.json({
          message: "Education and work experience added successfully",
        });
      }
    );
  }
});

// Get education and work experience for a professional
router.get("/edu-work-experience/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM EduWorkExperience WHERE ProfessionalID=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

// Update education and work experience for a professional
router.put("/edu-work-experience/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
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
        if (err) return queryError(res, err);
        res.json({
          message: "Education and work experience updated successfully",
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
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "INSERT INTO ProfessionalDocuments (documentTitle, documentPath, professionalId) VALUES (?, ?, ?)",
      [data.documentTitle, data.documentPath, id],
      (err) => {
        if (err) return queryError(res, err);
        res.json({ message: "Document added successfully" });
      }
    );
  }
});

//Get document for a professional
router.get("/documents/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM ProfessionalDocuments WHERE professionalId=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ JOB APPLICATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Add new Job Application
router.post("/apply", authenticate, (req, res) => {
  const data = req.body;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "INSERT INTO Applications (professionalId, jobId) VALUES (?, ?)",
      [data.professionalId, data.jobId],
      (err) => {
        if (err) return queryError(res, err);
        res.json({ message: "Job application submitted successfully" });
      }
    );
  }
});

//List all Applied Jobs for a single Professional
router.get("/my-applied", authenticate, (req, res) => {
  const id = req.user.id;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM Applications WHERE professionalId=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Bookmarked JOBS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Add new Bookmarked Jobs
router.post("/bookmark", authenticate, (req, res) => {
  const data = req.body;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "INSERT INTO Bookmarks (professionalId, jobId) VALUES (?,?)",
      [data.professionalId, data.jobId],
      (err) => {
        if (err) return queryError(res, err);
        res.json({ message: "Bookmark Added successfully" });
      }
    );
  }
});

//Get All bookmarked Jobs
router.get("/bookmarks", authenticate, (req, res) => {
  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query("SELECT * FROM Bookmarks", (err, results) => {
      if (err) return queryError(res, err);
      res.json(results);
    });
  }
});

//Get single bookmark job based on its ID
router.get("/bookmark/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM Bookmarks WHERE id=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

//Get bookmarks For single Professional
router.get("/bookmark/:professionalId", authenticate, (req, res) => {
  const id = req.params.professionalId;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM Bookmarks WHERE professionalId=?",
      [professionalId],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

// Delete a bookmarked job
router.delete("/bookmark/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "DELETE FROM Bookmarks WHERE id=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json({ message: "Bookmark Removed successfully" });
      }
    );
  }
});

module.exports = router;
