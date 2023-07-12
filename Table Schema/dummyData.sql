-- HealthProfessional
INSERT INTO HealthProfessional (id, firstName, lastName, Age, Gender, city, subCity, wereda, email, phoneNumber, profession, languages, Skills) 
VALUES (1, 'John', 'Doe', 28, 'Male', 'Addis Ababa', 'Bole', '22 Mazoria', 'johndoe@gmail.com', '+251911111111', 'Doctor', 'English, Amharic', 'Surgery, Medicine');

-- LegalDocuments
INSERT INTO LegalDocuments (LegalDocsID, ProfessionallD, CVDocument, PassportOrIDCard, UploadDate) 
VALUES (1, 1, '/path/to/CV.doc', '/path/to/passport.jpg', '2021-09-01');

-- Education
INSERT INTO Education (EducationID, ProfessionallD, Title, Institution, StartingDate, EndingDate, InstitutionAddress) 
VALUES (1, 1, 'Bachelor of Medicine', 'Addis Ababa University', '2015-09-01', '2020-06-01', 'Addis Ababa, Ethiopia');

-- WorkExperience
INSERT INTO WorkExperience (ExperienceID, ProfessionallD, employerName, positionHeld, startingDate, endingDate, mainResponsibilities) 
VALUES (1, 1, 'St. Paul Hospital', 'Junior Doctor', '2020-07-01', '2021-08-01', 'Assisted senior doctors in performing surgeries and medical procedures.');

-- HealthOrganization
INSERT INTO HealthOrganization (OrganizationID, OrganizationName, OrganizationType, EmailAddress, PhoneNumber) 
VALUES (1, 'St. Paul Hospital', 'Hospital', 'info@stpaulhospital.com', '+251911111111');

-- ProfessionalRequest
INSERT INTO ProfessionalRequest (RequestID, organizationID, ProffesionalType, RequestDate, numberofproffesioals) 
VALUES (1, 1, 'Doctor', '2021-09-01', 3);

-- JobOffers
INSERT INTO JobOffers (OfferID, RequestID, ProffesionalID, OfferDate, OfferStatus, LegalDocsID, OrganizationID, WorkPermit, TaxDocument, UploadDate) 
VALUES (1, 1, 1, '2021-09-05', 'Pending', 1, 1, '/path/to/workpermit.pdf', '/path/to/taxdocument.pdf', '2021-09-06');

-- InstitutionLegalDocuments
INSERT INTO InstitutionLegalDocuments (InstitutionLegalDocumentsID, InstitutionID, LegalDocsID) 
VALUES (1, 1, 1);

-- JobPosts
INSERT INTO JobPosts (JobID, OrganizationID, JobPosition, Salary, Deadline, JobType, NumberOfEmployees, Prerequisites, RolesAndResponsibilities) 
VALUES (1, 1, 'Junior Doctor', 10000, '2021-09-15', 'Full-time', 3, 'Bachelor of Medicine degree', 'Assist senior doctors in performing medical procedures and surgeries.');

-- Bookmarks
INSERT INTO Bookmarks (professionalId) 
VALUES (1);

-- Applications
INSERT INTO Applications (professionalId, jobId) 
VALUES (1, 1);

-- ExperienceSkill
INSERT INTO ExperienceSkill (experienceTitle, experienceDescription, skillDescription, professionalId) 
VALUES ('Junior Doctor at St. Paul Hospital', 'Assisted senior doctors in performing surgeries and medical procedures.', 'Surgery, Medicine', 1);

-- ProfessionalDocuments
INSERT INTO ProfessionalDocuments (documentTitle, documentPath, professionalId) 
VALUES ('CV', '/path/to/CV.doc', 1);

-- LegalDocs
INSERT INTO LegalDocs (documentName, documentPath) 
VALUES ('Work Permit', '/path/to/workpermit.pdf');
INSERT INTO LegalDocs (documentName, documentPath) 
VALUES ('Tax Document', '/path/to/taxdocument.pdf');


INSERT INTO user (username, email, password, user_type) VALUES 
('professional', 'pro@test.com', 'test', 'professional'),
('organization', 'org@test.com', 'test', 'organization'),
('bobsmith', 'bobsmith@example.com', 'test', 'professional');