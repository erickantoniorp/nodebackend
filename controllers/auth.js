const { response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwtgenerator');

const login = async(req, res= response) =>{

    const {correo, clave} = req.body;

    try{

    //verificar si el correo existe
    const newUser = User.instanceOf();
    const result  = await newUser.validEmail( correo );

    if( !newUser || result.rowCount<1 )
    {
        return res.status(400).json({
            msg: 'Usuario/Clave no son correctos - Correo No Existe'
        });
    }

    //Creo Un usuario Temporal desde la BD con el registro traido
    const userInstance = User.fromDB(result.rows[0]);

    //y verifico si el usuario está activo
    if( userInstance.estado <1 )
    {
        return res.status(400).json({
            msg: 'Usuario/Clave no son correctos - Estado es Inactivo'
        });
    }

    //verificar la contraseña
    const validPassword = bcrypt.compareSync(clave, userInstance.clave);

    if( !validPassword )
    {
        return res.status(400).json({
            msg: 'Usuario/Clave no son correctos - Claves no coinciden'
        });
    }

    //generar el jwt
    const token = await generateJWT( userInstance.id );

    res.json({
        msg: 'Inicio se Sesión Correcto',
        usuario: userInstance,
        token
    });

    }catch(err)
    {
        console.log('Error: ' + err);
        return res.status(500).json({
            msg: 'Algo saló mal en el servidor: ' + err
        });
    }

}

module.exports = {
    login
}