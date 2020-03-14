var request = require("request");
var cheerio = require('cheerio');
var cheerioTableparser = require('cheerio-tableparser');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var async = require('async')
var iconv = require('iconv-lite');
var charset = require('charset');



router.post('/stockinfo', function(req, res, next) {
  console.log(req.body.stock_code);
  //if (req.body.latitude != "" && req.body.longitude != ""){
  data = {
    stock_code: req.body.stock_code
  }
  const code = data.stock_code;
  //console.log("코드 입력성공");
  console.log("code: ", code);
  //getData(code);
  // present stock price
  function getData_stock_price(code) {
    //console.log("code1: ", code);
    return new Promise(function(resolve, reject) {
      var base_url = "https://finance.naver.com/item/main.nhn?code=";
      var url = base_url + code;
      request({
        url,
        encoding: 'binary'
      }, function(error, response, body) {
        if (response) {
          const enc = charset(response.headers, body);
          const i_result = iconv.decode(body, 'euc-kr');
          var $ = cheerio.load(i_result);
          //해당 주식 이름
          var s_name = $('.wrap_company h2').text();
          //해당 주식 현재가격
          var FirstPrice = $('.no_today').text().trim();
          var SecondPrice = FirstPrice.replace(",", "");
          var ThirdPrice = SecondPrice.split('\n');
          var s_price = ThirdPrice[0];

          //해당 주식 상세정보(전일가,고가,거래량,시초가,저가,거래대금)
          var s_data = new Array();
          $('.no_info tbody tr td .blind').each(function(i) {
            var link = $(this);
            var text = link.text().trim();
            s_data[i] = text;
            //console.log(text);
          });
          //console.log("s_data: ", s_data);
          var s_yesterday = s_data[0]; //전일가
          var s_highvalue = s_data[1]; //고가
          var s_volume = s_data[3]; //거래량
          var s_startvalue = s_data[4]; //시초가
          var s_lowvalue = s_data[5]; //저가
          var s_volumevalue = s_data[6]; //거래대금
          console.log('s_name: ', s_name);
          console.log('s_price: ', s_price);

          //동일업종 비교
          //동일업종 이름 전처리 이전 값
          var bf_sameindustry_name = new Array();
          var first_industry = $('.section.trade_compare .tb_type1.tb_num thead tr a').each(function(i) {
            var link = $(this);
            var text = link.text();
            //console.log('first', text);
            bf_sameindustry_name[i] = text;
          });
          //console.log("bf_sameindustry_name: ", bf_sameindustry_name);

          //동일업종 코드 값
          var sameindustry_code = new Array();
          var first_industry = $('.section.trade_compare .tb_type1.tb_num thead tr a em').each(function(i) {
            var link = $(this);
            var text = link.text();
            sameindustry_code[i] = text;
          });
          //console.log("sameindustry_code: ", sameindustry_code);

          //동일업종 이름 값
          var sameindustry_name = new Array();
          for (i = 0; i < 5; i++) {
            if (bf_sameindustry_name[i].indexOf(sameindustry_code[i]) != -1) {
              var distribute_locate = bf_sameindustry_name[i].indexOf(sameindustry_code[i]);
              //console.log("locate", distribute_locate);
              sameindustry_name[i] = bf_sameindustry_name[i].substr(0, distribute_locate);
              //console.log("종목이름",sameindustry_name[i]);

            } else {
              console.log("locate not find");
            }
          }

          //동일업종 내용 값
          var sameindustry_price = new Array(); //전일가
          var sameindustry_daytoday = new Array(); //전일대비
          var sameindustry_evenrate = new Array(); //등락률
          var sameindustry_marketvalue = new Array(); //시가총액
          var sameindustry_foreignrate = new Array(); //외국인보유율
          var etc_sameindustry = $('.section.trade_compare .tb_type1.tb_num tbody tr td').each(function(i) {
            var link = $(this);
            var text = link.text().trim();
            if (i < 5) {
              sameindustry_price[i] = text;
              //console.log("sameindustry_yprice", sameindustry_yprice[i]);
            } else if (i < 10) {
              var replacetext = text.replace('\n\t\t\t\t', '');
              sameindustry_daytoday[i - 5] = replacetext;
              //console.log("sameindustry_daytoday", sameindustry_daytoday[i-5]);
            } else if (i < 15) {
              var replacetext = text.replace('\n\t\t\t\t', '');
              sameindustry_evenrate[i - 10] = replacetext;
              //console.log("sameindustry_evenrate", sameindustry_evenrate[i-10]);
            } else if (i < 20) {
              sameindustry_marketvalue[i - 15] = text;
              //console.log("sameindustry_marketvalue", sameindustry_marketvalue[i-15]);
            } else if (i < 25) {
              sameindustry_foreignrate[i - 20] = text;
              //console.log("sameindustry_foreignrate", sameindustry_foreignrate[i-20]);
            }

          });




          //동일업종 데이터 객체 SameIndustry
          var si = {
            name: sameindustry_name,
            code: sameindustry_code,
            price: sameindustry_price,
            daytoday: sameindustry_daytoday,
            evenrate: sameindustry_evenrate,
            marketvalue: sameindustry_marketvalue,
            foreignrate: sameindustry_foreignrate
          };
          console.log("동일업종 객체", si);

          //.then()으로 넘길 데이터
          var s_data = {
            s_name: s_name,
            s_price: s_price,
            s_yesterday: s_yesterday,
            s_highvalue: s_highvalue,
            s_lowvalue: s_lowvalue,
            s_startvalue: s_startvalue,
            s_volume: s_volume,
            s_volumevalue: s_volumevalue,
            si_name: si.name,
            si_code: si.code,
            si_price: si.price,
            si_daytoday: si.daytoday,
            si_evenrate: si.evenrate,
            si_marketvalue: si.marketvalue,
            si_foreignrate: si.foreignrate

          };
          resolve(s_data);
        }
        reject(new Error("Request is failed"));
      });
    });
  }
  getData_stock_price(code).then(function(s_data) {
    //console.log("price:", s_price);
    //price = get_stockinfo(code);
    res.render('stockinfo', {
      title: 'stockinfo',
      s_name: s_data.s_name,
      s_price: s_data.s_price,
      s_yesterday: s_data.s_yesterday,
      s_highvalue: s_data.s_highvalue,
      s_lowvalue: s_data.s_lowvalue,
      s_startvalue: s_data.s_startvalue,
      s_volume: s_data.s_volume,
      s_volumevalue: s_data.s_volumevalue,
      si_name: s_data.si_name,
      si_code: s_data.si_code,
      si_price: s_data.si_price,
      si_daytoday: s_data.si_daytoday,
      si_evenrate: s_data.si_evenrate,
      si_marketvalue: s_data.si_marketvalue,
      si_foreignrate: s_data.si_foreignrate
    });
    /*hn = {
      'rcode': 'ok',
      'rmg': price
    }
    res.status(200).send(hn); */ // 여기 마감 주석
  }).catch(function(err) {
    console.error(err);
  });


});


/*
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



/*
var mysql = require('mysql');
var db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'12345678',
  database:'stock_customising'
});
db.connect();
*/

/*
//라우터 처리
router.get('/', (req, res)=>{
  console.log('get login url');
  var msg;
  var errMsg = req.flash('error');
  if(errMsg) msg = errMsg;
  res.render('login.ejs', {'message' : msg})
});
*/

/*


//serialize 처리 해주어야함
passport.serializeUser(function(user, done){
  console.log('passport session save : ', user.id);
  done(null, user.id);
});

//요청시 세션값 뽑아서 페이지 전달
passport.deserializeUser(function(id, done){
  console.log('passport session get id : ', id);
  done(null, id);
});

//strategy를 등록, 이걸 사용하기 위해서 등록한 거임
//인증처리는 실제 여기서. db 조회 로직 여기다가 작성하고, 밑에 post로 들어오면 여기서 체크
passport.use('local-login', new LocalStrategy({
  usernameField : 'id',
  passwordField : 'password',
  passReqToCallBack : true
}, function(req, id, password, done){
  //로그인 인증처리
  var query = connection.query('selecrt * from user where id=?', [id], function(err, rows){
    if(err) return done(err);
    if(rows.length){
      return done(null, {'id' : id, 'uid' : rows[0].id})
    }else{
      return done(null, false, {'message' : 'your Login info is not found >.<'}); //세션에 담을 정보.
    }
  })
}
));

//커스텀 콜백사용할 예정(ajax니깐 json 응답을 줘야하기때문에 커스텀 콜백 사용
router.post('/',function(req, res, next){
  console.log("커스텀 콜백");
  passport.authenticate('local-login', function(err, user, info){
    if(err) res.status(500).json(err);
    if(!user) return res.status(401).json(info.message)

    //req.login을 이용해서 serialize기능이 자연스럽게 이어지도록 되어있음
    req.login(user, function(err){
      if(err) {return next(err);}
      return res.json(user);
    });
  })(req, res, next); //authenticate 반환 메서드에 이 인자를 넣어서 처리해야함.
})
*/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: '개인맞춤형 주식 알림 시스템'
  });
});

/* GET main page. */
router.get('/main', function(req, res, next) {
  res.render('main', {
    title: '개인맞춤형 주식 알림 시스템'
  });
});

/* GET sign_up page. */
router.get('/sign_up', function(req, res, next) {
  res.render('sign_up', {
    title: '회원가입 페이지'
  });
});


/*
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
*/


//var scheduler = schedule.scheduleJob('*/30 * * * *', function(){ //function () {....}
//console.log('30분마다 실행됩니다!');
//});




module.exports = router;
