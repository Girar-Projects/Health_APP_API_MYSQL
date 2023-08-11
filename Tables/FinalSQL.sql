CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_type VARCHAR(250) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  paymentStatus VARCHAR(225) NOT NULL,
  profileCreationStatus VARCHAR(225) NOT NULL,
  longitude DECIMAL(10, 6) ,
  latitude DECIMAL(10, 6) 
);




CREATE TABLE HealthProfessional (
  id INT NOT NULL,
  user_id INT NOT NULL,
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
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE HealthOrganization (
  OrganizationID INT NOT NULL,
  user_id INT NOT NULL,
  OrganizationName VARCHAR(255) NOT NULL,
  OrganizationType VARCHAR(255) NOT NULL,
  EmailAddress VARCHAR(255) NOT NULL,  
  PhoneNumber VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,  
  subCity VARCHAR(255) NOT NULL,
  wereda VARCHAR(255) NOT NULL,  
  houseNo VARCHAR(255) NOT NULL,
  tinNo VARCHAR(255) NOT NULL,  
  ContactPerson_Name VARCHAR(255) NOT NULL,
  ContactPerson_Position VARCHAR(255) NOT NULL,  
  ContactPerson_Number VARCHAR(255) NOT NULL,
  PRIMARY KEY (OrganizationID),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
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
  OrganizationID INT NOT NULL,
  PRIMARY KEY (OfferID),
  FOREIGN KEY (RequestID) REFERENCES ProfessionalRequest (RequestID),
  FOREIGN KEY (ProffesionalID) REFERENCES HealthProfessional (id),
  FOREIGN KEY (OrganizationID) REFERENCES HealthOrganization (OrganizationID)
);



CREATE TABLE JobPosts (
  JobID INT NOT NULL,
  OrganizationID INT NOT NULL,
  JobPosition VARCHAR(255) NOT NULL,
  Salary INT NOT NULL,
  Deadline DATE NOT NULL,
  JobType VARCHAR(255) NOT NULL,
  ExperienceLevel VARCHAR(255) NOT NULL,
  WorkLocation VARCHAR(255) NOT NULL,
  Category VARCHAR(255) NOT NULL,
  NumberOfEmployees INT NOT NULL,
  Prerequisites VARCHAR(1024) NOT NULL,
  Descriptions VARCHAR(1024),
  RolesAndResponsibilities VARCHAR(1024) NOT NULL,
  PRIMARY KEY (JobID),
  FOREIGN KEY (OrganizationID) REFERENCES HealthOrganization (OrganizationID)
);

CREATE TABLE Bookmarks (
  id INT NOT NULL AUTO_INCREMENT,
  professionalId INT NOT NULL,
  jobId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (professionalId) REFERENCES HealthProfessional (id),
  FOREIGN KEY (jobId) REFERENCES JobPosts (JobID)
);

CREATE TABLE Applications (
  id INT NOT NULL AUTO_INCREMENT,
  professionalId INT NOT NULL,
  jobId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (professionalId) REFERENCES HealthProfessional (id),
  FOREIGN KEY (jobId) REFERENCES JobPosts (JobID)
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
  OrganizationID INT NOT NULL,
  documentName VARCHAR(255) NOT NULL,
  documentPath VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (OrganizationID) REFERENCES HealthOrganization (OrganizationID)
);



CREATE TABLE EduWorkExperience (
  id INT NOT NULL,
  ProfessionalID INT NOT NULL,
  EducationLevel VARCHAR(255) NOT NULL,
  WorkExperienceYear VARCHAR(255) NOT NULL,
  employerName VARCHAR(255) ,
  positionHeld VARCHAR(255) ,
  startingDate DATE,
  endingDate DATE,
  mainResponsibilities VARCHAR(255),
  PRIMARY KEY (id),
  FOREIGN KEY (ProfessionalID) REFERENCES HealthProfessional (id)
);
