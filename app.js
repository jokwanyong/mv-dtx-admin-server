import createError from 'http-errors';
import express from 'express';
import bodyParser from "body-parser";
import session from 'express-session';
import cors from "cors";
import morgan from "morgan";
import moment from "moment-timezone";
import path from 'path';
import "@babel/polyfill";

import admin from './routes/admin';

import Sequelize from './models/index';
var sequelize = Sequelize.sequelize;
var app = express();
const port = process.env.PORT || 9292;

// sequelize.sync();

// app.use(session({
//     secret: 'movements04',
//     resave: false,
//     saveUninitialized: true
//   }))
  
app.disable('x-powered-by');
app.set('trust proxy', true);
  
// log setting
morgan.token('date', (req, res, tz) => {
return moment().tz("Asia/Seoul").format('YYYY-MM-DD, HH:mm:ss a');
});
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});
morgan.token('file', (req, res) => {
  return JSON.stringify(req.files)
});
morgan.format('myformat', `admin :remote-addr - :remote-user [:date[Asia/Seoul]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"\n :body \n :file`);

// body size setting
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));
// cross setting
app.use(cors());
app.use(morgan('myformat'));

app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  // start log
app.listen(port, () => {
    console.log("ADMIN Server is Start 😆");
});