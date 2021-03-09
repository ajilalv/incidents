const db = require("./InitDB.js");

/**
 * Get all the Incidents records for the current user's Organization
 * @param {Number} orgid -> current user's organisation ID
 * @param {function} callback -> callback function
 * @return {object} rows -> if error null, else the records
 */
function getIncidents(orgid, callback) {
  db.all(
    "SELECT * FROM Incidents T1 INNER JOIN IncOrgs T2 ON T1.INC_ReportOrg = T2.ORG_ID WHERE T1.INC_ReportOrg = ?",
    orgid,
    (err, rows) => {
      callback(rows);
    }
  );
}


/**
 * Get a single Incident records by the record id and userid
 * @param {Number} recordId -> ID of Incident
 * @param {Number} userId -> ID of requested user
 * @param {function} callback -> callback function
 * @return {object} rows -> if error null, else the records
 */
function getIncident(recordId, userId, callback) {
  db.get(
    "SELECT * FROM Incidents  WHERE INC_ID = ? AND INC_ReportPerson = ?",
    recordId,
    userId,
    (error, row) => {
      if (error) {
        callback(null);
      } else callback(row);
    }
  );
}

/**
 * Get a user by email and pass for validation
 * @param {string} uname -> email
 * @param {string} upass -> password
 * @param {function} callback -> callback function
 * @return {object} rows -> if error null, else the record
 */
function getUser(uname, upass, callback) {
  db.get(
    "SELECT * FROM IncUsers WHERE UEMAIL = ? AND UPASS = ?",
    uname,
    upass,
    (err, row) => {
      if (err) callback(err, null);
      else callback(err, row);
    }
  );
}

/**
 * Get a user details(except password) by ID
 * @param {Number} userId -> ID of user
 * @param {function} callback -> callback function
 * @return {object} rows -> if error null, else the record
 */
function getUserDetails(userId, callback) {
  db.get(
    "SELECT T1.UNAME,T1.UTITLE,T1.UPHONE,T2.ORG_NAME,T1.UEMAIL,T1.UORG_ID,T1.USER_ID FROM IncUsers T1 INNER JOIN IncOrgs T2 ON T1.UORG_ID = T2.ORG_ID  WHERE USER_ID = ? ",
    userId,
    (err, row) => {
      if (err) callback(err, null);
      else callback(null, row);
    }
  );
}

/**
 * POST a new Incident
 * @param {Object} post -> the data from the Form
 * @param {function} callback -> callback function
 * @return {object} rows -> if error null, else the new record ID
 */
function postIncident(post, callback) {
  //if post is empty then return false
  if (Object.keys(post).length === 0) return callback({ message: false });

  // DISALLOW_WRITE is an ENV variable that gets reset for new projects
  // so they can write to the database
  if (!process.env.DISALLOW_WRITE) {
    const infraChecked = post.infraInvolved.infraInvolChecked ? 1 : 0;
    const injuryChecked = post.injury.injuryChecked ? 1 : 0;
    const injHospChecked =
      injuryChecked && post.injury.injHospAdmChecked ? 1 : 0;
    const testChecked = post.tests.testChecked ? 1 : 0;
    db.serialize(function() {
      db.run(
        `INSERT INTO Incidents (INC_ReportPerson,INC_ReportOrg,
                              ORG_MANAGER,ORG_SP_OPER,ORG_SP_MAINT,ORG_OTHERS,
                              INC_TYPE,INC_Weather,INC_DATE,INC_YOUR_REF,
                              INC_LOCATION,LOC_INFO,LOC_CHAINAGE,LOC_STATION,LOC_STATION2,
                              INFRA_INVOLVED,INFRA_TRAIN,INFRA_VEHICLE,INFRA_OTHER,INFRA_DESC,
                              INJ_HAPPENED,INJ_PASS,INJ_SEVER,INJ_HOSP,
                              TEST_DONE,
                              DESC_FULL,DESC_CAUSE,DESC_CONSQ
      )  
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        cleanseString(post.user.INC_ReportPerson),
        cleanseString(post.user.INC_ReportOrg),
        cleanseString(post.orgInvolved.orgInfraValue),
        cleanseString(post.orgInvolved.orgSPOperValue),
        cleanseString(post.orgInvolved.orgSPMainValue),
        cleanseString(post.orgInvolved.orgOthValue),
        cleanseString(post.inctype.incType),
        cleanseString(post.inctype.IncWeathValue),
        cleanseString(post.inctype.IncTimeValue),
        cleanseString(post.inctype.IncYourRefValue),
        cleanseString(post.location.locType),
        cleanseString(post.location.locValue1),
        cleanseString(post.location.locValue2),
        cleanseString(post.location.locValue3),
        cleanseString(post.location.locValue4),
        infraChecked,
        cleanseString(post.infraInvolved.infraInvolTrainValue),
        cleanseString(post.infraInvolved.infraInvolRVNValue),
        cleanseString(post.infraInvolved.infraInvolOtherValue),
        cleanseString(post.infraInvolved.infraInvolDescValue),
        injuryChecked,
        cleanseString(post.injury.injuredSelected),
        cleanseString(post.injury.injSeverValue),
        injHospChecked,
        testChecked,
        cleanseString(post.desc.descValue1),
        cleanseString(post.desc.descValue2),
        cleanseString(post.desc.descValue3),

        error => {
          if (error) {
            //console.log(error);
            callback({ message: false });
          } else {
            db.get("SELECT MAX(INC_ID) as ID  FROM Incidents", (err, row) => {
              //console.log(row);

              //add test data if any
              if (post.tests.testChecked) {
                Object.keys(post.testData).forEach(key => {
                  let test = post.testData[key];
                  //console.log(test);
                  db.run(
                    "INSERT INTO Tests (INC_ID,NAME,POS,TYPE,TDATE,RESULT)  VALUES (?,?,?,?,?,?)",
                    row.ID,
                    cleanseString(test.name),
                    cleanseString(test.pos),
                    cleanseString(test.type),
                    cleanseString(test.data),
                    cleanseString(test.result)
                  );
                });
              }
              callback({ message: true, id: row.ID });
            });
          }
        }
      );
    });
  }
}

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

module.exports.getData = getIncidents;
module.exports.postIncident = postIncident;
module.exports.getIncident = getIncident;
module.exports.getUser = getUser;
module.exports.getUserDetails = getUserDetails;
