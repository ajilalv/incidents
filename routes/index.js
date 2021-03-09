var express = require("express");
var router = express.Router();
const indexController = require("../controllers/indexController.js");

// GET request for Home page
router.get("/", indexController.IndexPage);

// GET request for User Appendix page
router.get("/appendix", indexController.appendixPage);

module.exports = router;
