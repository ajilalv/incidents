/* ------> Index Controller */

exports.IndexPage = function(req, res, next) {
  res.render("index");
};

exports.appendixPage = function(req, res, next) {
  res.render("appendix");
};
