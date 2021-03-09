var express = require("express");
var router = express.Router();
const appController = require("../controllers/incidentsController.js");

router.isAuthenticated = function(req, res, next) {
  if (req.user) return next();
  else res.redirect("/user/login");
};

// get Incidents
router.get("/", router.isAuthenticated, appController.getAllIncidents);

// GET request for New Incident Page
router.get("/new", router.isAuthenticated, appController.NewIncident);

//show a Single Incident
router.get("/:id", router.isAuthenticated, appController.getIncident);

// add Incidents
router.post("/add", router.isAuthenticated, appController.addIncident);

module.exports = router;
