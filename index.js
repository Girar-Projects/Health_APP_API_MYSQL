const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "db4free.net",
  user: "health_testing",
  password: "0919483800",
  database: "health_app_test",

  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "testing",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

const secretKey = "mysecretkey";

function queryError(res, err) {
  console.error("Error executing query: " + err.stack);
  res.sendStatus(500);
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Invalid token" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Authorization header missing" });
  }
}

// app.post('/professional/login', (req, res) => {
//   const data = req.body;
//   connection.query('SELECT * FROM users WHERE email=? AND password=?', [data.email, data.password], (err, results) => {
//     if (err) return queryError(res, err);
//     if (results.length === 0) {
//       res.status(401).json({ message: 'Invalid email or password' });
//     } else {
//         console.log(results[0])
//       const professional = results[0];
//       const token = jwt.sign({ type: 'professional' }, secretKey);
//       res.json({ token });
//     }
//   });
// });

// app.post("/login", (req, res) => {
//   const data = req.body;
//   connection.query(
//     "SELECT * FROM users WHERE email=? AND password=?",
//     [data.email, data.password],
//     (err, results) => {
//       if (err) return queryError(res, err);
//       if (results.length === 0) {
//         res.status(401).json({ message: "Invalid email or password" });
//       } else {
//         const user = results[0];
//         const token = jwt.sign(
//           { id: user.user_id, type: user.type },
//           secretKey
//         );
//         res.json({ token });
//       }
//     }
//   );
// });

app.post("/login", (req, res) => {
  const data = req.body;
  connection.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [data.email, data.password],
    (err, results) => {
      if (err) return queryError(res, err);
      if (results.length === 0) {
        res.status(401).json({ message: "Invalid email or password" });
      } else {
        const user = results[0];
        const token = jwt.sign(
          { id: user.id, type: user.user_type },
          secretKey
        );
        res.json({ token });
      }
    }
  );
});

app.post("/register", (req, res) => {
  const data = req.body;

  // Perform validation on the request data
  if (!(data.username && data.email && data.password && data.user_type)) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  if (!data.email.includes("@")) {
    res.status(400).json({ message: "Invalid email address" });
    return;
  }

  // Insert the new user into the users table
  connection.query(
    "INSERT INTO users (username, email, password, user_type) VALUES (?, ?, ?, ?)",
    [data.username, data.email, data.password, data.user_type],
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

app.get("/professional/personal-info/:id", authenticate, (req, res) => {
  const id = req.params.id;

  console.log("REQ USER ID", req.user.id);
  console.log("REQ USER type", req.user.type);
  console.log("ID", id);
  console.log("STATUS", req.user.type !== "professional");

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

app.put("/professional/personal-info/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const data = req.body;
  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "UPDATE HealthProfessional SET firstName=?, lastName=?, email=?, phoneNumber=?, address=?, city=?, state=?, zipCode=? WHERE LegalDocsID=?",
      [
        data.firstName,
        data.lastName,
        data.email,
        data.phoneNumber,
        data.address,
        data.city,
        data.state,
        data.zipCode,
        id,
      ],
      (err) => {
        if (err) return queryError(res, err);
        res.json({ message: "Personal info updated successfully" });
      }
    );
  }
});

app.post("/professional/experience-skill/:uid", authenticate, (req, res) => {
  const uid = req.params.uid;
  const data = req.body;
  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "INSERT INTO ExperienceSkill (experienceTitle, experienceDescription, skillDescription, professionalId) VALUES (?, ?, ?, ?)",
      [
        data.experienceTitle,
        data.experienceDescription,
        data.skillDescription,
        uid,
      ],
      (err) => {
        if (err) return queryError(res, err);
        res.json({ message: "Experience/skill added successfully" });
      }
    );
  }
});

app.get("/professional/experience-skill/:uid", authenticate, (req, res) => {
  const uid = req.params.uid;
  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM ExperienceSkill WHERE professionalId=?",
      [uid],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

app.post("/professional/documents/:uid", authenticate, (req, res) => {
  const uid = req.params.uid;
  const data = req.body;
  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "INSERT INTO ProfessionalDocuments (documentTitle, documentPath, professionalId) VALUES (?, ?, ?)",
      [data.documentTitle, data.documentPath, uid],
      (err) => {
        if (err) return queryError(res, err);
        res.json({ message: "Document added successfully" });
      }
    );
  }
});

app.get("/professional/documents/:uid", authenticate, (req, res) => {
  const uid = req.params.uid;
  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM ProfessionalDocuments WHERE professionalId=?",
      [uid],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

app.get("/professional/all", authenticate, (req, res) => {
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query("SELECT * FROM HealthProfessional", (err, results) => {
      if (err) return queryError(res, err);
      res.json(results);
    });
  }
});

app.post("/professional/bookmark", authenticate, (req, res) => {
  const data = req.body;
  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "INSERT INTO Bookmarks (professionalId) VALUES (?)",
      [data.professionalId],
      (err) => {
        if (err) return queryError(res, err);
        res.json({ message: "Bookmark created successfully" });
      }
    );
  }
});

app.get("/professional/bookmarks", authenticate, (req, res) => {
  if (req.user.type !== "professional") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query("SELECT * FROM Bookmarks", (err, results) => {
      if (err) return queryError(res, err);
      res.json(results);
    });
  }
});

app.get("/professional/bookmark/:id", authenticate, (req, res) => {
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

app.post("/professional/apply", authenticate, (req, res) => {
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

app.get("/professional/my-applied", authenticate, (req, res) => {
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

app.get("/professional/jobs", authenticate, (req, res) => {
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query("SELECT * FROM JobPosts", (err, results) => {
      if (err) return queryError(res, err);
      res.json(results);
    });
  }
});

app.get("/professional/job/:id", authenticate, (req, res) => {
  const id = req.params.id;
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM JobPosts WHERE id=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

// app.post('/organization/login', (req, res) => {
//   const data = req.body;
//   connection.query('SELECT * FROM users WHERE email=? AND password=?', [data.email, data.password], (err, results) => {
//     if (err) return queryError(res, err);
//     if (results.length === 0) {
//       res.status(401).json({ message: 'Invalid email or password' });
//     } else {
//       const organization = results[0];
//       const token = jwt.sign({ id: organization.user_id, type: 'organization' }, secretKey);
//       res.json({ token });
//     }
//   });
// });

app.post("/organization/organization-info/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const data = req.body;
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "UPDATE Organization SET name=?, email=?, description=?, phoneNumber=?, address=?, city=?, state=?, zipCode=? WHERE id=?",
      [
        data.name,
        data.email,
        data.description,
        data.phoneNumber,
        data.address,
        data.city,
        data.state,
        data.zipCode,
        id,
      ],
      (err) => {
        if (err) return queryError(res, err);
        res.json({ message: "Organization info updated successfully" });
      }
    );
  }
});

app.get("/organization/organization-info/:id", authenticate, (req, res) => {
  const id = req.params.id;
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM Organization WHERE id=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

app.put("/organization/organization-info/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const data = req.body;
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "UPDATE Organization SET name=?, email=?, description=?, phoneNumber=?, address=?, city=?, state=?, zipCode=? WHERE id=?",
      [
        data.name,
        data.email,
        data.description,
        data.phoneNumber,
        data.address,
        data.city,
        data.state,
        data.zipCode,
        id,
      ],
      (err) => {
        if (err) return queryError(res, err);
        res.json({ message: "Organization info updated successfully" });
      }
    );
  }
});

app.post("/organization/documents/:uid", authenticate, (req, res) => {
  const uid = req.params.uid;
  const data = req.body;
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "INSERT INTO OrganizationDocuments (documentTitle, documentPath, organizationId) VALUES (?, ?, ?)",
      [data.documentTitle, data.documentPath, uid],
      (err) => {
        if (err) return queryError(res, err);
        res.json({ message: "Document added successfully" });
      }
    );
  }
});

app.get("/organization/documents/:uid", authenticate, (req, res) => {
  const uid = req.params.uid;
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM OrganizationDocuments WHERE organizationId=?",
      [uid],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

app.get("/organization/professionals", authenticate, (req, res) => {
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query("SELECT * FROM HealthProfessional", (err, results) => {
      if (err) return queryError(res, err);
      res.json(results);
    });
  }
});

app.get("/organization/professional/:id", authenticate, (req, res) => {
  const id = req.params.id;
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM HealthProfessional WHERE LegalDocsID=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

app.get("/organization/my-jobs/:id", authenticate, (req, res) => {
  const id = req.params.id;
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM JobPosts WHERE organizationId=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

app.post("/organization/my-jobs", authenticate, (req, res) => {
  const data = req.body;
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "INSERT INTO JobPosts (organizationId, jobPosition, salary, deadline, jobType, numberOfEmployees, prerequisites, rolesAndResponsibilities) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.organizationId,
        data.jobPosition,
        data.salary,
        data.deadline,
        data.jobType,
        data.numberOfEmployees,
        data.prerequisites,
        data.rolesAndResponsibilities,
      ],
      (err) => {
        if (err) return queryError(res, err);
        res.json({ message: "Job posting created successfully" });
      }
    );
  }
});

app.get("/organization/my-jobs/:id", authenticate, (req, res) => {
  const id = req.params.id;
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query("SELECT FROM JobPosts WHERE id=?", [id], (err) => {
      if (err) return queryError(res, err);
      res.json({ message: "Job posting d successfully" });
    });
  }
});

app.get("/organization/applied/:id", authenticate, (req, res) => {
  const id = req.params.id;
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM Applications JOIN JobPosts ON Applications.jobId = JobPosts.id WHERE JobPosts.organizationId=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

app.post("/institution/legal-documents", authenticate, (req, res) => {
  const data = req.body;
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "INSERT INTO InstitutionLegalDocuments (institutionId, legalDocsId) VALUES (?, ?)",
      [data.institutionId, data.legalDocsId],
      (err) => {
        if (err) return queryError(res, err);
        res.json({
          message: "Legal document added to institution successfully",
        });
      }
    );
  }
});

app.get("/institution/legal-documents/:id", authenticate, (req, res) => {
  const id = req.params.id;
  if (req.user.type !== "organization") {
    res.status(403).json({ message: "Access denied" });
  } else {
    connection.query(
      "SELECT * FROM InstitutionLegalDocuments JOIN LegalDocs ON InstitutionLegalDocuments.legalDocsId = LegalDocs.id WHERE InstitutionLegalDocuments.institutionId=?",
      [id],
      (err, results) => {
        if (err) return queryError(res, err);
        res.json(results);
      }
    );
  }
});

app.get("/token", (req, res) => {
  const token = jwt.sign({ id: "test", type: "test" }, secretKey);
  res.json({ token });
});

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, () => {
  console.log("Express server listening on port 3000");
});
