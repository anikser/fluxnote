var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/phone', function(req, res, next) {
  res.render('phone');
});

module.exports = router;
