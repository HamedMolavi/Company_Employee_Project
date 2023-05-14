const multer = require('multer');
const path = require('path');
const errlog = require('../utils/log').errlog(__filename);

let storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const postFix = file.originalname.slice(file.originalname.lastIndexOf('.'));
        let filename = String(parseInt(Date.now() + Math.random() * 1E10));
        try {
            cb(null, filename + postFix);
            return filename;
        } catch (error) {
            errlog("Error in filename:");
            console.log(error);
        };
    },
    destination: function (req, _file, cb) {
        const destPath = req.originalUrl.slice(0, req.originalUrl.lastIndexOf('/')) + '/';
        try {
            cb(null, path.join(__dirname, '../public/', destPath));
        } catch (error) {
            errlog("Error in filename:");
            console.log(error);
        };
    },
});

module.exports = {
    Upload: multer({ storage: storage }),

};