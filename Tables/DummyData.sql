INSERT INTO users (uuid, email, password, user_type, paymentStatus, profileCreationStatus, longitude, latitude) VALUES 
('1234567890', 'pro@test.com', 'test', 'professional', 'paid', 'complete', '52.376437', '4.900820'),
('2345678901', 'org@test.com', 'test', 'organization', 'pending', 'incomplete', '52.366037', '4.894974'),
('3456789012', 'bob.smith@example.com', 'password789', 'professional', 'unpaid', 'incomplete', '51.507351', '-0.127758');

INSERT INTO HealthProfessional (id, user_id, firstName, lastName, Age, Gender, city, subCity, wereda, email, phoneNumber, profession, languages, Skills) VALUES 
(1, 1, 'John', 'Doe', 35, 'Male', 'Amsterdam', 'Centrum', 'Binnenstad', 'john.doe@example.com', '+31612345678', 'Medical Doctor', 'English,Dutch', 'Communication, Decision-Making Skills'),
(2, 1, 'Jane', 'Doe', 30, 'Female', 'Amsterdam', 'Zuid', 'De Pijp', 'jane.doe@example.com', '+31687654321', 'Nurse', 'English,Dutch', 'Attention to Detail, Empathy'),
(3, 1, 'Joe', 'Smith', 40, 'Male', 'Amsterdam', 'West', 'De Baarsjes', 'joe.smith@example.com', '+31611112222', 'Dentist', 'English,Spanish', 'Manual Dexterity, Problem-Solving Skills');

INSERT INTO HealthOrganization (OrganizationID, user_id, OrganizationName, OrganizationType, EmailAddress, PhoneNumber, city, subCity, wereda, houseNo, tinNo, ContactPerson_Name, ContactPerson_Position, ContactPerson_Number) VALUES 
(1, 2, 'Amsterdam Medical Center', 'Hospital', 'info@amc.nl', '+31206487622', 'Amsterdam', 'Zuidoost', 'Venserpolder', '123', '987654321', 'John Doe', 'Director', '+31698765432'),
(2, 2, 'Amsterdam Red Cross', 'NGO', 'info@redcross.nl', '+31203134567', 'Amsterdam', 'Centrum', 'Nieuwmarkt', '456', '123456789', 'Jane Doe', 'Manager', '+31612345678');

INSERT INTO ProfessionalRequest (RequestID, organizationID, ProffesionalType, Gender, WorkPlace, ExperienceLevel, PhoneNumber, RequesterFullName, RequestDate, numberofproffesioals) VALUES 
(1, 1, 'Nurse', 'Female', 'Emergency Room', 'Intermediate', '+31612345678', 'John Doe', '2021-08-01', 5),
(2, 2, 'Medical Doctor', 'Male', 'ICU', 'Expert', '+31206487622', 'Jane Doe', '2021-09-01', 3);

INSERT INTO JobOffers (OfferID, RequestID, ProffesionalID, OfferDate, OfferStatus, OrganizationID) VALUES 
(1, 1, 2, '2021-08-15', 'accepted', 1),
(2, 1, 1, '2021-08-15', 'pending', 1),
(3, 2, 3, '2021-09-15', 'active', 2);

INSERT INTO JobPosts (JobID, OrganizationID, JobPosition, Salary, Deadline, JobType, ExperienceLevel, WorkLocation, Category, NumberOfEmployees, Prerequisites, Descriptions, RolesAndResponsibilities) VALUES 
(1, 1, 'Nurse', 4000.00, '2021-09-15', 'Full-time', 'Experienced', 'Amsterdam', 'Medical', 10, 'Bachelor in nursing required', 'We are looking for a skilled and experienced nurse to join our team at the Amsterdam Medical Center', 'Responsibilities include administering medication, taking vital signs, and providing emotional support to patients.'),
(2, 1, 'Medical Doctor', 8000.00, '2021-10-01', 'Full-time', 'Experienced', 'Amsterdam', 'Medical', 5, 'MD required', 'We are seeking an experienced medical doctor to lead our team at the Amsterdam Medical Center', 'Responsibilities include oversight of patient care, management of medical staff, and ensuring compliance with healthcare regulations.'),
(3, 2, 'Emergency Response Coordinator', 5000.00, '2021-09-30', 'Full-time', 'Entry-level', 'Amsterdam', 'NGO', 3, 'None', 'The Amsterdam Red Cross is searching for a skilled emergency response coordinator to help us with our humanitarian mission', 'Responsibilities include liaison with donors, coordination of field activities, and analysis of humanitarian needs.');

INSERT INTO Bookmarks (professionalId, jobId) VALUES 
(1, 3),
(2, 1),
(3, 2),
(1, 1),
(2, 3);

INSERT INTO Applications (professionalId, jobId) VALUES 
(1, 1),
(3, 2),
(2, 3);

INSERT INTO ProfessionalDocuments (documentTitle, documentPath, professionalId) VALUES 
('MD Certificate', '/documents/md_certificate.pdf', 1),
('Bachelors in Nursing', '/documents/bachelors_degree.pdf', 2),
('Dental License', '/documents/dental_license.pdf', 3);

INSERT INTO LegalDocs (OrganizationID, documentName, documentPath) VALUES 
(1, 'Business License', '/documents/business_license.pdf'),
(1, 'Tax Certificate', '/documents/tax_certificate.pdf'),
(2, 'Annual Report', '/documents/annual_report.pdf');

INSERT INTO EduWorkExperience (id, ProfessionalID, EducationLevel, WorkExperienceYear, employerName, positionHeld, startingDate, endingDate, mainResponsibilities) VALUES 
(1, 1, 'MD', '10', 'Amsterdam Medical Center', 'Medical Doctor', '2010-01-01', '2020-12-31', 'Patient Care'),
(2, 2, 'Bachelor in Nursing', '3', 'Amsterdam Medical Center', 'Nurse', '2021-01-01', '2021-07-31', 'Administering Medication'),
(3, 3, 'DDS', '5', 'Amsterdam Dental Clinic', 'Dentist', '2015-01-01', '2020-12-31', 'Dental Procedures');