//Creates a new Database(if not exists) and insert some demo data
class InitDB {
  constructor() {
    const fs = require("fs");
    const dbFile = "./.data/incidentsV5.db";
    const dbExists = fs.existsSync(dbFile);

    const sqlite3 = require("sqlite3").verbose();
    this.sqldb = new sqlite3.Database(dbFile);

    // if the DB file is not exists, then add tables and data
    if (!dbExists) {
      this.sqldb.serialize(() => {
        this.CreateTables();
        this.InsertData();
        console.log("Database Created and all tables are set");
      });
    }
    console.log(dbExists ? "Existing DB found, ready to go !!" : "New DB Created !!");
  }

  getDB() {
    return this.sqldb;
  }

  CreateTables() {
    console.log("Creating Tables");
    this.CreateIncidentsTable();
    this.CreateTestTable();
    this.CreateOrgsTable();
    this.CreateUsersTable();
  }

  InsertData() {
    console.log("Inserting Data");
    this.InsertDemoOrgs();
    this.InsertDemoUsers();
  }

  //------------------------------------ CREATE TABLES ---------------------------------------------------------------------
  CreateIncidentsTable() {
    this.sqldb.run(
      `CREATE TABLE Incidents (INC_ID INTEGER PRIMARY KEY AUTOINCREMENT,INC_ReportPerson INTEGER,INC_ReportOrg INTEGER,
      ORG_MANAGER TEXT,ORG_SP_OPER TEXT,ORG_SP_MAINT TEXT,ORG_OTHERS TEXT,
      INC_TYPE TEXT,INC_Weather TEXT,INC_DATE TEXT,INC_YOUR_REF TEXT,
      INC_LOCATION TEXT,LOC_INFO TEXT,LOC_CHAINAGE TEXT,LOC_STATION TEXT,LOC_STATION2 TEXT,
      INFRA_INVOLVED INTEGER,INFRA_TRAIN TEXT,INFRA_VEHICLE TEXT,INFRA_OTHER TEXT,INFRA_DESC TEXT,
      INJ_HAPPENED INTEGER,INJ_PASS TEXT,INJ_SEVER TEXT,INJ_HOSP INTEGER,
      TEST_DONE INTEGER,DESC_FULL TEXT,DESC_CAUSE TEXT,DESC_CONSQ TEXT)`
    );
  }

  CreateTestTable() {
    this.sqldb.run(
      `CREATE TABLE Tests (TEST_ID INTEGER PRIMARY KEY AUTOINCREMENT,INC_ID INTEGER, NAME TEXT,POS TEXT,TYPE TEXT, TDATE TEXT, RESULT TEXT)`
    );
  }

  CreateOrgsTable() {
    this.sqldb.run(
      `CREATE TABLE IncOrgs (ORG_ID INTEGER PRIMARY KEY,ORG_NAME TEXT)`
    );
  }

  CreateUsersTable() {
    this.sqldb.run(
      `CREATE TABLE IncUsers (USER_ID TEXT PRIMARY KEY,UNAME TEXT,UTITLE TEXT, UPHONE TEXT,UEMAIL TEXT,UPASS TEXT, UORG_ID INTEGER)`
    );
  }

  //------------------------------------ INSERT DEMO DATA ---------------------------------------------------------------------
  //Insert Demo Organisation Data
  InsertDemoOrgs() {
    const orgs = [
      { id: 100, name: "Organisation 1" },
      { id: 101, name: "Organisation 2" },
      { id: 102, name: "Organisation 3" },
      { id: 103, name: "Organisation 4" }
    ];
    orgs.forEach(org => {
      this.sqldb.run(
        "INSERT INTO IncOrgs (ORG_ID,ORG_NAME)  VALUES (?,?)",
        org.id,
        org.name
      );
    });
  }

  //Insert some demo users
  InsertDemoUsers() {
    const users = [
      {
        name: "User 1",
        title: "Site Manager",
        phone: "15874",
        email: "user1@demo.com",
        orgid: 100
      },
      {
        name: "User 2",
        title: "Safety Manager",
        phone: "44446",
        email: "user2@demo.com",
        orgid: 100
      },
      {
        name: "User 3",
        title: "Safety Officer",
        phone: "12345",
        email: "user3@demo.com",
        orgid: 101
      },
      {
        name: "User 4",
        title: "General Manager",
        phone: "85365",
        email: "user4@demo.com",
        orgid: 101
      },
      {
        name: "User 5",
        title: "Project Manager",
        phone: "14752",
        email: "user5@demo.com",
        orgid: 103
      },
      {
        name: "User 6",
        title: "Project Manager",
        phone: "12378",
        email: "user6@demo.com",
        orgid: 102
      }
    ];
    users.forEach(user => {
      this.sqldb.run(
        "INSERT INTO IncUsers (USER_ID,UNAME,UTITLE,UPHONE,UEMAIL,UPASS,UORG_ID)  VALUES (?,?,?,?,?,?,?)",
        Math.random()
          .toString(36)
          .substring(7),
        user.name,
        user.title,
        user.phone,
        user.email,
        "demo",
        user.orgid
      );
    });
  }
}

module.exports = new InitDB().getDB();
