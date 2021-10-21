/* 	Ajilal Vijayan, 
Technical Affairs Department, MOTC
*/

//const db = require("./InitDB.js"); //used for testing with Sqlite
const mysqlDB = require("./mysql.js");

/**
 * Send the query result by invoking the callback
 * @param {err} err 
 * @param {object} results 
 * @param {function} callback 
 */
function sendResult(error, results, callback) {
  //console.log(error,results)
  error ? callback(error, null) : callback(null, results[0])
}


/**
 * Get all the Incidents records for the current user's Organization
 * @param {Number} orgid -> current user's organisation ID
 * @param {function} callback -> callback function
 * @return {object} rows -> if error null, else the records
 */
function getIncidents(orgid, callback) {
  mysqlDB.executeQuery(
    `SELECT * FROM Incidents T1 INNER JOIN IncOrgs T2 ON T1.INC_ReportOrg = T2.ORG_ID WHERE T1.INC_ReportOrg = ?`,
    [orgid],
    (error, results) => error ? callback(error, null) : callback(results)
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
  mysqlDB.executeQuery(
    `SELECT * FROM Incidents  WHERE INC_ID = ? AND INC_ReportPerson = ?`,
    [recordId, userId],
    (error, results) => error ? callback(error, null) : callback(results)
  );
}

/**
 * Get a user by objectid for validation
 * @param {string} uoid -> user object id
 * @param {function} callback -> callback function
 * @return {object} rows -> if error null, else the record
 */
function getUser(uoid, callback) {
  //console.log('LOOKING FOR, ',uoid)
  mysqlDB.executeQuery(
    `SELECT * FROM IncUsers WHERE USER_ID = ?`, [uoid],
    (err, results) => sendResult(err, results, callback)
  );
}

/**
 * Get a user details(except password) by ID
 * @param {Number} userId -> Object ID of user
 * @param {function} callback -> callback function
 * @return {object} rows -> if error null, else the record
 */
function getUserDetails(userId, callback) {
   //console.log('LOOKING FOR user details, ',userId)
  mysqlDB.executeQuery(
    `SELECT T1.UNAME,T1.UTITLE,T1.UPHONE,T2.ORG_NAME,T1.UEMAIL,T1.UORG_ID,T1.USER_ID FROM IncUsers T1 INNER JOIN IncOrgs T2 ON T1.UORG_ID = T2.ORG_ID  WHERE USER_ID = ?`,
    [userId],
    (err, results) => sendResult(err, results, callback)
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

    const postIncidentQuery = mysqlDB.executeQuery(
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
      [post.user.INC_ReportPerson,
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
      cleanseString(post.desc.descValue3)],

      (error, results) => {
        if (error) {
          //console.log(error);
          callback({ message: false });
        } else {
          //console.log(results)
          //add test data if any
          if (post.tests.testChecked) {
            Object.keys(post.testData).forEach(key => {
              let test = post.testData[key];
              //console.log(test);
              mysqlDB.executeQuery(
                "INSERT INTO Tests (INC_ID,NAME,POS,TYPE,TDATE,RESULT)  VALUES (?,?,?,?,?,?)",
                results.insertId,
                cleanseString(test.name),
                cleanseString(test.pos),
                cleanseString(test.type),
                cleanseString(test.data),
                cleanseString(test.result)
              );
            });
          }
          callback({ message: true, id: results.insertId });
        }
      }
    );
  }
}

// helper function that prevents html/css/script malice
const cleanseString = function (string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

module.exports.getIncidents = getIncidents;
module.exports.postIncident = postIncident;
module.exports.getIncident = getIncident;
module.exports.getUser = getUser;
module.exports.getUserDetails = getUserDetails;
