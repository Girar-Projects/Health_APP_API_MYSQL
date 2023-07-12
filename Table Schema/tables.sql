CREATE TABLE HealthProfessional (
  id INT NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  Age INT NOT NULL,
  Gender VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  subCity VARCHAR(255) NOT NULL,
  wereda VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(255) NOT NULL,
  profession VARCHAR(255) NOT NULL,
  languages VARCHAR(255) NOT NULL,
  Skills VARCHAR(255) NOT NULL,
  PRIMARY KEY (LegalDocsID)
);

CREATE TABLE LegalDocuments (
  LegalDocsID INT NOT NULL,
  ProfessionallD INT NOT NULL,
  CVDocument VARCHAR(255) NOT NULL,

  
  PassportOrIDCard VARCHAR(255) NOT NULL,
  UploadDate DATE NOT NULL,
  PRIMARY KEY (LegalDocsID),
  FOREIGN KEY (ProfessionallD) REFERENCES HealthProfessional (id)
);

CREATE TABLE Education (
  EducationID INT NOT NULL,
  ProfessionallD INT NOT NULL,
  Title VARCHAR(255) NOT NULL,
  Institution VARCHAR(255) NOT NULL,
  StartingDate DATE NOT NULL,
  EndingDate DATE NOT NULL,
  InstitutionAddress VARCHAR(255) NOT NULL,
  PRIMARY KEY (EducationID),
  FOREIGN KEY (ProfessionallD) REFERENCES HealthProfessional (id)
);

CREATE TABLE WorkExperience (
  ExperienceID INT NOT NULL,
  ProfessionallD INT NOT NULL,
  employerName VARCHAR(255) NOT NULL,
  positionHeld VARCHAR(255) NOT NULL,
  startingDate DATE NOT NULL,
  endingDate DATE NOT NULL,
  mainResponsibilities VARCHAR(255) NOT NULL,
  PRIMARY KEY (ExperienceID),
  FOREIGN KEY (ProfessionallD) REFERENCES HealthProfessional (id)
);

CREATE TABLE HealthOrganization (
  OrganizationID INT NOT NULL,
  OrganizationName VARCHAR(255) NOT NULL,
  OrganizationType VARCHAR(255) NOT NULL,
  EmailAddress VARCHAR(255) NOT NULL,
  PhoneNumber VARCHAR(255) NOT NULL,
  PRIMARY KEY (OrganizationID)
);

CREATE TABLE ProfessionalRequest (
  RequestID INT NOT NULL,
  organizationID INT NOT NULL,
  ProffesionalType VARCHAR(255) NOT NULL,
  RequestDate DATE NOT NULL,
  numberofproffesioals INT NOT NULL,
  PRIMARY KEY (RequestID),
  FOREIGN KEY (organizationID) REFERENCES HealthOrganization (OrganizationID)
);

CREATE TABLE JobOffers (
  OfferID INT NOT NULL,
  RequestID INT NOT NULL,
  ProffesionalID INT NOT NULL,
  OfferDate DATE NOT NULL,
  OfferStatus VARCHAR(255) NOT NULL,
  LegalDocsID INT NOT NULL,
  OrganizationID INT NOT NULL,
  WorkPermit VARCHAR(255) NOT NULL,
  TaxDocument VARCHAR(255) NOT NULL,
  UploadDate DATE NOT NULL,
  PRIMARY KEY (OfferID),
  FOREIGN KEY (RequestID) REFERENCES ProfessionalRequest (RequestID),
  FOREIGN KEY (ProffesionalID) REFERENCES HealthProfessional (id),
  FOREIGN KEY (LegalDocsID) REFERENCES LegalDocuments (LegalDocsID),
  FOREIGN KEY (OrganizationID) REFERENCES HealthOrganization (OrganizationID)
);

CREATE TABLE InstitutionLegalDocuments (
  InstitutionLegalDocumentsID INT NOT NULL,
  InstitutionID INT NOT NULL,
  LegalDocsID INT NOT NULL,
  PRIMARY KEY (InstitutionLegalDocumentsID),
  FOREIGN KEY (InstitutionID) REFERENCES HealthOrganization (OrganizationID),
  FOREIGN KEY (LegalDocsID) REFERENCES LegalDocuments (LegalDocsID)
);

CREATE TABLE JobPosts (
  JobID INT NOT NULL,
  OrganizationID INT NOT NULL,
  JobPosition VARCHAR(255) NOT NULL,
  Salary INT NOT NULL,
  Deadline DATE NOT NULL,
  JobType VARCHAR(255) NOT NULL,
  NumberOfEmployees INT NOT NULL,
  Prerequisites VARCHAR(255) NOT NULL,
  RolesAndResponsibilities VARCHAR(255) NOT NULL,
  PRIMARY KEY (JobID),
  FOREIGN KEY (OrganizationID) REFERENCES HealthOrganization (OrganizationID)
);

CREATE TABLE Bookmarks (
  id INT NOT NULL AUTO_INCREMENT,
  professionalId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (professionalId) REFERENCES HealthProfessional (id)
);

CREATE TABLE Applications (
  id INT NOT NULL AUTO_INCREMENT,
  professionalId INT NOT NULL,
  jobId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (professionalId) REFERENCES HealthProfessional (id),
  FOREIGN KEY (jobId) REFERENCES JobPosts (JobID)
);

CREATE TABLE ExperienceSkill (
  id INT NOT NULL AUTO_INCREMENT,
  experienceTitle VARCHAR(255) NOT NULL,
  experienceDescription VARCHAR(255) NOT NULL,
  skillDescription VARCHAR(255) NOT NULL,
  professionalId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (professionalId) REFERENCES HealthProfessional (id)
);

CREATE TABLE ProfessionalDocuments (
  id INT NOT NULL AUTO_INCREMENT,
  documentTitle VARCHAR(255) NOT NULL,
  documentPath VARCHAR(255) NOT NULL,
  professionalId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (professionalId) REFERENCES HealthProfessional (id)
);

CREATE TABLE LegalDocs (
  id INT NOT NULL AUTO_INCREMENT,
  documentName VARCHAR(255) NOT NULL,
  documentPath VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) NOT NULL DEFAULT 'professional',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
