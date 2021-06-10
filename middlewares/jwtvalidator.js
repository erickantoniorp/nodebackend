const { response } = require('express');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

//Validación del JWT
const validateJWT = async ( req = request, res = response, next )=> {

    const token = req.header('x-token');
    //console.log(token);
    if(!token)
    {
        return res.status(401).json({
            msg: 'Error: No hay token en la petición'
        });
    }

    try{
        const { uid } = jwt.verify( token, process.env.SECRETKEY );
        req.uid = uid;//Obtiene el id del usuario autenticado
        const newUser = user.instanceOf(null);
        const result = await newUser.list( uid, 1 );

        //Si no encontró el usuario
        if( !result || result.rowCount<1)
        {
            return res.status(401).jason({
                msg: 'Token no válido - Usuario no existe en BD'
            });

        }

        newUser.overwriteAll(result.rows[0]);

        //Verificar si usuario (id) está activo
        if(newUser.estado <1)
        {
            return res.status(401).jason({
                msg: 'Token no válido - Usuario Eliminado o Estado erroneo'
            });
        }

        req.authUser = newUser;

        next();

    }catch(err)
    {
        console.log('Error: ocurrió un error al validar el Token'+ err);
        res.status(401).json({
            msg: 'Error: Token no válido'
        });        
    }
}

module.exports = {
    validateJWT
}