var request = require("request");
var cheerio = require('cheerio');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var async = require('async');

router.get('/', function(req, res, next) {
  res.render('stockinfo', {
    title: '개인맞춤형 주식 알림 시스템'
  });
});



//async 문법
/*
async function getData_stock(code) {
  try {
    var price = await getData_stock_price(code);
  } catch (err) {
    alert(err)
  }
  res.render('stockinfo', {
    title: 'stockinfo',
    s_price: price
  });
};


var getData_stock_price = function(code) {
  var url = "https://finance.naver.com/item/main.nhn?code=";
  request(url + code, function(error, response, html) {
    if (error) {
      throw error;
    }
    var $ = cheerio.load(html);
    //var company = $('wrap_company.).trim();
    var FirstPrice = $('.no_today').text().trim();
    var SecondPrice = FirstPrice.replace(",", "");
    var ThirdPrice = SecondPrice.split('\n');
    var price = ThirdPrice[0];
    //console.log("company", company);
    console.log("price", price);
    return price;
  });
};
*/

//promise .then 문법
/*
getData_stock_price(code) {
  return new Promise(function(resolve, reject) {
    var url = "https://finance.naver.com/item/main.nhn?code=";
    request(url + code, function(error, response, html) {
      if (response) {
        var $ = cheerio.load(html);
        console.log($);
        var FirstPrice = $('.no_today').text().trim();
        var SecondPrice = FirstPrice.replace(",", "");
        var ThirdPrice = SecondPrice.split('\n');
        var price = ThirdPrice[0];
        //console.log("price1: ",price);
        resolve(price);
      }
      reject(new Error("Request is failed"));
    });
  });
}
getData_stock_price(code).then(function(price) {
  console.log("price2:", price);
  //price = get_stockinfo(code);
  res.render('stockinfo', {
    title: 'stockinfo',
    s_price: price
  });
}).catch(function(err) {
  console.error(err);
});
*/







/*
router.post('/', function(req, res, next) {
  console.log(req.body.stock_code);
  //if (req.body.latitude != "" && req.body.longitude != ""){
  data = {
    stock_code: req.body.stock_code
  }
  const code = data.stock_code;
  console.log("코드 입력성공");
  console.log("code: ", code);
  //getData(code);
  // present stock price
  function getData_stock_price(code) {
    //console.log("code1: ", code);
    return new Promise(function(resolve, reject) {
      var url = "https://finance.naver.com/item/main.nhn?code=";
      request(url + code, function(error, response, html) {
        if (response) {
          var $ = cheerio.load(html);
          console.log($);
          var FirstPrice = $('.no_today').text().trim();
          var SecondPrice = FirstPrice.replace(",", "");
          var ThirdPrice = SecondPrice.split('\n');
          var price = ThirdPrice[0];
          //console.log("price1: ",price);
          resolve(price);
        }
        reject(new Error("Request is failed"));
      });
    });
  }
  getData_stock_price(code).then(function(price) {
    console.log("price2:", price);
    //price = get_stockinfo(code);
    res.render('stockinfo', {
       title: 'stockinfo',
       s_price: price
     });
    /*hn = {
      'rcode': 'ok',
      'rmg': price
    }
    res.status(200).send(hn); // 여기 *마감 주석
  }).catch(function(err) {
    console.error(err);
  });


});
*/


/*

router.post('/stockinfo', function(req, res, next) {
  console.log(req.body.stock_code);
  //if (req.body.latitude != "" && req.body.longitude != ""){
  data = {
    stock_code: req.body.stock_code
  }
  const code = data.stock_code;
  console.log("코드 입력성공");
  console.log("code: ", code);
  //getData(code);
  // present stock price
  function getData_stock_price(code) {
    //console.log("code1: ", code);
    return new Promise(function(resolve, reject) {
      var url = "https://finance.naver.com/item/main.nhn?code=";
      request(url + code, function(error, response, html) {
        if (response) {
          var $ = cheerio.load(html);
          console.log($);
          var FirstPrice = $('.no_today').text().trim();
          var SecondPrice = FirstPrice.replace(",", "");
          var ThirdPrice = SecondPrice.split('\n');
          var price = ThirdPrice[0];
          //console.log("price1: ",price);
          resolve(price);
        }
        reject(new Error("Request is failed"));
      });
    });
  }
  // stock name
  function getData_stock_name(code) {
    //console.log("code1: ", code);
    return new Promise(function(resolve, reject) {
      var url = "https://finance.naver.com/item/main.nhn?code=";
      request(url + code, function(error, response, html) {
        if (response) {
          var $ = cheerio.load(html);
          var FirstPrice = $('.no_today').text().trim();
          var SecondPrice = FirstPrice.replace(",", "");
          var ThirdPrice = SecondPrice.split('\n');
          var price = ThirdPrice[0];
          //console.log("price1: ",price);
          resolve(price);
        }
        reject(new Error("Request is failed"));
      });
    });
  }
  //var hn;
  getData_stock_price(code).then(function(price) {
    console.log("price2:", price);
    //price = get_stockinfo(code);
    res.render('stockinfo', {
       title: 'stockinfo',
       s_price: price
     });
    /*hn = {
      'rcode': 'ok',
      'rmg': price
    }
    res.status(200).send(hn); //여기에 hn구간 주석 추가하기 *주석으로
  }).catch(function(err) {
    console.error(err);
  });


});

*/


module.exports = router;
