const { response } = require('express');
const user = require('../models/user');

//Validación si el id usuario existe
const userIdExists = async ( req = request, res = response, next )=> {


    try{
        const body = req.body;
        
        const newUser = user.instanceOf(null);
        const result = await newUser.list( body.idusuario, 1 );

        //Si no encontró el usuario
        if( !result || result.rowCount<1)
        {
            return res.status(401).jason({
                msg: 'Usuario no válido - Usuario no existe en BD'
            });

        }

        newUser.overwriteAll(result.rows[0]);

        //Verificar si usuario (id) está activo
        if(newUser.estado <1)
        {
            return res.status(401).jason({
                msg: 'Usuario no válido - Usuario Eliminado o Estado erroneo'
            });
        }

        req.authUser = newUser;
        next();

    }catch(err)
    {
        console.log('Error: ocurrió un error al validar el Usuario para Crear Alerta'+ err);
        res.status(401).json({
            msg: 'Error: Usuario no válido'
        });        
    }
}

module.exports = {
    userIdExists
}