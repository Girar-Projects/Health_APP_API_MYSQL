// Import required modules
const { Sequelize, DataTypes, Model } = require("sequelize");

// Create a new Sequelize instance
const sequelize = new Sequelize("health_app_test", "username", "password", {
  host: "196.188.127.211",
  dialect: "mysql",
});

// Define Model Classes

// Applications Model
class Applications extends Model {}
Applications.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    professionalId: { type: DataTypes.INTEGER, allowNull: false },
    jobId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Applications",
  }
);

// Bookmarks Model
class Bookmarks extends Model {}
Bookmarks.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    professionalId: { type: DataTypes.INTEGER, allowNull: false },
    jobId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Bookmarks",
  }
);

// EduWorkExperience Model
class EduWorkExperience extends Model {}
EduWorkExperience.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ProfessionalID: { type: DataTypes.INTEGER, allowNull: false },
    EducationLevel: { type: DataTypes.STRING(255), allowNull: false },
    WorkExperienceYear: { type: DataTypes.STRING(255), allowNull: false },
    employerName: { type: DataTypes.STRING(255) },
    positionHeld: { type: DataTypes.STRING(255) },
    startingDate: { type: DataTypes.DATEONLY },
    endingDate: { type: DataTypes.DATEONLY },
    mainResponsibilities: { type: DataTypes.STRING(255) },
  },
  {
    sequelize,
    modelName: "EduWorkExperience",
  }
);

// HealthOrganization Model
class HealthOrganization extends Model {}
HealthOrganization.init(
  {
    OrganizationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    OrganizationName: { type: DataTypes.STRING(255), allowNull: false },
    OrganizationType: { type: DataTypes.STRING(255), allowNull: false },
    EmailAddress: { type: DataTypes.STRING(255), allowNull: false },
    PhoneNumber: { type: DataTypes.STRING(255), allowNull: false },
    city: { type: DataTypes.STRING(255), allowNull: false },
    subCity: { type: DataTypes.STRING(255), allowNull: false },
    wereda: { type: DataTypes.STRING(255), allowNull: false },
    houseNo: { type: DataTypes.STRING(255), allowNull: false },
    tinNo: { type: DataTypes.STRING(255), allowNull: false },
    ContactPerson_Name: { type: DataTypes.STRING(255), allowNull: false },
    ContactPerson_Position: { type: DataTypes.STRING(255), allowNull: false },
    ContactPerson_Number: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    sequelize,
    modelName: "HealthOrganization",
  }
);

// HealthProfessional Model
class HealthProfessional extends Model {}
HealthProfessional.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    firstName: { type: DataTypes.STRING(255), allowNull: false },
    lastName: { type: DataTypes.STRING(255), allowNull: false },
    Age: { type: DataTypes.INTEGER, allowNull: false },
    Gender: { type: DataTypes.STRING(255), allowNull: false },
    city: { type: DataTypes.STRING(255), allowNull: false },
    subCity: { type: DataTypes.STRING(255), allowNull: false },
    wereda: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false },
    profession: { type: DataTypes.STRING(255), allowNull: false },
    languages: { type: DataTypes.STRING(255), allowNull: false },
    Skills: { type: DataTypes.STRING(255), allowNull: false },
    phoneNumber: { type: DataTypes.STRING(20) },
  },
  {
    sequelize,
    modelName: "HealthProfessional",
  }
);

// JobOffers Model
class JobOffers extends Model {}
JobOffers.init(
  {
    OfferID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    RequestID: { type: DataTypes.INTEGER, allowNull: false },
    ProffesionalID: { type: DataTypes.INTEGER, allowNull: false },
    OfferDate: { type: DataTypes.DATEONLY },
    OfferStatus: { type: DataTypes.STRING(255), allowNull: false },
    OrganizationID: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "JobOffers",
  }
);

// JobPosts Model
class JobPosts extends Model {}
JobPosts.init(
  {
    JobID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    OrganizationID: { type: DataTypes.INTEGER, allowNull: false },
    JobPosition: { type: DataTypes.STRING(255), allowNull: false },
    Salary: { type: DataTypes.INTEGER, allowNull: false },
    Deadline: { type: DataTypes.DATEONLY, allowNull: false },
    JobType: { type: DataTypes.STRING(255), allowNull: false },
    ExperienceLevel: { type: DataTypes.STRING(255), allowNull: false },
    WorkLocation: { type: DataTypes.STRING(255), allowNull: false },
    Category: { type: DataTypes.STRING(255), allowNull: false },
    NumberOfEmployees: { type: DataTypes.INTEGER, allowNull: false },
    Prerequisites: { type: DataTypes.STRING(1024), allowNull: false },
    Descriptions: { type: DataTypes.STRING(1024) },
    RolesAndResponsibilities: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    Created_at: { type: DataTypes.DATE },
    Last_Updated: { type: DataTypes.DATE },
    status: { type: DataTypes.STRING(45), defaultValue: "active" },
  },
  {
    sequelize,
    modelName: "JobPosts",
  }
);

// LegalDocs Model
class LegalDocs extends Model {}
LegalDocs.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    OrganizationID: { type: DataTypes.INTEGER, allowNull: false },
    documentName: { type: DataTypes.STRING(255), allowNull: false },
    documentPath: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    sequelize,
    modelName: "LegalDocs",
  }
);

// ProfessionalDocuments Model
class ProfessionalDocuments extends Model {}
ProfessionalDocuments.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    documentTitle: { type: DataTypes.STRING(255), allowNull: false },
    documentPath: { type: DataTypes.STRING(255), allowNull: false },
    professionalId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "ProfessionalDocuments",
  }
);

// ProfessionalRequest Model
class ProfessionalRequest extends Model {}
ProfessionalRequest.init(
  {
    RequestID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    organizationID: { type: DataTypes.INTEGER, allowNull: false },
    ProffesionalType: { type: DataTypes.STRING(255), allowNull: false },
    Gender: { type: DataTypes.STRING(10), allowNull: false },
    WorkPlace: { type: DataTypes.STRING(255), allowNull: false },
    ExperienceLevel: { type: DataTypes.STRING(50), allowNull: false },
    PhoneNumber: { type: DataTypes.STRING(20), allowNull: false },
    RequesterFullName: { type: DataTypes.STRING(255), allowNull: false },
    RequestDate: { type: DataTypes.DATEONLY, allowNull: false },
    numberofproffesioals: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING(255) },
  },
  {
    sequelize,
    modelName: "ProfessionalRequest",
  }
);

// TransactionDetails Model
class TransactionDetails extends Model {}
TransactionDetails.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    transaction_id: { type: DataTypes.STRING(255), allowNull: false },
    currentPaymentStatus: { type: DataTypes.STRING(255), allowNull: false },
    last_updated: { type: DataTypes.DATE },
    created_at: { type: DataTypes.DATE },
  },
  {
    sequelize,
    modelName: "TransactionDetails",
  }
);

// users Model
class Users extends Model {}
Users.init(
  {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uuid: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    user_type: { type: DataTypes.STRING(250), allowNull: false },
    phoneNumber: { type: DataTypes.STRING(255), allowNull: false },
    created_at: { type: DataTypes.DATE },
    last_login: { type: DataTypes.DATE },
    paymentStatus: { type: DataTypes.STRING(225), allowNull: false },
    profileCreationStatus: { type: DataTypes.STRING(225), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(10, 6) },
    latitude: { type: DataTypes.DECIMAL(10, 6) },
    name: { type: DataTypes.STRING(255) },
  },
  {
    sequelize,
    modelName: "Users",
  }
);

// Define Model Relationships

// HealthOrganization - users (One-to-One)
HealthOrganization.belongsTo(Users, { foreignKey: "user_id" });
Users.hasOne(HealthOrganization, { foreignKey: "user_id" });

// HealthProfessional - users (One-to-One)
HealthProfessional.belongsTo(Users, { foreignKey: "user_id" });
Users.hasOne(HealthProfessional, { foreignKey: "user_id" });

// Applications - HealthProfessional (Many-to-One)
Applications.belongsTo(HealthProfessional, { foreignKey: "professionalId" });
HealthProfessional.hasMany(Applications, { foreignKey: "professionalId" });

// Applications - JobPosts (Many-to-One)
Applications.belongsTo(JobPosts, { foreignKey: "jobId" });
JobPosts.hasMany(Applications, { foreignKey: "jobId" });

// Bookmarks - HealthProfessional (Many-to-One)
Bookmarks.belongsTo(HealthProfessional, { foreignKey: "professionalId" });
HealthProfessional.hasMany(Bookmarks, { foreignKey: "professionalId" });

// Bookmarks - JobPosts (Many-to-One)
Bookmarks.belongsTo(JobPosts, { foreignKey: "jobId" });
JobPosts.hasMany(Bookmarks, { foreignKey: "jobId" });

// EduWorkExperience - HealthProfessional (Many-to-One)
EduWorkExperience.belongsTo(HealthProfessional, {
  foreignKey: "ProfessionalID",
});
HealthProfessional.hasMany(EduWorkExperience, { foreignKey: "ProfessionalID" });

// JobOffers - ProfessionalRequest (Many-to-One)
JobOffers.belongsTo(ProfessionalRequest, { foreignKey: "RequestID" });
ProfessionalRequest.hasMany(JobOffers, { foreignKey: "RequestID" });

// JobOffers - HealthProfessional (Many-to-One)
JobOffers.belongsTo(HealthProfessional, { foreignKey: "ProffesionalID" });
HealthProfessional.hasMany(JobOffers, { foreignKey: "ProffesionalID" });

// JobOffers - HealthOrganization (Many-to-One)
JobOffers.belongsTo(HealthOrganization, { foreignKey: "OrganizationID" });
HealthOrganization.hasMany(JobOffers, { foreignKey: "OrganizationID" });

// JobPosts - HealthOrganization (Many-to-One)
JobPosts.belongsTo(HealthOrganization, { foreignKey: "OrganizationID" });
HealthOrganization.hasMany(JobPosts, { foreignKey: "OrganizationID" });

// LegalDocs - HealthOrganization (Many-to-One)
LegalDocs.belongsTo(HealthOrganization, { foreignKey: "OrganizationID" });
HealthOrganization.hasMany(LegalDocs, { foreignKey: "OrganizationID" });

// ProfessionalDocuments - HealthProfessional (Many-to-One)
ProfessionalDocuments.belongsTo(HealthProfessional, {
  foreignKey: "professionalId",
});
HealthProfessional.hasMany(ProfessionalDocuments, {
  foreignKey: "professionalId",
});

// ProfessionalRequest - HealthOrganization (Many-to-One)
ProfessionalRequest.belongsTo(HealthOrganization, {
  foreignKey: "organizationID",
});
HealthOrganization.hasMany(ProfessionalRequest, {
  foreignKey: "organizationID",
});

// TransactionDetails - users (Many-to-One)
TransactionDetails.belongsTo(Users, { foreignKey: "user_id" });
Users.hasMany(TransactionDetails, { foreignKey: "user_id" });

// Synchronize the database schema with Sequelize
(async () => {
  await sequelize.sync();
})();

// Export the models for use in Node.js and Express
module.exports = {
  Applications,
  Bookmarks,
  EduWorkExperience,
  HealthOrganization,
  HealthProfessional,
  JobOffers,
  JobPosts,
  LegalDocs,
  ProfessionalDocuments,
  ProfessionalRequest,
  TransactionDetails,
  Users,
};
