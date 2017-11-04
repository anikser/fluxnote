var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('Rendering phone view...');
  res.render('phone');
});

module.exports = router;
