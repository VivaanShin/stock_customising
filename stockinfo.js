var request = require("request");
var cheerio = require('cheerio');
var request = require('request');


//var code = "005930"

exports.get_stockinfo = (code) => {
  var url = "https://finance.naver.com/item/main.nhn?code=";
  request(url+code, function(error, response, html) {
    if (error) {
      throw error;
    }
    var $ = cheerio.load(html);

  //var company = $('wrap_company.).trim();
    var FirstPrice = $('.no_today .no_up').text().trim();
    var SecondPrice = FirstPrice.replace(",","");
    var ThirdPrice = SecondPrice.split('\n');
    var price = ThirdPrice[0];
    //console.log("company", company);

    console.log("price", price);

  });
};
