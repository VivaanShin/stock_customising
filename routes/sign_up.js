var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '개인맞춤형 주식 알림 시스템' });
});


/* 회원가입_아이디 중복 검사 */
router.post('/sign_up_idcheck', function(req, res, next) {
  //DB접속하여 아이디 중복 검사하고 alert
  res.send('회원가입_아이디 중복 검사');
});

/* 회원가입_비밀번호 일치 검사 */
router.post('/sign_up_pwcheck', function(req, res, next) {
  //비밀번호 일치 검사하고 alert
  res.send('회원가입_비밀번호 일치 검사');
});

/* 회원가입 신청 완료 */
router.post('/sign_up_ok', function(req, res, next) {
  res.render('index', { title: '개인맞춤형 주식 알림 시스템' });
  res.send('회원가입 완료, 로그인 페이지 복귀');
});

module.exports = router;
