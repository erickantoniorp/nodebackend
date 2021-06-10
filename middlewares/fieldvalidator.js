const { validationResult } = require('express-validator');

const validarCampos = ( req, res, next ) => {

    //Recoge los errores del check del express-validator
    const errors = validationResult(req);

    //Si hay errores, muestra error
    if ( !errors.isEmpty())
    {
        return res.status(400).json(errors);
    }

    next();
}

module.exports = { validarCampos }