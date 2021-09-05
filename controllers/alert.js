const { response, request } = require('express');
const Alert = require('../models/alert');

//Cambios 02/09/2021
const multer  = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { fileUploadHelper }  = require('../helpers/fileupload')

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
    //const uploadPath = '../uploads/';
    //const uploadPath = 'uploads/';
    console.log("newName    : " + newName);
    console.log("uploadPath : " + uploadPath);

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            console.log("destination: " + uploadPath );
            console.log("req: " + req );
            console.log("file: " + file );
            cb(function(err){
                console.log("Error en destination: " + err);
            }, uploadPath);
        },
        filename: function (req, file, cb) {
            console.log("filename: " + newName );
            console.log("req: " + req );
            console.log("file: " + file );
            req.body.file = filename;
            cb(function(err){
                console.log("Error en filename: " + err);
            }, newName); //path.extname(file.originalname));
        }
    });

    // Treat posted file
    /*var upload = multer({ storage: storage }).fields([
        { name: 'archivo', maxCount: 1 }, 
    ]);*/

    const upload = multer({ storage: storage }).single('archivo');
    //const upload = multer({ dest: '../uploads/' })

    
    upload(req, res, function(err) {
        console.log("Entro al upload");
        //console.log("req: "+ req);
        console.log("files    : " + req.files);
        console.log("file     : " + req.file);
        console.log("body     : " +  req.body);
        console.log("file path: " + req.path);
        console.log("file name: " + req.body.filename);

        /*if (req.fileValidationError) {
            console.log("Entro a req.fileValidationError");
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            console.log("Entro a req.file");
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            console.log("Entro a instanceof multer.MulterError");
            return res.send(err);
        }
        else */
        if (err) {
            console.log("Error: " + err );
        } 

        //console.log("Archivo Subido: " + req.file.path );

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
     

    res.json({
        msg: 'POST API', 
        //res : result,
        //body
    });
};


const alertWithImage2 = async (req, res, next) => {
    try {
        console.log(req.file);
        console.log(req.body);

        console.log( "idusuario: " + req.body.idusuario );
        console.log( "gps " + req.body.gps );
        console.log( "tipo: "+ req.body.tipo );
        console.log( "nivelbateria: "+ req.body.nivelbateria );
        console.log( "estado: "+ req.body.estado );
        console.log( "fechamovil: "+ req.body.fechamovil );
        console.log( "horamovil: "+ req.body.horamovil );

        const body = req.body;

        const { archivo } = req.files;
        //console.log("Archivo: " + archivo);
        const splitFileName = archivo.name.split('.');
        const extension = splitFileName[ splitFileName.length - 1];
        //console.log("Archivo: " + archivo);
        //console.log("Req: " + req);
        
        //Validar Extensiones válidas
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    
        if( !validExtensions.includes(extension) ){
            reject(`La exntensión ${extension} no está permitida. Las válidas son: ${ validExtensions }`);
        }
        const newName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname , '../uploads/' , '', newName);
        console.log("uploadPath : " + uploadPath);

        const newAlert          = Alert.instanceOf();
        newAlert.idusuario      = body.idusuario;
        newAlert.gps            = body.gps;
        newAlert.tipo           = body.tipo;
        newAlert.nivelbateria   = body.nivelbateria;
        newAlert.estado         = body.estado;
        newAlert.fechamovil     = body.fechamovil;
        newAlert.horamovil      = body.horamovil;

        //console.log("body: " + req.body );
        //console.log(`Datos enviados de la alerta: ${newAlert}`);

        if (archivo) {

            try{
                const fileName = await fileUploadHelper(req.files);
                console.log("url: " + fileName);

                if (fileName != undefined && fileName != null) {
                    newAlert.fotourl = fileName;
                }
                }catch(err)
            {
                /*res.status(400).json({
                    msg: err
                });*/
                console.log("Error fileUploadHelper: " + err);
            }

        }

        //console.log("Alert: " + newAlert);
        if( newAlert.isValid() )
        {
            console.log("Entro isValid: ");
            result = await newAlert.save(-1);
            console.log( result );

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                result
            });
        }
        else{
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro dela alerta',
            });
            }
        

    } 
    catch (error) {
        console.log(`Error: ${error}`);
        return res.status(501).json({
            success: false,
            message: 'Hubo un error con el registro dela alerta',
            error: error
        });
    }
}

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

module.exports = { alertGet, alertPost, alertDelete, alertPatch, alertPut, alertWithImagePost, alertWithImage2 }