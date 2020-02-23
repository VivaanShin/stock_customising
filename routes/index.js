var request = require("request");
var cheerio = require('cheerio');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '개인맞춤형 주식 알림 시스템' });
});


router.post('/stockinfo', function(req, res, next) {
  console.log(req.body.stock_code);
  //if (req.body.latitude != "" && req.body.longitude != ""){
  data = {
    stock_code: req.body.stock_code
  }
  const code = data.stock_code;
  console.log("코드 입력성공");
  console.log("code: ", code);
  var get_stockinfo = function(code){
    var url = "https://finance.naver.com/item/main.nhn?code=";
    request(url+code, function(error, response, html) {
      if (error) {
        throw error;
      }
      var $ = cheerio.load(html);
      //var company = $('wrap_company.).trim();
      var FirstPrice = $('.no_today').text().trim();
      var SecondPrice = FirstPrice.replace(",","");
      var ThirdPrice = SecondPrice.split('\n');
      var price = ThirdPrice[0];
      //console.log("company", company);
      console.log("price", price);
      return price;
    });
  };
  price = get_stockinfo(code);
  res.redirect('/stockinfo', {price: price});
});






module.exports = router;
