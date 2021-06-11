const path                  = require('path');
const fs                    = require('fs');
const { response }          = require('express');
const { fileUploadHelper }  = require('../helpers/fileupload')
const User                  = require('../models/user');

const uploadFile = async(req, res = response) =>{

    /* Reemplazado en el middleware validateFileToUpload
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).send('No hay archivos para subir');
        return;
    }*/

    try{
        const fileName = await fileUploadHelper(req.files);
        res.json({
            msg: 'Archivo Cargado: ' + fileName
        })
    }catch(err)
    {
        res.status(400).json({
            msg: err
        });
    }

}

const updateImage = async(req, res = response ) =>{

    const {id, collection } = req.params;

    const newUser = User.instanceOf();
    let result;
    let model;

    try{

        switch ( collection ) {
            case 'users':
                model = await newUser.list(id,1);
                if ( !model || model.rowCount<1 ) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${ id }`
                    });
                }
            
            break;

            case 'alerts':
                /*model = await Producto.findById(id);
                if ( !model ) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${ id }`
                    });
                }*/
            
            break;
        
            default:
                return res.status(500).json({ msg: 'Se me olvidó validar esto'});
        }

        console.log(model);

        newUser.overwriteAll(model.rows[0]);

        // Limpiar/Borrar imágenes previas
        if ( newUser.fotourl ) {
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join( __dirname, '../uploads', collection, newUser.fotourl );
            if ( fs.existsSync( pathImagen ) ) {
                fs.unlinkSync( pathImagen );
            }
        }


        const nombre = await fileUploadHelper( req.files, undefined, collection );
        result = await newUser.updatePhotoById(id, nombre);
        newUser.fotourl = nombre;

        res.json({ usuario: newUser});

    }catch(err)
    {
        console.log('Error en updateImage: ' + err);
        return res.status(500).json({ 
            msg: 'Error en updateImage: ' + err
        });
    }
}

const showImage = async(req, res = response ) => {

    const {id, collection } = req.params;

    const newUser = User.instanceOf();
    let result;
    let model;

    try{

        switch ( collection ) {
            case 'users':
                model = await newUser.list(id,1);
                if ( !model || model.rowCount<1 ) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${ id }`
                    });
                }
            
            break;

            case 'alerts':
                /*model = await Producto.findById(id);
                if ( !model ) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${ id }`
                    });
                }*/
            
            break;
        
            default:
                return res.status(500).json({ msg: 'Se me olvidó validar esto'});
        }

        console.log(model);
        newUser.overwriteAll(model.rows[0]);

        // Si Existe la Imagen
        if ( newUser.fotourl ) {
            // La mostramos
            const pathImagen = path.join( __dirname, '../uploads', collection, newUser.fotourl );
            if ( fs.existsSync( pathImagen ) ) {
                return res.sendFile( pathImagen )
            }
        }

        //Sino muestra imagen por defecto
        const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
        res.sendFile( pathImagen );

    }catch(err)
    {
        return res.status(500).json({ msg: 'Ocurrio un Error en showImage: ' + err });
    }
}


module.exports = {
    uploadFile,
    updateImage,
    showImage
}