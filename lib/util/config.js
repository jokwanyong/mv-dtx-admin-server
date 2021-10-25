"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _crypto = _interopRequireDefault(require("crypto"));

var _lodash = _interopRequireDefault(require("lodash"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _config$DBConfig;

var config = {};
// new server
// host: process.platform === 'linux' ? '127.0.0.1' : 'ec2-13-125-223-221.ap-northeast-2.compute.amazonaws.com',
config.DBConfig = (_config$DBConfig = {
  host: process.platform === 'linux' ? '127.0.0.1' : 'ec2-13-125-221-170.ap-northeast-2.compute.amazonaws.com',
  user: 'movements',
  password: 'pipe1234',
  database: 'pipeLine',
  connectionLimit: 10,
  waitForConnections: true
}, (0, _defineProperty2["default"])(_config$DBConfig, "connectionLimit", 10), (0, _defineProperty2["default"])(_config$DBConfig, "multipleStatements", true), _config$DBConfig);

config.generate_key = function () {
  var sha = _crypto["default"].createHash('sha256');

  sha.update(Math.random().toString());
  return sha.digest('hex');
};

config.isLoggedin = function (req, res, next) {
  var secretOrPrivateKey = Config.secret;
  var token = req.headers['x-access-token'];
  if (!token) return res.status(403).json('token is required!');else {
    _jsonwebtoken["default"].verify(token, secretOrPrivateKey, function (err, decoded) {
      if (err) return res.status(403).json(err);else {
        req.decoded = decoded;
        next();
      }
    });
  }
};

config.createPassword = function (text) {
  var saltRounds = 10;
  var re = new RegExp(/(?=.*\d)(?=.*[a-zA-Z]).{10,30}/);

  if (re.test(text)) {
    return _bcrypt["default"].hashSync(text, saltRounds);
  } else {
    console.log("error");
    return new Error('password error');
  }
};

config.secret = "dtxAdmin";
var algorithm = "aes-256-gcm";
var pass = "!Lee0kon6wooTVC1woo3kon7leE7E1KR";
var iv = "5MovementS*!";

config.encrypt = function (text) {
  var cipher = _crypto["default"].createCipheriv(algorithm, pass, iv);

  var encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher["final"]('hex');
  var tag = cipher.getAuthTag();
  return {
    content: encrypted,
    tag: tag.toString('hex')
  };
};

config.decrypt = function (encrypted) {
  var decipher = _crypto["default"].createDecipheriv(algorithm, pass, iv);

  decipher.setAuthTag(new Buffer(encrypted.tag, 'hex'));
  var dec = decipher.update(encrypted.content, 'hex', 'utf8');
  dec += decipher["final"]('utf8');
  return dec;
};

config.exceptSPCH = function (str) {
  if (typeof str === "string") {
    // str = str.toLocaleUpperCase()
    var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

    if (regExp.test(str)) {
      var t = str.replace(regExp, "");
      return t;
    } else {
      return str;
    }
  }

  return false;
};

config.createEncoding = function (str) {
  str = config.exceptSPCH(str);
  var concatString = "";

  var arr = _lodash["default"].toArray(str);

  _lodash["default"].map(arr, function (i) {
    var _char = _lodash["default"].chain(_lodash["default"].filter(character, ['string', i])).head().value().num;

    concatString += _char;
  }); // console.log(concatString)


  return concatString;
};

var character = [{
  'string': '0',
  'num': '0'
}, {
  'string': '1',
  'num': '1'
}, {
  'string': '2',
  'num': '2'
}, {
  'string': '3',
  'num': '3'
}, {
  'string': '4',
  'num': '4'
}, {
  'string': '5',
  'num': '5'
}, {
  'string': '6',
  'num': '6'
}, {
  'string': '7',
  'num': '7'
}, {
  'string': '8',
  'num': '8'
}, {
  'string': '9',
  'num': '9'
}, {
  'string': 'a',
  'num': '10'
}, {
  'string': 'b',
  'num': '12'
}, {
  'string': 'c',
  'num': '13'
}, {
  'string': 'd',
  'num': '14'
}, {
  'string': 'e',
  'num': '15'
}, {
  'string': 'f',
  'num': '16'
}, {
  'string': 'g',
  'num': '17'
}, {
  'string': 'h',
  'num': '18'
}, {
  'string': 'i',
  'num': '19'
}, {
  'string': 'j',
  'num': '20'
}, {
  'string': 'k',
  'num': '21'
}, {
  'string': 'l',
  'num': '22'
}, {
  'string': 'm',
  'num': '23'
}, {
  'string': 'n',
  'num': '24'
}, {
  'string': 'o',
  'num': '25'
}, {
  'string': 'p',
  'num': '26'
}, {
  'string': 'q',
  'num': '27'
}, {
  'string': 'r',
  'num': '28'
}, {
  'string': 's',
  'num': '29'
}, {
  'string': 't',
  'num': '30'
}, {
  'string': 'u',
  'num': '31'
}, {
  'string': 'v',
  'num': '32'
}, {
  'string': 'w',
  'num': '33'
}, {
  'string': 'x',
  'num': '34'
}, {
  'string': 'y',
  'num': '35'
}, {
  'string': 'z',
  'num': '36'
}, {
  'string': 'A',
  'num': '37'
}, {
  'string': 'B',
  'num': '38'
}, {
  'string': 'C',
  'num': '39'
}, {
  'string': 'D',
  'num': '40'
}, {
  'string': 'E',
  'num': '41'
}, {
  'string': 'F',
  'num': '42'
}, {
  'string': 'G',
  'num': '43'
}, {
  'string': 'H',
  'num': '44'
}, {
  'string': 'I',
  'num': '45'
}, {
  'string': 'J',
  'num': '46'
}, {
  'string': 'K',
  'num': '47'
}, {
  'string': 'L',
  'num': '48'
}, {
  'string': 'M',
  'num': '49'
}, {
  'string': 'N',
  'num': '50'
}, {
  'string': 'O',
  'num': '51'
}, {
  'string': 'P',
  'num': '52'
}, {
  'string': 'Q',
  'num': '53'
}, {
  'string': 'R',
  'num': '54'
}, {
  'string': 'S',
  'num': '55'
}, {
  'string': 'T',
  'num': '56'
}, {
  'string': 'U',
  'num': '57'
}, {
  'string': 'V',
  'num': '58'
}, {
  'string': 'W',
  'num': '59'
}, {
  'string': 'X',
  'num': '60'
}, {
  'string': 'Y',
  'num': '61'
}, {
  'string': 'Z',
  'num': '62'
}];
config.alphabet = [{
  'string': 'A',
  'num': 0
}, {
  'string': 'B',
  'num': 1
}, {
  'string': 'C',
  'num': 2
}, {
  'string': 'D',
  'num': 3
}, {
  'string': 'E',
  'num': 4
}, {
  'string': 'F',
  'num': 5
}, {
  'string': 'G',
  'num': 6
}, {
  'string': 'H',
  'num': 7
}, {
  'string': 'I',
  'num': 8
}, {
  'string': 'J',
  'num': 9
}, {
  'string': 'K',
  'num': 10
}, {
  'string': 'L',
  'num': 11
}, {
  'string': 'M',
  'num': 12
}, {
  'string': 'N',
  'num': 13
}, {
  'string': 'O',
  'num': 14
}, {
  'string': 'P',
  'num': 15
}, {
  'string': 'Q',
  'num': 16
}, {
  'string': 'R',
  'num': 17
}, {
  'string': 'S',
  'num': 18
}, {
  'string': 'T',
  'num': 19
}, {
  'string': 'U',
  'num': 20
}, {
  'string': 'V',
  'num': 21
}, {
  'string': 'W',
  'num': 22
}, {
  'string': 'X',
  'num': 23
}, {
  'string': 'Y',
  'num': 24
}, {
  'string': 'Z',
  'num': 25
}];

config.createDevice = function (num) {
  var result = "";
  var fir = "MOVE";

  var ranNum = _lodash["default"].random(99999999, false).toString();

  while (ranNum) {
    if (ranNum.length < 8) {
      ranNum = '0' + ranNum;
    } else {
      break;
    }
  }

  switch (num) {
    case '0':
      var sta = "sta";
      result = fir + "_" + sta + "_" + ranNum;
      return result;

    case '1':
      var hel = "hel";
      result = fir + "_" + hel + "_" + ranNum;
      return result;

    default:
      return false;
  }
};

config.pipe_option = [{
  "pipe_type": 1,
  "name": "상수도"
}, {
  "pipe_type": 2,
  "name": "오수"
}, {
  "pipe_type": 3,
  "name": "우수"
}, {
  "pipe_type": 4,
  "name": "전기"
}, {
  "pipe_type": 5,
  "name": "가스"
}, {
  "pipe_type": 6,
  "name": "통신"
}, {
  "pipe_type": 7,
  "name": "송유"
}, {
  "pipe_type": 8,
  "name": "난방"
}];
module.exports = config;