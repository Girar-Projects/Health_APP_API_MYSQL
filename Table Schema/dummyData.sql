-- Insert users
INSERT INTO users (id, username, email, password, user_type, paymentStatus, profileCreationStatus, longitude, latitude) VALUES
(1, 'johndoe', 'johndoe@example.com', 'password', 'professional', 'paid', 'completed', '12.345678', '98.765432'),
(2, 'healthorg1', 'healthorg1@example.com', 'password', 'organization', 'paid', 'completed', '11.111111', '22.222222'),
(3, 'healthorg2', 'healthorg2@example.com', 'password', 'organization', 'pending', 'incomplete', '33.333333', '44.444444');

-- Insert HealthProfessional
INSERT INTO HealthProfessional (id, user_id, firstName, lastName, Age, Gender, city, subCity, wereda, email, phoneNumber, profession, languages, Skills) VALUES
(1, 1, 'John', 'Doe', 30, 'Male', 'Addis Ababa', 'Kirkos', '06', 'johndoe@example.com', '+251911111111', 'Doctor', 'English, Amharic', 'Surgery, Pediatrics');

-- Insert LegalDocuments
INSERT INTO LegalDocuments (LegalDocsID, ProfessionallD, CVDocument, PassportOrIDCard, UploadDate) VALUES
(1, 1, '/path/to/CV.pdf', '/path/to/passport.pdf', '2021-10-01');

-- Insert Education
INSERT INTO Education (id, ProfessionallD, Title, Institution, StartingDate, EndingDate, InstitutionAddress) VALUES
(1, 1, 'Doctor of Medicine', 'Addis Ababa University', '2010-09-01', '2017-07-01', 'Addis Ababa, Ethiopia');

-- Insert WorkExperience
INSERT INTO WorkExperience (id, ProfessionallD, employerName, positionHeld, startingDate, endingDate, mainResponsibilities) VALUES
(1, 1, 'ABC Hospital', 'Resident Doctor', '2018-01-01', '2021-05-01', 'Diagnosis, treatment, surgery');

-- Insert HealthOrganization
INSERT INTO HealthOrganization (id, user_id, OrganizationName, OrganizationType, EmailAddress, PhoneNumber) VALUES
(2, 2, 'Clinic XYZ', 'Clinic', 'healthorg1@example.com', '+251922222222'),
(3, 3, 'Hospital ABC', 'Hospital', 'healthorg2@example.com', '+251933333333');

-- Insert ProfessionalRequest
INSERT INTO ProfessionalRequest (id, organizationID, ProffesionalType, RequestDate, numberofproffesioals) VALUES
(1, 2, 'Doctor', '2021-10-10', 2);

-- Insert JobOffers
INSERT INTO JobOffers (id, RequestID, ProffesionalID, OfferDate, OfferStatus, LegalDocsID, OrganizationID, WorkPermit, TaxDocument, UploadDate) VALUES
(1, 1, 1, '2021-10-15', 'pending', 1, 2, '/path/to/permit.pdf', '/path/to/taxdoc.pdf', '2021-10-15');

-- Insert InstitutionLegalDocuments
INSERT INTO InstitutionLegalDocuments (id, InstitutionID, LegalDocsID) VALUES
(1, 3, 1);

-- Insert JobPosts
INSERT INTO JobPosts (id, OrganizationID, JobPosition, Salary, Deadline, JobType, NumberOfEmployees, Prerequisites, RolesAndResponsibilities) VALUES
(1, 2, 'Pediatrician', 5000, '2021-11-30', 'Full-time', 2, 'Degree in medicine', 'Diagnose and treat children with various illnesses, provide guidance to parents');

-- Insert Bookmarks
INSERT INTO Bookmarks (id, professionalId) VALUES
(1, 1);

-- Insert Applications
INSERT INTO Applications (id, professionalId, jobId) VALUES
(1, 1, 1);

-- Insert ExperienceSkill
INSERT INTO ExperienceSkill (id, experienceTitle, experienceDescription, skillDescription, professionalId) VALUES
(1, 'Resident Doctor', 'Worked as a Resident Doctor at ABC Hospital for 3 years', 'Surgery, Diagnosis', 1);

-- Insert ProfessionalDocuments
INSERT INTO ProfessionalDocuments (id, documentTitle, documentPath, professionalId) VALUES
(1, 'Certificate of Medical Degree', '/path/to/cert.pdf', 1);

-- Insert LegalDocs
INSERT INTO LegalDocs (id, documentName, documentPath) VALUES
(1, 'Work Permit', '/path/to/workpermit.pdf'),
(2, 'Tax Document', '/path/to/taxdoc.pdf');