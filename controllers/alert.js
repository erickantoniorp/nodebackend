const { response, request } = require('express');
const Alert = require('../models/alert');

//Cambios 02/09/2021
const multer  = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const alertGet = async(req = request, res = response) => { 

    const { id } = req.query; //Cuando se manda en la url /alert/id
    //const { limit } = req.query; //Cuando haga paginacion

    const newAlert = Alert.instanceOf();
    console.log(newAlert);
    var result = null;

    if( id )
    {
        console.log('Lista alert Con ID: ' + id);
        result = await newAlert.list(id);
    }
    else
    {
        console.log('Lista Todos');
        result = await newAlert.list(-1);
    }

    res.json({
        msg: 'GET API',
        alerts : result.rows
    });

};

const alertPut = async (req, res) => { 
    const body = req.body;
    const { id } = req.params; //Cuando hay un parametro enviado, por ejemplo en un json

    //Desestrcturo todo lo que no necesito grabar
    const { idusuario, fecha, hora, ...resto} = req.body;

    const newAlert = new Alert(body);
    var result = null;

    if( newAlert.isValid() )
    {
        result = await newAlert.save(id);
    }

    res.json({
        msg: 'PUT API',
        id : id
    });
};

const alertPost = async (req, res) => { 


    const body = req.body;
    const newAlert = new Alert(body);
    var result = null;

    if( newAlert.isValid() )
    {
        result = await newAlert.save(-1);
        //console.log( result );
    }


    res.json({
        msg: 'POST API', 
        //res : result
        body
    });
};

const alertWithImagePost = async (req, res) => { 

    const { archivo } = req.files;
    console.log(archivo);
    const splitFileName = archivo.name.split('.');
    const extension = splitFileName[ splitFileName.length - 1];
    
    //Validar Extensiones válidas
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if( !validExtensions.includes(extension) ){
        reject(`La exntensión ${extension} no está permitida. Las válidas son: ${ validExtensions }`);
    }

    var result = null;

    const newName = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname , '../uploads/' , '', newName);

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            console.log("destination: " + uploadPath );
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            console.log("filename: " + newName );
            cb(null, newName); //path.extname(file.originalname));
        }
    });

    // Treat posted file
    /*var upload = multer({ storage: storage }).fields([
        { name: 'archivo', maxCount: 1 }, 
    ]);*/

    var upload = multer({ storage: storage }).fields([
        { name: 'archivo', maxCount: 1 }, 
    ]);


    upload(req, res, function(err) {
        
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            console.log("Error: " + err );
        } 

        console.log("Archivo Subido: " + req.file.path );

        // Get posted data:
        var obj = { 
            idusuario       : req.body.idusuario,
            tipo            : req.body.tipo,
            gps             : req.body.gps,
            nivelbateria    : req.body.nivelbateria,
            estado          : req.body.estado,
            fechamovil      : req.body.fechamovil,
            horamovil       : req.body.horamovil,
            //fotourl         : uploadPath
        };

        console.log( req.body );
        /*const body = req.body;
        const newAlert = new Alert(body);
        newAlert.fotourl = uploadPath;

        if( newAlert.isValid() )
        {
            result = newAlert.save(-1);
            //console.log( result );
        }*/

     });

    /*res.json({
        msg: 'POST API', 
        res : result,
        //body
    });*/
};

const alertDelete = async(req, res) => {
    const { id } = req.params;
    const  uid  = req.uid;

    const newAlert = Alert.instanceOf();
    //console.log(newalert);
    var result = null;

    if( id )
    {
        //console.log('Borra alert Con ID: ' + id);
        result = await newAlert.remove(id);
    }

    res.json({
        msg: 'DELETE API',
        id, 
        result
        /*,
        uid, 
        authalert : req.authalert*/
    });
};

const alertPatch = (req, res) => { 
    res.json({
        msg: 'PATCH API'
    });
};

module.exports = { alertGet, alertPost, alertDelete, alertPatch, alertPut, alertWithImagePost }