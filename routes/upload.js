const express = require('express');
const router = express.Router();
const dlog = require('../utils/log').dlog(__filename);
const errlog = require('../utils/log').errlog(__filename);
const { Upload } = require('../tools/multer');

module.exports = function ({ models }) {
    router.post('*', (req, res) => {
        // if (!req.session.user) return res.status(401).end();
        try {
            const upload = Upload.single(req.url.slice(req.url.lastIndexOf('/') + 1));
            upload(req, res, (err) => {
                if (!!err) {
                    console.log(err);
                    return res.status(500).json({ success: false, msg: "Something went wrong!" });
                };
                return res.status(200).json(req.file.filename);
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, msg: "Something went wrong!" });
        };
    });

    return router
};


