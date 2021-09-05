const { response }  = require('express');
const multer        = require('multer');
const mystorage       = multer.memoryStorage();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(function(err){
            console.log("Error en destination: " + err);
        }, '../uploads/');
    },
    filename: function (req, file, cb) {
        cb(function(err){
            console.log("Error en filename: " + err);
        }, path.extname(file.originalname));
    }
});

const upload = multer({
    storage: mystorage
})

module.exports = upload;