const { response } = require('express');
const user = require('../models/user');

const adminRoleValidation = (req, res = response, next) => {

    if( !req.authUser ){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero '
        });
    }

    const { idrol, nombres, apellidop, apellidom, correo } = req.authUser;

    console.log(idrol);
    if ( idrol != 1)
    {
        //Si no es admin
        return res.status(500).json({
            msg: `${ nombres + ' ' + apellidop } no es administrador - Permiso Denegado` 
        });
    }

    next();
}

const roleValidation = ( ...roles) => {


    return ( req, res = response, next) => {

        if( !req.authUser ){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero '
            });
        }

        if( !roles.includes( req.authUser.idrol ))
        {
            return res.status(401).json({
                msg: `el servicio requiere uno de estos roles ${ roles }`
            });
        }

        next();

    }

}

module.exports = {
    adminRoleValidation,
    roleValidation
}