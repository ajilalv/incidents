/* ------> Incidents Controller */
const mysql = require("../models/sql.js");

//Show New Incidents Form Page
exports.NewIncident = function(req, res, next) {
  res.render("newIncident");
};

//Show all the existing incidents related to the current user organization
exports.getAllIncidents = function(req, res, next) {
  mysql.getData(req.user.UORG_ID, function(result) {
    res.render("allIncidents", { incidents: result });
  });
};

//Show a single Incident details by using its ID
exports.getIncident = function(req, res, next) {
  const reqid = req.params.id;
  mysql.getIncident(reqid, req.user.USER_ID, incident => {
    if (incident) res.render("viewIncident", { result: incident });
    else
      res.render("showinfo", {
        msg:
          "<h2>Incident Number : " +
          reqid +
          ", Not Found for the current user </h2>"
      });
  });
};

//POST new Incident data
exports.addIncident = function(req, res, next) {
  //add Current User Details
  req.body["user"] = {
    INC_ReportPerson: req.user.USER_ID,
    INC_ReportOrg: req.user.UORG_ID.toString()
  };

  //add user basic details to the post object
  req.body["basic"] = {
    basicOrgValue: req.user.ORG_NAME,
    basicNameValue: req.user.UNAME,
    basicTitleValue: req.user.UTITLE,
    basicPhoneValue: req.user.UPHONE,
    basicEmailValue: req.user.UEMAIL
  };

  mysql.postIncident(req.body, function(result) {
    res.send(result);
  });
};
