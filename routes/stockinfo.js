var request = require("request");
var cheerio = require('cheerio');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.get('/', (req, res, next) => {
  var code = req.param('stock_code');
  res.render('stockinfo', {title: 'stockinfo'});
})

var code = "005930"
console.log(request.body);



function get_stockinfo(code){
  console.log("code: ",code);
  var url = "https://finance.naver.com/item/main.nhn?code=";
  request.get(url+code, function(error, response, html){
    if(error){
      throw error;
    }
    var $ = cheerio.load(html);
    var FirstPrice = $('.no_today').text().trim();
    var SecondPrice = FirstPrice.replace(",","");
    var ThirdPrice = SecondPrice.split('\n');
    var price = ThirdPrice[0];
    console.log("price: ", price);
  });
};

get_stockinfo(code);



module.exports = router;
