const express = require('express');
const _ = require('lodash');
const Config = require('../../util/config');
const jwt = require('jsonwebtoken');
const sequelize = require('../../models');

const areaRoute = require('./area');
const pipeRoute = require('./pipe');
const pipeMapRoute = require('./pipeMap');
const smartRoute = require('./smart');
const smartMapRoute = require('./smartMap');
const ModelRoute = require('./model');
const ObstructionTypeRoute = require('./obstructionType');
const ObstructionRoute = require('./obstruction');
const MaterialRoute = require('./material');
const JobRoute = require('./job');
const JobLogRoute = require('./job_log');
const ObsModel = require('./obsModel');
const email = require('./email');
const JointBluePrint = require('./jointBluePrint');
const SurveyRoute = require('./survey');
const JournalRoute = require('./journal');
const DataUpload = require('./dataUpload');
const Application = require('./application');

var router = express.Router();

const Op = sequelize.Op;

/**
 * 관리자 로그인
 * 아이디 및 비밀번호 동일함.
 * 
 */

router.post('/login', async (req, res, next) => {
  try {
    const param = req.body;
    var arr = {};
    arr.user_id = param.username;
    arr.user_pw = JSON.stringify(Config.encrypt(param.password));
    var result = await sequelize.Admin.findOne({
      where: {
        user_id: req.body.username,
        user_pw: JSON.stringify(Config.encrypt(param.password))
      }
    })
    
    if(result !== null) {
      var data = {};
      data.token = Config.generate_key();
      data.username = result.user_id;
      var secretOrPrivateKey = Config.secret;
      var options = {expiresIn: 60*60*24};
  
      jwt.sign(data, secretOrPrivateKey, options, function(err, token){
        if(err) {
          console.log(err)
          return res.json({"result": "error"})
        };
        res.json({token});
      });
    }
    else {
      res.send("ERROR");
    }
  } catch (error) {
    console.log(error);
    res.send("ERROR");
  }
});

/**
 * 관리자 들어올 시 토큰 없으면 에러처리
 * 현재 주석 한채로 사용중.
 * 
 */

// router.use((req, res, next) => {
//   var secretOrPrivateKey = Config.secret;
//   var token = req.headers['x-access-token'];
  
//   if (!token) return res.status(403).json('token is required!');
//   else {
//     jwt.verify(token, secretOrPrivateKey, (err, decoded) => {
//       if(err) return res.status(403).json(err);
//       else {
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } 
// });

router.use('/area', areaRoute);
router.use('/smart', smartRoute);
router.use('/smartMap', smartMapRoute);
router.use('/pipe', pipeRoute);
router.use('/pipeMap', pipeMapRoute);
router.use('/model', ModelRoute);
router.use('/obstruction', ObstructionRoute);
router.use('/hole', ObstructionRoute);
router.use('/obstructionType', ObstructionTypeRoute);
router.use('/material', MaterialRoute);
router.use('/job', JobRoute);
router.use('/jobLog', JobLogRoute);
router.use('/obsModel', ObsModel);
router.use('/email', email);
router.use('/jointBluePrint', JointBluePrint);
router.use('/servey', SurveyRoute);
router.use('/journal', JournalRoute);
router.use('/dataUpload', DataUpload);
router.use('/application', Application);

module.exports = router;