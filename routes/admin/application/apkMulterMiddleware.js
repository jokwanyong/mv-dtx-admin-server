import multer from 'multer';
import path from 'path';
// import sequelize from '../../../models';


// apk 받는 미들웨어.

const storage = multer.diskStorage({
    destination: async function(req, file, cb) {
        
        let file_path;

        if(process.platform !== "linux") {
            file_path = path.join(__dirname.substr(0, __dirname.length - 25), 'public/')
        }
        else {
            // 안드로이드
            if(req.body.os_type === "1") {
                file_path = '/efs/application/dtx_app/survey/and/';
            }

            // 아이폰
            else if(req.body.os_type === "2") {
                file_path = '/efs/application/dtx_app/survey/ios/';
            }
            else {
                throw new Error("undefined os_type")
            }
        }

        cb(null, file_path)
    },
    filename: function (req, file, cb) {
        file.uploadedFile = {
          name: file.filename,
          ext: file.mimetype.split('/')[1]
        };
        cb(null,file.originalname);
    }
});

const apkMulterMiddleware = multer({
    fileFilter: async function (req, file, cb) {
        
      cb(null, true);
    },
    storage: storage
  }).fields([{
    // apk 라는 이름으로, 파일 단 한개만 받음
    name: 'apk',
    maxCount: 1
  }]);


exports.apkMulterMiddleware = apkMulterMiddleware;