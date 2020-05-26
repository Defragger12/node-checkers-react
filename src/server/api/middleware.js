import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import flash from "connect-flash/lib";
import multer from "multer";
import crypto from "crypto";
import path from "path";
// import cors from "cors";

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/photos')
    },
    filename: function (req, file, cb) {
        cb(null, crypto.randomBytes(16).toString('hex') + path.extname(file.originalname))
    }
});

export let middleware = (app) => {
    // app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        next();
    });
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(flash());
};


