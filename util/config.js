var config = {};
import crypto from 'crypto';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// new server
// host: process.platform === 'linux' ? '127.0.0.1' : 'ec2-13-125-223-221.ap-northeast-2.compute.amazonaws.com',
config.DBConfig = {
    host: process.platform === 'linux' ? '127.0.0.1' : 'ec2-13-125-221-170.ap-northeast-2.compute.amazonaws.com',
    user: 'movements',
    password: 'pipe1234',
    database: 'pipeLine',
    connectionLimit: 10,
    waitForConnections: true,
    multipleStatements: true
};

config.generate_key = () => {
    let sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
};

config.isLoggedin = (req,res,next) => {
    let secretOrPrivateKey = Config.secret;
    let token = req.headers['x-access-token'];
    if (!token) return res.status(403).json('token is required!');
    else {
      jwt.verify(token, secretOrPrivateKey, function(err, decoded) {
        if(err) return res.status(403).json(err);
        else{
          req.decoded = decoded;
          next();
        }
      });
    }
};

config.createPassword = (text) => {
  const saltRounds = 10;
  var re = new RegExp(/(?=.*\d)(?=.*[a-zA-Z]).{10,30}/)
  if(re.test(text)) {
    return bcrypt.hashSync(text, saltRounds);
  }
  else {
    console.log("error");
    return new Error('password error');
  }
}

config.secret = "dtxAdmin";

const algorithm = "aes-256-gcm";
const pass = "!Lee0kon6wooTVC1woo3kon7leE7E1KR";
const iv = "5MovementS*!";

config.encrypt = (text) => {
    let cipher = crypto.createCipheriv(algorithm, pass, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    let tag = cipher.getAuthTag();
    return {
      content: encrypted,
      tag: tag.toString('hex')
    };
}

config.decrypt = (encrypted) => {
    let decipher = crypto.createDecipheriv(algorithm, pass, iv);
    decipher.setAuthTag(new Buffer(encrypted.tag, 'hex'));
    let dec = decipher.update(encrypted.content, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }

config.exceptSPCH = str => {
  if(typeof(str) === "string") {
      // str = str.toLocaleUpperCase()
      let regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
      if(regExp.test(str)){
          let t = str.replace(regExp, "");
          return t;
      }else{
          return str;
      }
  }
  return false
}

config.createEncoding = str => {
  str = config.exceptSPCH(str);
  let concatString = "";
  let arr = _.toArray(str);
  _.map(arr, i => {
      let char = _.chain(_.filter(character, ['string',i])).head().value().num;
      concatString += char
  })
  // console.log(concatString)
  
  return concatString;
};

const character = [
        {'string': '0', 'num': '0'},
        {'string': '1', 'num': '1'},
        {'string': '2', 'num': '2'},
        {'string': '3', 'num': '3'},
        {'string': '4', 'num': '4'},
        {'string': '5', 'num': '5'},
        {'string': '6', 'num': '6'},
        {'string': '7', 'num': '7'},
        {'string': '8', 'num': '8'},
        {'string': '9', 'num': '9'},
        {'string': 'a', 'num': '10'},
        {'string': 'b', 'num': '12'},
        {'string': 'c', 'num': '13'},
        {'string': 'd', 'num': '14'},
        {'string': 'e', 'num': '15'},
        {'string': 'f', 'num': '16'},
        {'string': 'g', 'num': '17'},
        {'string': 'h', 'num': '18'},
        {'string': 'i', 'num': '19'},
        {'string': 'j', 'num': '20'},
        {'string': 'k', 'num': '21'},
        {'string': 'l', 'num': '22'},
        {'string': 'm', 'num': '23'},
        {'string': 'n', 'num': '24'},
        {'string': 'o', 'num': '25'},
        {'string': 'p', 'num': '26'},
        {'string': 'q', 'num': '27'},
        {'string': 'r', 'num': '28'},
        {'string': 's', 'num': '29'},
        {'string': 't', 'num': '30'},
        {'string': 'u', 'num': '31'},
        {'string': 'v', 'num': '32'},
        {'string': 'w', 'num': '33'},
        {'string': 'x', 'num': '34'},
        {'string': 'y', 'num': '35'},
        {'string': 'z', 'num': '36'},
        {'string': 'A', 'num': '37'},
        {'string': 'B', 'num': '38'},
        {'string': 'C', 'num': '39'},
        {'string': 'D', 'num': '40'},
        {'string': 'E', 'num': '41'},
        {'string': 'F', 'num': '42'},
        {'string': 'G', 'num': '43'},
        {'string': 'H', 'num': '44'},
        {'string': 'I', 'num': '45'},
        {'string': 'J', 'num': '46'},
        {'string': 'K', 'num': '47'},
        {'string': 'L', 'num': '48'},
        {'string': 'M', 'num': '49'},
        {'string': 'N', 'num': '50'},
        {'string': 'O', 'num': '51'},
        {'string': 'P', 'num': '52'},
        {'string': 'Q', 'num': '53'},
        {'string': 'R', 'num': '54'},
        {'string': 'S', 'num': '55'},
        {'string': 'T', 'num': '56'},
        {'string': 'U', 'num': '57'},
        {'string': 'V', 'num': '58'},
        {'string': 'W', 'num': '59'},
        {'string': 'X', 'num': '60'},
        {'string': 'Y', 'num': '61'},
        {'string': 'Z', 'num': '62'}
    ];

config.alphabet = [
  {'string': 'A', 'num': 0},
  {'string': 'B', 'num': 1},
  {'string': 'C', 'num': 2},
  {'string': 'D', 'num': 3},
  {'string': 'E', 'num': 4},
  {'string': 'F', 'num': 5},
  {'string': 'G', 'num': 6},
  {'string': 'H', 'num': 7},
  {'string': 'I', 'num': 8},
  {'string': 'J', 'num': 9},
  {'string': 'K', 'num': 10},
  {'string': 'L', 'num': 11},
  {'string': 'M', 'num': 12},
  {'string': 'N', 'num': 13},
  {'string': 'O', 'num': 14},
  {'string': 'P', 'num': 15},
  {'string': 'Q', 'num': 16},
  {'string': 'R', 'num': 17},
  {'string': 'S', 'num': 18},
  {'string': 'T', 'num': 19},
  {'string': 'U', 'num': 20},
  {'string': 'V', 'num': 21},
  {'string': 'W', 'num': 22},
  {'string': 'X', 'num': 23},
  {'string': 'Y', 'num': 24},
  {'string': 'Z', 'num': 25},
]


config.createDevice = num => {
  var result = "";
  const fir = "MOVE";
  var ranNum = _.random(99999999, false).toString()
  while (ranNum) {
    if(ranNum.length < 8) {
      ranNum = '0' + ranNum;
    }else {
      break;
    }
  }

  switch(num) {
    case '0':
      const sta = "sta";
      result = fir + "_" + sta + "_" + ranNum;
      return result;
    case '1':
      const hel = "hel";
      result = fir + "_" + hel + "_" + ranNum;
      return result;
    default:
      return false;
  }
};

config.pipe_option = [
  {"pipe_type": 1, "name": "상수도"},
  {"pipe_type": 2, "name": "오수"},
  {"pipe_type": 3, "name": "우수"},
  {"pipe_type": 4, "name": "전기"},
  {"pipe_type": 5, "name": "가스"},
  {"pipe_type": 6, "name": "통신"},
  {"pipe_type": 7, "name": "송유"},
  {"pipe_type": 8, "name": "난방"},
]

module.exports = config;