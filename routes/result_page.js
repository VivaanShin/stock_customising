var express = require('express');
//var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

router.post('/', function(req, res, nest){
  var id = req.body.id;
  var age = req.body.age;
  console.log('## post request');
  res.render('result_page', {title: 'Express', id: id, age: age, method:"post"});

});

module.exports = router;
